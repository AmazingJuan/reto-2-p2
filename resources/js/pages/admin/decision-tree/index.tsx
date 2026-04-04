import { adminListShellClass } from '@/components/admin/admin-page-header';
import { Button } from '@/components/ui/button';
import FlashAlert from '@/components/ui/flashalert';
import AdminLayout from '@/layouts/admin-layout';
import type { PageProps } from '@/types';
import type { RequestPayload } from '@inertiajs/core';
import { router, usePage } from '@inertiajs/react';
import { AlertCircle, GitBranch, Info, Pencil, Plus, Save, Star, Trash2, Trees, X } from 'lucide-react';
import { route } from 'ziggy-js';
import { useEffect, useMemo, useRef, useState } from 'react';

// Types (kept minimal for runtime flexibility)
type InteractionType = 'range' | 'options' | 'input';
type ValueType = 'number' | 'date' | 'text';

interface OptionData {
    label: string;
    next_condition?: number;
    is_other: boolean;
}

interface ConditionData {
    id: number;
    label: string;
    interaction_type: InteractionType;
    type: ValueType;
    observation: string;
    next_condition?: number;
    options: OptionData[];
    multiple?: boolean;
    has_other?: boolean;
}

type DecisionTreePageProps = PageProps<{
    viewData: Record<string, unknown>;
}>;

function findCyclePathInGraph(graph: Record<number, number[]>): number[] | null {
    const visited = new Set<number>();
    const onStack = new Set<number>();
    const stack: number[] = [];

    const dfs = (u: number): number[] | null => {
        visited.add(u);
        onStack.add(u);
        stack.push(u);
        for (const v of graph[u] || []) {
            if (!visited.has(v)) {
                const cycle = dfs(v);
                if (cycle) return cycle;
            } else if (onStack.has(v)) {
                const start = stack.indexOf(v);
                return stack.slice(start).concat(v);
            }
        }
        onStack.delete(u);
        stack.pop();
        return null;
    };

    for (const node of Object.keys(graph).map((k) => Number(k))) {
        if (!visited.has(node)) {
            const cycle = dfs(node);
            if (cycle) return cycle;
        }
    }
    return null;
}

/** Orden estable por id cuando no hay condición inicial o no alcanza al grafo. */
function sortConditionsById(conditions: ConditionData[]): ConditionData[] {
    return [...conditions].sort((a, b) => a.id - b.id);
}

/** Destinos siguientes desde una condición: `next_condition` y luego cada opción (sin duplicar). */
function collectFlowNeighborTargets(c: ConditionData | undefined, allIds: Set<number>): number[] {
    if (!c) return [];
    const out: number[] = [];
    const seen = new Set<number>();
    const push = (x: number | undefined) => {
        if (x === undefined || x === null || !allIds.has(x) || seen.has(x)) return;
        seen.add(x);
        out.push(x);
    };
    push(c.next_condition);
    for (const o of c.options ?? []) {
        push(o.next_condition);
    }
    return out;
}

type FlowContext = {
    labelOf: (id: number) => string;
    depthById: Map<number, number>;
    reachable: Set<number>;
    parentsById: Map<number, number[]>;
    hasInitialInGraph: boolean;
};

/** Profundidad BFS desde la inicial, padres (quién enlaza aquí), y si el nodo es alcanzable. */
function buildFlowContext(conditions: ConditionData[], initialConditionId: number | null | undefined): FlowContext {
    const byId = new Map(conditions.map((c) => [c.id, c]));
    const allIds = new Set(conditions.map((c) => c.id));
    const labelOf = (id: number) => {
        const t = byId.get(id)?.label?.trim();
        return t && t.length > 0 ? t : `Condición #${id}`;
    };

    const depthById = new Map<number, number>();
    const reachable = new Set<number>();
    const start =
        initialConditionId !== null && initialConditionId !== undefined && allIds.has(initialConditionId)
            ? initialConditionId
            : null;
    const hasInitialInGraph = start !== null;

    if (start !== null) {
        const queue: number[] = [start];
        depthById.set(start, 0);
        reachable.add(start);
        while (queue.length > 0) {
            const u = queue.shift()!;
            const d = depthById.get(u)!;
            for (const v of collectFlowNeighborTargets(byId.get(u), allIds)) {
                if (!depthById.has(v)) {
                    depthById.set(v, d + 1);
                    reachable.add(v);
                    queue.push(v);
                }
            }
        }
    }

    const parentsById = new Map<number, number[]>();
    const addParent = (child: number, parent: number) => {
        if (!allIds.has(child)) return;
        const cur = parentsById.get(child) ?? [];
        if (!cur.includes(parent)) cur.push(parent);
        parentsById.set(child, cur);
    };
    for (const c of conditions) {
        if (c.next_condition != null) addParent(c.next_condition, c.id);
        for (const o of c.options ?? []) {
            if (o.next_condition != null) addParent(o.next_condition, c.id);
        }
    }

    return { labelOf, depthById, reachable, parentsById, hasInitialInGraph };
}

const DEPTH_BORDER = [
    'border-l-emerald-500',
    'border-l-sky-500',
    'border-l-indigo-500',
    'border-l-violet-500',
    'border-l-fuchsia-500',
    'border-l-slate-500',
] as const;

/**
 * BFS desde la condición inicial: primero `next_condition`, luego destinos de opciones en orden.
 * Nodos no alcanzables al final, ordenados por id.
 */
function orderConditionsByFlow(conditions: ConditionData[], initialConditionId: number | null | undefined): ConditionData[] {
    if (conditions.length === 0) return conditions;
    const byId = new Map(conditions.map((c) => [c.id, c]));
    const allIds = new Set(conditions.map((c) => c.id));

    const neighbors = (id: number): number[] => collectFlowNeighborTargets(byId.get(id), allIds);

    const start =
        initialConditionId !== null && initialConditionId !== undefined && allIds.has(initialConditionId)
            ? initialConditionId
            : null;

    if (start === null) {
        return sortConditionsById(conditions);
    }

    const orderedIds: number[] = [];
    const visited = new Set<number>();
    const queue: number[] = [start];

    while (queue.length > 0) {
        const u = queue.shift()!;
        if (visited.has(u)) continue;
        visited.add(u);
        orderedIds.push(u);
        for (const v of neighbors(u)) {
            if (!visited.has(v)) {
                queue.push(v);
            }
        }
    }

    const unreachable = conditions.filter((c) => !visited.has(c.id));
    return [...orderedIds.map((id) => byId.get(id)!), ...sortConditionsById(unreachable)];
}

export default function DecisionTreePage() {
    const page = usePage<DecisionTreePageProps & { flash: Record<string, unknown> }>();
    const { props } = page;
    const { flash } = page.props;

    // conditionsByBU: { [businessUnitId]: ConditionData[] }
    const [conditionsByBU, setConditionsByBU] = useState<Record<number, ConditionData[]>>({});
    const [businessUnits, setBusinessUnits] = useState<{ id: number; name: string }[]>([]);
    const [selectedBU, setSelectedBU] = useState<number | null>(null);
    const [editingIdx, setEditingIdx] = useState<number | null>(null);
    const [editingValues, setEditingValues] = useState<{ label: string; observation: string }>({ label: '', observation: '' });
    const [initialConditionByBU, setInitialConditionByBU] = useState<Record<number, number | null>>({});
    const [submitErrors, setSubmitErrors] = useState<string[]>([]);
    const listRef = useRef<HTMLUListElement | null>(null);

    //Scroll into new conditions
    useEffect(() => {
        if (editingIdx !== null) {
            const element = listRef.current?.children[editingIdx] as HTMLElement | undefined;

            element?.scrollIntoView({
                behavior: 'smooth',
                block: 'center',
            });
        }
    }, [editingIdx]);

    useEffect(() => {
        const viewData: any = (props as any).viewData ?? {};

        // businessUnits comes as [{"1":"Name"}, {"2":"Name2"}, ...]
        const rawBUs: any[] = viewData.businessUnits ?? [];
        const bus = rawBUs.map((item: any) => {
            const key = Object.keys(item)[0];
            return { id: Number(key), name: item[key] };
        });

        const rawTrees: any[] = viewData.decisionTrees ?? [];
        const trees: Record<number, ConditionData[]> = {};
        // collect any initial_condition_id provided inside the tree entries
        const initialFromTrees: Record<number, number | null> = {};

        rawTrees.forEach((entry: any) => {
            const key = Object.keys(entry)[0];
            const id = Number(key);
            const payload = entry[key] ?? {};

            // payload can be either the raw conditions collection or an object with { conditions, initial_condition_id }
            let raw = payload;
            if (payload && typeof payload === 'object' && payload.conditions !== undefined) {
                raw = payload.conditions;
                initialFromTrees[id] =
                    payload.initial_condition_id !== undefined && payload.initial_condition_id !== null ? Number(payload.initial_condition_id) : null;
            }

            if (Array.isArray(raw)) {
                trees[id] = raw.map((c: any, i: number) => ({
                    id: typeof c.id === 'number' ? c.id : Date.now() + i,
                    label: c.label ?? '',
                    interaction_type: (c.interaction_type as InteractionType) ?? 'input',
                    type: (c.type as ValueType) ?? 'text',
                    observation: c.observation ?? '',
                    next_condition: c.next_condition !== undefined && c.next_condition !== null ? Number(c.next_condition) : undefined,
                    options: Array.isArray(c.options)
                        ? c.options.map((o: any) => ({
                              label: o.label ?? '',
                              next_condition: o.next_condition !== undefined && o.next_condition !== null ? Number(o.next_condition) : undefined,
                              is_other: !!o.is_other,
                          }))
                        : [],
                    multiple: c.multiple === true || c.multiple === 1,
                    has_other: c.has_other === true || c.has_other === 1,
                }));
            } else if (raw && typeof raw === 'object') {
                // received as an object keyed by condition id -> convert to array
                trees[id] = Object.entries(raw).map(([cid, c]: any) => ({
                    id: Number(cid),
                    label: c.label ?? '',
                    interaction_type: (c.interaction_type as InteractionType) ?? 'input',
                    type: (c.type as ValueType) ?? 'text',
                    observation: c.observation ?? '',
                    next_condition: c.next_condition !== undefined && c.next_condition !== null ? Number(c.next_condition) : undefined,
                    options: Array.isArray(c.options)
                        ? c.options.map((o: any) => ({
                              label: o.label ?? '',
                              next_condition: o.next_condition !== undefined && o.next_condition !== null ? Number(o.next_condition) : undefined,
                              is_other: !!o.is_other,
                          }))
                        : [],
                    multiple: c.multiple === true || c.multiple === 1,
                    checked: c.options ? c.options.some((o: any) => o.is_other) : false,
                }));
            } else {
                trees[id] = [];
            }
        });

        const rawInitials: Record<string, any> = viewData.initial_condition_id ?? {};
        const initMap: Record<number, number | null> = {};
        bus.forEach((b) => {
            const fromTree = (initialFromTrees as any)[b.id];
            if (fromTree !== undefined) {
                initMap[b.id] = fromTree;
                return;
            }
            const val = rawInitials[String(b.id)];
            initMap[b.id] = val !== undefined && val !== null ? Number(val) : null;
        });

        // Cada unidad tiene entrada; orden por recorrido del flujo desde la condición inicial
        bus.forEach((bu) => {
            if (!trees[bu.id]) trees[bu.id] = [];
            trees[bu.id] = orderConditionsByFlow(trees[bu.id], initMap[bu.id] ?? null);
        });

        setBusinessUnits(bus);
        setConditionsByBU(trees);
        setInitialConditionByBU(initMap);
        if (bus.length > 0) setSelectedBU((prev) => prev ?? bus[0].id);
    }, [props]);

    const addCondition = (buId: number) => {
        const id = Date.now();
        const newCond: ConditionData = {
            id,
            label: 'Nueva condición',
            interaction_type: 'input',
            type: 'text',
            observation: '',
            options: [],
            multiple: false,
            has_other: false,
        };
        setConditionsByBU((prev) => {
            const prevList = prev[buId] ?? [];
            const reordered = orderConditionsByFlow([...prevList, newCond], initialConditionByBU[buId] ?? null);
            const newIdx = reordered.findIndex((c) => c.id === newCond.id);
            setEditingIdx(newIdx >= 0 ? newIdx : null);
            setEditingValues({ label: newCond.label, observation: newCond.observation });
            return { ...prev, [buId]: reordered };
        });
    };

    const setInitialConditionForBU = (buId: number | null, conditionId: number) => {
        if (buId === null) return;
        setInitialConditionByBU((prev) => ({ ...prev, [buId]: conditionId }));
        setConditionsByBU((prev) => {
            const list = prev[buId] ?? [];
            const reordered = orderConditionsByFlow(list, conditionId);
            if (editingIdx !== null && selectedBU === buId) {
                const id = list[editingIdx]?.id;
                if (id !== undefined) {
                    const ni = reordered.findIndex((c) => c.id === id);
                    setEditingIdx(ni >= 0 ? ni : null);
                }
            }
            return { ...prev, [buId]: reordered };
        });
    };

    const buildPayload = () => {
        const out: Record<string, { initial_condition_id: number | null; conditions: ConditionData[] }> = {};
        const buIds = new Set<number>([...Object.keys(conditionsByBU).map((k) => Number(k)), ...businessUnits.map((b) => b.id)]);
        buIds.forEach((id) => {
            out[String(id)] = {
                initial_condition_id: initialConditionByBU[id] ?? null,
                conditions: orderConditionsByFlow(conditionsByBU[id] ?? [], initialConditionByBU[id] ?? null).map((c) => ({ ...c })),
            };
        });
        return out;
    };

    const validatePayload = (payload: Record<string, { initial_condition_id: number | null; conditions: ConditionData[] }>) => {
        const errors: string[] = [];
        const allowedInteraction: InteractionType[] = ['input', 'range', 'options'];
        const allowedTypes: ValueType[] = ['text', 'number', 'date'];

        Object.entries(payload).forEach(([buId, data]) => {

            if (data.initial_condition_id === null || data.initial_condition_id === undefined) {
                if (data.conditions.length > 0) {
                    errors.push(`Unidad ${buId}: debes marcar una condición como inicial antes de guardar`);
                }
            }

            if (!Array.isArray(data.conditions)) {
                errors.push(`Unidad ${buId}: 'conditions' debe ser un arreglo`);
                return;
            }
            const ids = data.conditions.map((c) => c.id);
            if (data.initial_condition_id !== null && data.initial_condition_id !== undefined) {
                if (!ids.includes(data.initial_condition_id)) {
                    errors.push(`Unidad ${buId}: 'initial_condition_id' (${data.initial_condition_id}) no pertenece a las condiciones`);
                }
            }

            data.conditions.forEach((c, idx) => {
                if (typeof c.id !== 'number') errors.push(`Unidad ${buId} condición[${idx}]: 'id' debe ser número`);
                if (typeof c.label !== 'string') errors.push(`Unidad ${buId} condición[${idx}]: 'label' debe ser texto`);
                if (!allowedInteraction.includes(c.interaction_type)) errors.push(`Unidad ${buId} condición[${idx}]: 'interaction_type' inválido`);
                if (!allowedTypes.includes(c.type)) errors.push(`Unidad ${buId} condición[${idx}]: 'type' inválido`);
                if (typeof c.observation !== 'string') errors.push(`Unidad ${buId} condición[${idx}]: 'observation' debe ser texto`);

                if (c.next_condition !== undefined && c.next_condition !== null && !ids.includes(c.next_condition)) {
                    errors.push(`Unidad ${buId} condición[${idx}]: 'next_condition' (${c.next_condition}) no pertenece a las condiciones`);
                }

                if (!Array.isArray(c.options)) {
                    errors.push(`Unidad ${buId} condición[${idx}]: 'options' debe ser un arreglo`);
                } else {
                    c.options.forEach((o, oi) => {
                        if (typeof o.label !== 'string') errors.push(`Unidad ${buId} condición[${idx}] opción[${oi}]: 'label' debe ser texto`);
                        if (typeof o.is_other !== 'boolean')
                            errors.push(`Unidad ${buId} condición[${idx}] opción[${oi}]: 'is_other' debe ser booleano`);
                        if (o.next_condition !== undefined && o.next_condition !== null && !ids.includes(o.next_condition)) {
                            errors.push(
                                `Unidad ${buId} condición[${idx}] opción[${oi}]: 'next_condition' (${o.next_condition}) no pertenece a las condiciones`,
                            );
                        }
                    });
                }
            });

            const graph: Record<number, number[]> = {};
            data.conditions.forEach((c) => {
                graph[c.id] = [];
            });
            data.conditions.forEach((c) => {
                if (c.next_condition !== undefined && c.next_condition !== null) {
                    graph[c.id].push(c.next_condition);
                }
                (c.options || []).forEach((o) => {
                    if (o.next_condition !== undefined && o.next_condition !== null) {
                        graph[c.id].push(o.next_condition);
                    }
                });
            });

            const cyclePath = findCyclePathInGraph(graph);
            if (cyclePath !== null) {
                const buConditions = data.conditions;
                const cycleLabels = cyclePath.map((id) => {
                const found = buConditions.find((c) => c.id === id);
                
                return found?.label?.trim() || `Condición #${id}`;
                });
                errors.push(`Unidad ${buId}: ciclo detectado entre condiciones: ${cycleLabels.join(' -> ')}`);
            }
        });

        return errors;
    };

    const handleSaveAll = () => {
        const payload = buildPayload();
        const errors = validatePayload(payload);
        if (errors.length > 0) {
            setSubmitErrors(errors);
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return;
        }
        setSubmitErrors([]);
        router.post(route('dashboard.business-unit.decision-tree.update'), payload as unknown as RequestPayload);
    };

    // run validation reactively when local state changes
    useEffect(() => {
        const payload = buildPayload();
        const errors = validatePayload(payload);
        setSubmitErrors(errors);
    }, [conditionsByBU, initialConditionByBU]);

    const deleteCondition = (buId: number, index: number) => {
        setConditionsByBU((prev) => {
            const list = [...(prev[buId] ?? [])];
            if (index < 0 || index >= list.length) return prev;
            const editingId =
                editingIdx !== null && selectedBU === buId ? (list[editingIdx]?.id ?? null) : null;
            const [removed] = list.splice(index, 1);
            const currentInitial = initialConditionByBU[buId] ?? null;
            const nextInitial = removed.id === currentInitial ? null : currentInitial;

            setInitialConditionByBU((prevInit) => {
                if (prevInit[buId] === removed.id) {
                    return { ...prevInit, [buId]: null };
                }
                return prevInit;
            });

            const sorted = orderConditionsByFlow(list, nextInitial);
            if (editingId !== null && editingId !== undefined) {
                if (removed.id === editingId) {
                    setEditingIdx(null);
                } else {
                    const ni = sorted.findIndex((c) => c.id === editingId);
                    setEditingIdx(ni >= 0 ? ni : null);
                }
            }

            return { ...prev, [buId]: sorted };
        });
    };

    // Per-BU mutation helpers
    const updateConditionForBU = (buId: number, index: number, patch: Partial<ConditionData>) => {
        setConditionsByBU((prev) => {
            const list = [...(prev[buId] ?? [])];
            const editedId =
                editingIdx !== null && selectedBU === buId && index === editingIdx ? list[index]?.id : undefined;
            list[index] = { ...list[index], ...patch };
            const reordered = orderConditionsByFlow(list, initialConditionByBU[buId] ?? null);
            if (editedId !== undefined) {
                const ni = reordered.findIndex((c) => c.id === editedId);
                setEditingIdx(ni >= 0 ? ni : null);
            }
            return { ...prev, [buId]: reordered };
        });
    };

    const addOptionForBU = (buId: number, index: number) => {
        setConditionsByBU((prev) => {
            const list = [...(prev[buId] ?? [])];
            const editedId =
                editingIdx !== null && selectedBU === buId && index === editingIdx ? list[index]?.id : undefined;
            const cond = { ...list[index] };
            cond.options = [...(cond.options ?? []), { label: '', is_other: false }];
            list[index] = cond;
            const reordered = orderConditionsByFlow(list, initialConditionByBU[buId] ?? null);
            if (editedId !== undefined) {
                const ni = reordered.findIndex((c) => c.id === editedId);
                setEditingIdx(ni >= 0 ? ni : null);
            }
            return { ...prev, [buId]: reordered };
        });
    };

    const updateOptionForBU = (buId: number, index: number, optIndex: number, patch: Partial<OptionData>) => {
        setConditionsByBU((prev) => {
            const list = [...(prev[buId] ?? [])];
            const editedId =
                editingIdx !== null && selectedBU === buId && index === editingIdx ? list[index]?.id : undefined;
            const opts = [...(list[index].options ?? [])];
            opts[optIndex] = { ...opts[optIndex], ...patch };
            list[index] = { ...list[index], options: opts };
            const reordered = orderConditionsByFlow(list, initialConditionByBU[buId] ?? null);
            if (editedId !== undefined) {
                const ni = reordered.findIndex((c) => c.id === editedId);
                setEditingIdx(ni >= 0 ? ni : null);
            }
            return { ...prev, [buId]: reordered };
        });
    };

    const removeOptionForBU = (buId: number, index: number, optIndex: number) => {
        setConditionsByBU((prev) => {
            const list = [...(prev[buId] ?? [])];
            const editedId =
                editingIdx !== null && selectedBU === buId && index === editingIdx ? list[index]?.id : undefined;
            const opts = [...(list[index].options ?? [])];
            opts.splice(optIndex, 1);
            list[index] = { ...list[index], options: opts };
            const reordered = orderConditionsByFlow(list, initialConditionByBU[buId] ?? null);
            if (editedId !== undefined) {
                const ni = reordered.findIndex((c) => c.id === editedId);
                setEditingIdx(ni >= 0 ? ni : null);
            }
            return { ...prev, [buId]: reordered };
        });
    };

    const conditionSelectForBU = (buId: number, currentIndex: number, value?: number, onChange?: (v?: number) => void, disabled?: boolean) => {
        const list = conditionsByBU[buId] ?? [];
    return (
        <select
                disabled={disabled}
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm shadow-sm transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-500"
                value={value ?? ''}
                onChange={(e) => onChange?.(e.target.value ? Number(e.target.value) : undefined)}
            >
                <option value="">— Seleccionar condición —</option>
                {list
                    .map((c, i) => ({ c, i }))
                    .filter(({ i }) => i !== currentIndex)
                    .map(({ c }) => (
                        <option key={c.id} value={c.id}>
                            {c.label || '(sin etiqueta)'}
                        </option>
                    ))}
            </select>
        );
    };

    const selectFieldClass =
        'w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm shadow-sm transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-500';
    const textInputClass =
        'w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-500';

    const currentBU = selectedBU !== null ? businessUnits.find((b) => b.id === selectedBU) : undefined;
    const conditionsForBU = selectedBU !== null ? (conditionsByBU[selectedBU] ?? []) : [];
    const initialForSelectedBU = selectedBU !== null ? (initialConditionByBU[selectedBU] ?? null) : null;
    const flow = useMemo(
        () => buildFlowContext(conditionsForBU, initialForSelectedBU),
        [conditionsForBU, initialForSelectedBU],
    );

    const scrollToValidation = () => {
        document.getElementById('decision-tree-validation')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    const scrollToConditionId = (id: number) => {
        const el = document.getElementById(`dt-cond-${id}`);
        if (!el) return;
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    return (
        <AdminLayout>
            <div className={adminListShellClass}>
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="flex items-start gap-3">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                            <Trees className="h-7 w-7" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">Árbol de decisión</h1>
                            <p className="mt-1 max-w-xl text-sm leading-relaxed text-slate-600">
                                Cada condición es un paso del cotizador. Enlaza con <strong>Siguiente condición</strong> o con el destino de cada{' '}
                                <strong>opción</strong>. Marca la <strong>condición inicial</strong> y usa el mapa y el recuadro &quot;Cómo encaja&quot; en
                                cada tarjeta para ver el camino.
                            </p>
                        </div>
                    </div>
                </div>
                <FlashAlert flash={flash} />

                <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-4 sm:p-5">
                    <label htmlFor="decision-tree-bu" className="block text-sm font-semibold text-slate-800">
                        Unidad de negocio
                    </label>
                    <p className="mt-1 text-xs text-slate-500">El árbol se edita por separado para cada unidad.</p>
                    <select
                        id="decision-tree-bu"
                        className={`${selectFieldClass} mt-3 max-w-md`}
                        value={selectedBU ?? ''}
                        onChange={(e) => setSelectedBU(Number(e.target.value))}
                        disabled={editingIdx !== null}
                    >
                        {businessUnits.map((bu) => (
                            <option key={bu.id} value={bu.id}>
                                {bu.name}
                            </option>
                        ))}
                    </select>
                    {editingIdx !== null && (
                        <p className="mt-3 flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-900">
                            <Info className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
                            <span>
                                Termina de editar la condición (Guardar o Cancelar) para poder cambiar de unidad de negocio.
                            </span>
                        </p>
                    )}
                </div>

                <div className="sticky top-2 z-10 sm:top-3" role="region" aria-label="Acciones del árbol">
                    <div className="rounded-2xl border border-slate-200/90 bg-gradient-to-br from-white via-slate-50/70 to-white p-4 shadow-[0_12px_40px_-12px_rgba(15,23,42,0.18)] ring-1 ring-slate-900/[0.04] backdrop-blur-xl sm:p-5">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
                            <div className="flex min-w-0 items-start gap-3.5">
                                <div
                                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#0693e3]/20 to-[#0693e3]/5 text-[#047ac0] shadow-inner shadow-white/60 ring-1 ring-[#0693e3]/15"
                                    aria-hidden
                                >
                                    <Trees className="h-5 w-5" strokeWidth={2} />
                                </div>
                                <div className="min-w-0 pt-0.5">
                                    <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
                                        Unidad seleccionada
                                    </p>
                                    <p className="truncate text-base font-semibold tracking-tight text-slate-900">
                                        {currentBU ? currentBU.name : 'Sin unidad'}
                                    </p>
                                    <p className="mt-0.5 text-xs text-slate-500">
                                        {conditionsForBU.length === 0
                                            ? 'Aún no hay condiciones en este árbol'
                                            : `${conditionsForBU.length} condición${conditionsForBU.length === 1 ? '' : 'es'} · los cambios son locales hasta guardar`}
                                    </p>
                                </div>
                            </div>
                            <div className="flex flex-wrap items-center gap-2.5 sm:justify-end">
                                {submitErrors.length > 0 && (
                                    <button
                                        type="button"
                                        onClick={scrollToValidation}
                                        className="inline-flex items-center gap-2 rounded-xl border border-red-200/90 bg-gradient-to-b from-red-50 to-red-50/50 px-3.5 py-2 text-xs font-semibold text-red-800 shadow-sm transition hover:border-red-300 hover:from-red-100 hover:to-red-50"
                                    >
                                        <AlertCircle className="h-4 w-4 shrink-0 text-red-600" aria-hidden />
                                        {submitErrors.length} error{submitErrors.length === 1 ? '' : 'es'}
                                    </button>
                                )}
                                <Button
                                    type="button"
                                    size="sm"
                                    className="h-10 rounded-xl border-0 bg-gradient-to-b from-[#0693e3] to-[#0580c7] px-5 font-semibold text-white shadow-md shadow-[#0693e3]/35 transition hover:from-[#0588d4] hover:to-[#0470b0] hover:shadow-lg hover:shadow-[#0693e3]/30 disabled:cursor-not-allowed disabled:from-slate-300 disabled:to-slate-400 disabled:text-white/90 disabled:shadow-none"
                                    onClick={handleSaveAll}
                                    disabled={submitErrors.length > 0}
                                    title={submitErrors.length > 0 ? submitErrors.join('\n') : undefined}
                                >
                                    <Save className="h-4 w-4" aria-hidden />
                                    Guardar todo
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>

                {submitErrors.length > 0 && (
                    <div
                        id="decision-tree-validation"
                        role="alert"
                        className="rounded-xl border border-red-200 bg-red-50/90 p-4 text-sm text-red-900 shadow-sm"
                    >
                        <p className="font-semibold">Revisa antes de guardar</p>
                        <p className="mt-1 text-xs text-red-800/90">
                            Corrige los puntos siguientes; el botón Guardar todo se habilitará cuando no queden errores.
                        </p>
                        <ul className="mt-3 list-inside list-disc space-y-1.5 text-sm marker:text-red-400">
                            {submitErrors.map((err, i) => (
                                <li key={i} className="pl-0.5">
                                    {err}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                <div>
                    {selectedBU === null ? (
                        <p className="rounded-xl border border-dashed border-slate-200 bg-slate-50/50 p-8 text-center text-sm text-slate-600">
                            No hay unidades disponibles o aún no se ha cargado la lista.
                        </p>
                    ) : (
                        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                            <header className="flex flex-col gap-3 border-b border-slate-100 bg-slate-50/50 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                                <div>
                                    <h2 className="text-base font-semibold text-slate-900">Condiciones en esta unidad</h2>
                                    <p className="mt-0.5 text-xs text-slate-500">
                                        Usa <span className="font-medium">Editar</span> para cambiar campos; el resto queda bloqueado hasta guardar la
                                        fila. El orden de las tarjetas sigue el flujo desde la condición inicial; las no enlazadas van al final.
                                    </p>
                                </div>
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    className="shrink-0 border-slate-300"
                                    onClick={() => addCondition(Number(selectedBU))}
                                >
                                    <Plus className="h-4 w-4" aria-hidden />
                                    Nueva condición
                                </Button>
                            </header>

                            {conditionsForBU.length > 0 && (
                                <nav
                                    className="border-b border-slate-100 bg-gradient-to-b from-slate-50/90 to-white px-4 py-3 sm:px-6"
                                    aria-label="Mapa del flujo"
                                >
                                    <p className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                                        <GitBranch className="h-3.5 w-3.5 text-slate-400" aria-hidden />
                                        Mapa del flujo — clic para ir a la condición
                                    </p>
                                    <div className="flex flex-wrap gap-2">
                                        {conditionsForBU.map((cond, i) => (
                                            <button
                                                key={cond.id}
                                                type="button"
                                                onClick={() => scrollToConditionId(cond.id)}
                                                className="inline-flex max-w-[min(100%,14rem)] items-center gap-1.5 rounded-full border border-slate-200 bg-white px-2.5 py-1 text-left text-xs text-slate-700 shadow-sm transition hover:border-[#0693e3]/50 hover:bg-blue-50/50"
                                            >
                                                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-slate-100 text-[10px] font-bold text-slate-600">
                                                    {i + 1}
                                                </span>
                                                <span className="truncate font-medium">{cond.label || 'Sin título'}</span>
                                            </button>
                                        ))}
                                    </div>
                                </nav>
                            )}

                            <ul ref={listRef} className="space-y-4 p-4 sm:p-6">
                                {conditionsForBU.length === 0 && (
                                    <li className="rounded-xl border border-dashed border-slate-200 bg-slate-50/40 px-6 py-10 text-center">
                                        <p className="text-sm font-medium text-slate-700">Aún no hay condiciones</p>
                                        <p className="mx-auto mt-1 max-w-sm text-xs text-slate-500">
                                            Añade la primera para definir cómo arranca el flujo de cotización en esta unidad.
                                        </p>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            className="mt-4 border-slate-300"
                                            onClick={() => addCondition(Number(selectedBU))}
                                        >
                                            <Plus className="h-4 w-4" aria-hidden />
                                            Crear primera condición
                                        </Button>
                                    </li>
                                )}

                                {conditionsForBU.map((c, idx) => {
                                    const isInitial = selectedBU !== null && initialConditionByBU[Number(selectedBU)] === c.id;
                                    const anyOptionLeads = (c.options ?? []).some((o) => o.next_condition !== undefined);
                                    const isEditing = editingIdx === idx;
                                    const unreachable = flow.hasInitialInGraph && !flow.reachable.has(c.id);
                                    const depth = flow.depthById.get(c.id);
                                    const flowBorderClass =
                                        !flow.hasInitialInGraph
                                            ? 'border-l-4 border-l-slate-300'
                                            : unreachable
                                              ? 'border-l-4 border-l-amber-500'
                                              : depth !== undefined
                                                ? `border-l-4 ${DEPTH_BORDER[Math.min(depth, DEPTH_BORDER.length - 1)]}`
                                                : 'border-l-4 border-l-slate-300';
                                    const parentIds = flow.parentsById.get(c.id) ?? [];
                                    const optionDestinations = (c.options ?? []).filter((o) => o.next_condition != null);
                                    return (
                                        <li
                                            key={c.id}
                                            className={`space-y-5 rounded-2xl border p-5 pl-4 transition-shadow sm:p-6 sm:pl-5 ${flowBorderClass} ${
                                                isEditing
                                                    ? 'border-blue-300 bg-blue-50/30 shadow-md ring-2 ring-blue-400/40'
                                                    : 'border-slate-200 bg-white shadow-sm hover:border-slate-300'
                                            }`}
                                        >
                                            <div
                                                id={`dt-cond-${c.id}`}
                                                tabIndex={-1}
                                                className="scroll-mt-36 flex flex-col gap-3 outline-none sm:scroll-mt-40 sm:flex-row sm:items-start sm:justify-between"
                                            >
                                                <div className="flex min-w-0 flex-1 flex-wrap items-center gap-2">
                                                    <span className="inline-flex h-7 min-w-[1.75rem] items-center justify-center rounded-md bg-slate-100 px-2 text-xs font-bold text-slate-600">
                                                        {idx + 1}
                                                    </span>
                                                    {isInitial && (
                                                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-medium text-emerald-800">
                                                            <Star className="h-3.5 w-3.5 fill-current" aria-hidden />
                                                            Inicio del flujo
                                                        </span>
                                                    )}
                                                    {isEditing && (
                                                        <span className="rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
                                                            Editando
                                                        </span>
                                                    )}
                                                    <h2 className="flex min-w-0 flex-1 items-center gap-2 text-base font-semibold text-slate-900 sm:text-lg">
                                                        {isEditing ? (
                                                            <input
                                                                className={`${textInputClass} font-semibold`}
                                                                value={editingValues.label}
                                                                onChange={(e) => setEditingValues((v) => ({ ...v, label: e.target.value }))}
                                                                aria-label="Nombre de la condición"
                                                            />
                                                        ) : (
                                                            <span className="truncate">{c.label || 'Condición sin etiqueta'}</span>
                                                        )}
                                                    </h2>
                                                </div>

                                                <button
                                                    type="button"
                                                    onClick={() => setInitialConditionForBU(selectedBU, c.id)}
                                                    className={`shrink-0 rounded-lg border px-3 py-2 text-sm font-medium transition ${
                                                        isInitial
                                                            ? 'border-emerald-300 bg-emerald-50 text-emerald-800'
                                                            : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                                                    }`}
                                                >
                                                    {isInitial ? 'Es la condición inicial' : 'Marcar como condición inicial'}
                                                </button>
                                            </div>

                                            <div className="rounded-xl border border-slate-200 bg-gradient-to-br from-slate-50/90 to-white px-3 py-3 text-xs leading-relaxed text-slate-700 shadow-sm sm:px-4">
                                                <p className="mb-2 flex items-center gap-2 font-semibold text-slate-800">
                                                    <GitBranch className="h-3.5 w-3.5 shrink-0 text-slate-500" aria-hidden />
                                                    Cómo encaja en el flujo
                                                </p>
                                                {!flow.hasInitialInGraph && (
                                                    <p className="text-amber-900">
                                                        <Info className="mr-1 inline h-3.5 w-3.5 shrink-0 align-text-bottom text-amber-700" aria-hidden />
                                                        Marca una condición como <strong>inicial</strong> para ver enlaces entrantes, distancias y el
                                                        mapa con sentido.
                                                    </p>
                                                )}
                                                {flow.hasInitialInGraph && isInitial && (
                                                    <p className="text-emerald-900">
                                                        El cotizador arranca aquí en esta unidad (posición {idx + 1} en la lista).
                                                    </p>
                                                )}
                                                {flow.hasInitialInGraph && !isInitial && unreachable && (
                                                    <p className="text-amber-900">
                                                        <strong>No hay camino</strong> desde la inicial hasta aquí. Enlázala con &quot;Siguiente
                                                        condición&quot; o con el destino de una opción, o conviértela en la inicial.
                                                    </p>
                                                )}
                                                {flow.hasInitialInGraph && !unreachable && !isInitial && parentIds.length > 0 && (
                                                    <p>
                                                        <span className="text-slate-500">Llegas aquí desde: </span>
                                                        {parentIds.map((pid, j) => (
                                                            <span key={pid}>
                                                                {j > 0 ? ' · ' : ''}
                                                                <button
                                                                    type="button"
                                                                    className="font-medium text-[#0693e3] underline-offset-2 hover:underline"
                                                                    onClick={() => scrollToConditionId(pid)}
                                                                >
                                                                    {flow.labelOf(pid)}
                                                                </button>
                                                            </span>
                                                        ))}
                                                    </p>
                                                )}
                                                {flow.hasInitialInGraph && !unreachable && !isInitial && parentIds.length === 0 && (
                                                    <p className="text-slate-600">Forma parte del flujo (puede haber varios caminos hasta aquí).</p>
                                                )}
                                                {flow.hasInitialInGraph && depth !== undefined && (
                                                    <p className="mt-1.5 text-slate-500">
                                                        Pasos desde la inicial: <strong>{depth}</strong>
                                                        {depth === 0 ? ' (inicio)' : ''}
                                                    </p>
                                                )}
                                                {c.next_condition != null && (
                                                    <p className="mt-1.5">
                                                        <span className="text-slate-500">Siguiente si la pregunta termina aquí: </span>
                                                        <button
                                                            type="button"
                                                            className="font-medium text-[#0693e3] underline-offset-2 hover:underline"
                                                            onClick={() => scrollToConditionId(c.next_condition!)}
                                                        >
                                                            {flow.labelOf(c.next_condition)}
                                                        </button>
                                                        {anyOptionLeads && (
                                                            <span className="text-slate-400">
                                                                {' '}
                                                                (con opciones activas suele mandar cada opción, no este enlace)
                                                            </span>
                                                        )}
                                                    </p>
                                                )}
                                                {c.interaction_type === 'options' && optionDestinations.length > 0 && (
                                                    <ul className="mt-2 space-y-1 border-t border-slate-200/80 pt-2">
                                                        {optionDestinations.map((o, oi) => (
                                                            <li key={oi} className="text-slate-700">
                                                                Si elige &quot;{o.label?.trim() || '…'}&quot; →{' '}
                                                                <button
                                                                    type="button"
                                                                    className="font-medium text-[#0693e3] underline-offset-2 hover:underline"
                                                                    onClick={() => scrollToConditionId(o.next_condition!)}
                                                                >
                                                                    {flow.labelOf(o.next_condition!)}
                                                                </button>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                )}
                                            </div>

                                            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                                                <div>
                                                    <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                                                        Tipo de interacción
                                                    </label>
                                                    <p className="mb-2 text-xs text-slate-500">Cómo responde el usuario en el cotizador.</p>
                                                    <select
                                                        className={selectFieldClass}
                                                        value={c.interaction_type}
                                                        disabled={!isEditing}
                                                        onChange={(e) =>
                                                            isEditing &&
                                                            updateConditionForBU(Number(selectedBU), idx, {
                                                                interaction_type: e.target.value as InteractionType,
                                                                options: e.target.value === 'options' ? (c.options ?? []) : [],
                                                                next_condition: undefined,
                                                                multiple: c.multiple ?? false,
                                                            })
                                                        }
                                                    >
                                                        <option value="input">Entrada libre</option>
                                                        <option value="range">Rango</option>
                                                        <option value="options">Lista de opciones</option>
                                                    </select>
                                                </div>

                                                <div>
                                                    <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                                                        Tipo de valor
                                                    </label>
                                                    <p className="mb-2 text-xs text-slate-500">Formato del dato que se guarda.</p>
                                                    <select
                                                        className={selectFieldClass}
                                                        value={c.type}
                                                        disabled={!isEditing}
                                                        onChange={(e) =>
                                                            isEditing &&
                                                            updateConditionForBU(Number(selectedBU), idx, { type: e.target.value as ValueType })
                                                        }
                                                    >
                                                        <option value="text">Texto</option>
                                                        <option value="number">Número</option>
                                                        <option value="date">Fecha</option>
                                                    </select>
                                                </div>
                                            </div>

                                            <div>
                                                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                                                    Observación
                                                </label>
                                                <p className="mb-2 text-xs text-slate-500">Texto de ayuda o contexto para quien cotiza (opcional).</p>
                                                {isEditing ? (
                                                    <input
                                                        className={textInputClass}
                                                        value={editingValues.observation}
                                                        onChange={(e) => setEditingValues((v) => ({ ...v, observation: e.target.value }))}
                                                    />
                                                ) : (
                                                    <input className={textInputClass} value={c.observation} disabled />
                                                )}
                                            </div>

                                            <div className="rounded-lg border border-slate-100 bg-slate-50/60 p-4">
                                                <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                                                    Siguiente condición
                                                </label>
                                                <p className="mb-2 text-xs text-slate-500">
                                                    A dónde salta el flujo al terminar esta pregunta.
                                                </p>
                                                {conditionSelectForBU(
                                                    Number(selectedBU),
                                                    idx,
                                                    c.next_condition,
                                                    (v) => isEditing && updateConditionForBU(Number(selectedBU), idx, { next_condition: v }),
                                                    !isEditing,
                                                )}
                                            </div>

                                            {c.interaction_type === 'options' && (
                                                <div className="space-y-4 rounded-xl border border-slate-100 bg-slate-50/40 p-4">
                                                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                                                        <div>
                                                            <h3 className="text-sm font-semibold text-slate-900">Opciones de respuesta</h3>
                                                            <p className="text-xs text-slate-500">Cada fila es una opción visible en el cotizador.</p>
                                                        </div>
                                                        <Button
                                                            type="button"
                                                            variant="outline"
                                                            size="sm"
                                                            className="shrink-0 border-slate-300"
                                                            disabled={!isEditing}
                                                            onClick={() => isEditing && addOptionForBU(Number(selectedBU), idx)}
                                                        >
                                                            <Plus className="h-4 w-4" aria-hidden />
                                                            Agregar opción
                                                        </Button>
                                                    </div>

                                                    <div className="flex flex-col gap-3 rounded-lg border border-slate-200 bg-white p-3 sm:flex-row sm:items-center sm:justify-between">
                                                        <div>
                                                            <p className="text-sm font-medium text-slate-800">Tipo de selección</p>
                                                            <p className="text-xs text-slate-500">¿El usuario puede elegir una o varias opciones?</p>
                                                        </div>
                                                        <div className="flex gap-2">
                                                            <button
                                                                type="button"
                                                                disabled={!isEditing}
                                                                onClick={() => isEditing && updateConditionForBU(Number(selectedBU), idx, { multiple: false })}
                                                                className={`rounded-lg border px-3 py-1.5 text-xs font-semibold transition ${
                                                                    !c.multiple
                                                                        ? 'border-[#0693e3] bg-[#0693e3]/10 text-[#047ac0]'
                                                                        : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                                                                } disabled:cursor-not-allowed disabled:opacity-50`}
                                                            >
                                                                Selección única
                                                            </button>
                                                            <button
                                                                type="button"
                                                                disabled={!isEditing}
                                                                onClick={() => isEditing && updateConditionForBU(Number(selectedBU), idx, { multiple: true })}
                                                                className={`rounded-lg border px-3 py-1.5 text-xs font-semibold transition ${
                                                                    c.multiple
                                                                        ? 'border-[#0693e3] bg-[#0693e3]/10 text-[#047ac0]'
                                                                        : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                                                                } disabled:cursor-not-allowed disabled:opacity-50`}
                                                            >
                                                                Selección múltiple
                                                            </button>
                                                        </div>
                                                    </div>
                                                    <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700">
                                                       <input
                                                            type="checkbox"
                                                            checked={c.options?.some(o => o.is_other)}
                                                            onChange={(e) => {
                                                                if (e.target.checked) {
                                                                updateConditionForBU(Number(selectedBU), idx, {
                                                                    options: [
                                                                    ...(c.options ?? []),
                                                                    { label: 'Otro', is_other: true }
                                                                    ]
                                                                });
                                                                } else {
                                                                updateConditionForBU(Number(selectedBU), idx, {
                                                                    options: (c.options ?? []).filter(o => !o.is_other)
                                                                });
                                                                }
                                                            }}
                                                            />
                                                        Permitir respuesta &quot;Otro&quot; (campo libre al final de las opciones)
                                                    </label>
                                                    
                                                    {/* Opciones normales primero */}
                                                    {(c.options ?? []).filter(option => !option.is_other).map((option, optIdx) => {
                                                        const realIdx = (c.options ?? []).findIndex(o => o === option);
                                                        return (
                                                            <div key={realIdx} className="space-y-3 rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
                                                                <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:gap-4">
                                                                    <div className="min-w-0 flex-1">
                                                                        <label className="mb-1 block text-xs font-medium text-slate-600">Texto mostrado</label>
                                                                        <input
                                                                            disabled={!isEditing}
                                                                            className={textInputClass}
                                                                            placeholder="Ej.: Sí / No / Otra"
                                                                            value={option.label}
                                                                            onChange={(e) =>
                                                                                isEditing && updateOptionForBU(Number(selectedBU), idx, realIdx, { label: e.target.value })
                                                                            }
                                                                        />
                                                                    </div>
                                                                </div>
                                                                <div className="flex justify-end border-t border-slate-100 pt-3">
                                                                    <Button
                                                                        type="button"
                                                                        variant="ghost"
                                                                        size="sm"
                                                                        className="text-red-600 hover:bg-red-50 hover:text-red-700"
                                                                        disabled={!isEditing}
                                                                        onClick={() => isEditing && removeOptionForBU(Number(selectedBU), idx, realIdx)}
                                                                    >
                                                                        <Trash2 className="h-4 w-4" aria-hidden />
                                                                        Quitar opción
                                                                    </Button>
                                                                </div>
                                                            </div>
                                                        );
                                                    })}

                                                    {/* Opción "Otro" siempre al final */}
                                                    {(c.options ?? []).filter(option => option.is_other).map((option) => {
                                                        const realIdx = (c.options ?? []).findIndex(o => o === option);
                                                        return (
                                                            <div key={realIdx} className="space-y-3 rounded-lg border border-dashed border-slate-300 bg-slate-50/50 p-4">
                                                                <p className="text-xs font-medium text-slate-500">Opción "Otro" — campo libre</p>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            )}

                                            <div className="flex flex-wrap items-center gap-2 border-t border-slate-100 pt-4">
                                                {isEditing ? (
                                                    <>
                                                        <Button
                                                            type="button"
                                                            size="sm"
                                                            className="bg-[#0693e3] text-white hover:bg-[#047ac0]"
                                                            onClick={() => {
                                                                setConditionsByBU((prev) => {
                                                                    const list = [...(prev[selectedBU] ?? [])];
                                                                    list[idx] = {
                                                                        ...list[idx],
                                                                        label: editingValues.label,
                                                                        observation: editingValues.observation,
                                                                    };
                                                                    return {
                                                                        ...prev,
                                                                        [Number(selectedBU)]: orderConditionsByFlow(
                                                                            list,
                                                                            initialConditionByBU[Number(selectedBU)] ?? null,
                                                                        ),
                                                                    };
                                                                });
                                                                setEditingIdx(null);
                                                            }}
                                                        >
                                                            <Save className="h-4 w-4" aria-hidden />
                                                            Guardar cambios
                                                        </Button>
                                                        <Button type="button" variant="outline" size="sm" onClick={() => setEditingIdx(null)}>
                                                            <X className="h-4 w-4" aria-hidden />
                                                            Cancelar
                                                        </Button>
                                                    </>
                                                ) : (
                                                    <>
                                                        <Button
                                                            type="button"
                                                            variant="outline"
                                                            size="sm"
                                                            className="border-slate-300"
                                                            onClick={() => {
                                                                setEditingIdx(idx);
                                                                setEditingValues({ label: c.label, observation: c.observation });
                                                            }}
                                                        >
                                                            <Pencil className="h-4 w-4" aria-hidden />
                                                            Editar
                                                        </Button>
                                                        <Button
                                                            type="button"
                                                            variant="ghost"
                                                            size="sm"
                                                            className="text-red-600 hover:bg-red-50 hover:text-red-700"
                                                            onClick={() => deleteCondition(Number(selectedBU), idx)}
                                                        >
                                                            <Trash2 className="h-4 w-4" aria-hidden />
                                                            Eliminar
                                                        </Button>
                                                    </>
                                                )}
                                            </div>
                                        </li>
                                    );
                                })}
                            </ul>
                        </section>
                    )}
                </div>

                <div className="sm:hidden">
                    <div className="rounded-2xl border border-slate-200/90 bg-gradient-to-br from-slate-50/90 to-white p-3 shadow-[0_8px_30px_-10px_rgba(15,23,42,0.15)] ring-1 ring-slate-900/[0.04]">
                        <Button
                            type="button"
                            size="sm"
                            className="h-11 w-full rounded-xl border-0 bg-gradient-to-b from-[#0693e3] to-[#0580c7] font-semibold text-white shadow-md shadow-[#0693e3]/30 hover:from-[#0588d4] hover:to-[#0470b0] disabled:from-slate-300 disabled:to-slate-400 disabled:shadow-none"
                            onClick={handleSaveAll}
                            disabled={submitErrors.length > 0}
                        >
                            <Save className="h-4 w-4" aria-hidden />
                            Guardar todo
                        </Button>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}