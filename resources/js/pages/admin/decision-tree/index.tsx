import { Button } from '@/components/ui/button';
import FlashAlert from '@/components/ui/flashalert';
import AdminLayout from '@/layouts/admin-layout';
import { router, usePage } from '@inertiajs/react';
import { Plus, Star, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';

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
}

export default function DecisionTreePage() {
    const { props } = usePage();

    // conditionsByBU: { [businessUnitId]: ConditionData[] }
    const [conditionsByBU, setConditionsByBU] = useState<Record<number, ConditionData[]>>({});
    const [businessUnits, setBusinessUnits] = useState<{ id: number; name: string }[]>([]);
    const [selectedBU, setSelectedBU] = useState<number | null>(null);
    const [editingIdx, setEditingIdx] = useState<number | null>(null);
    const [editingValues, setEditingValues] = useState<{ label: string; observation: string }>({ label: '', observation: '' });
    const [initialConditionByBU, setInitialConditionByBU] = useState<Record<number, number | null>>({});
    const [submitErrors, setSubmitErrors] = useState<string[]>([]);
    const { flash } = usePage().props as any;

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
                }));
            } else {
                trees[id] = [];
            }
        });

        // Ensure we have an entry for each business unit
        bus.forEach((bu) => {
            if (!trees[bu.id]) trees[bu.id] = [];
        });

        setBusinessUnits(bus);
        setConditionsByBU(trees);
        // initialize initial condition map (read from server if provided)
        const rawInitials: Record<string, any> = viewData.initial_condition_id ?? {};
        const initMap: Record<number, number | null> = {};
        bus.forEach((b) => {
            // prefer initial condition provided inside the tree payload if present
            const fromTree = (initialFromTrees as any)[b.id];
            if (fromTree !== undefined) {
                initMap[b.id] = fromTree;
                return;
            }
            const val = rawInitials[String(b.id)];
            initMap[b.id] = val !== undefined && val !== null ? Number(val) : null;
        });
        setInitialConditionByBU(initMap);
        if (bus.length > 0) setSelectedBU((prev) => prev ?? bus[0].id);
    }, [props]);

    // Move a condition up/down within the same BU
    const moveWithin = (buId: number, from: number, to: number) => {
        setConditionsByBU((prev) => {
            const list = [...(prev[buId] ?? [])];
            if (from < 0 || from >= list.length || to < 0 || to >= list.length) return prev;
            const [item] = list.splice(from, 1);
            list.splice(to, 0, item);
            return { ...prev, [buId]: list };
        });
    };

    // Transfer a condition from one BU to another (append to target)
    const transfer = (fromBu: number, toBu: number, index: number) => {
        setConditionsByBU((prev) => {
            const from = [...(prev[fromBu] ?? [])];
            const to = [...(prev[toBu] ?? [])];
            if (index < 0 || index >= from.length) return prev;
            const [item] = from.splice(index, 1);
            to.push(item);
            // update initial condition mapping if needed
            setInitialConditionByBU((prevInit) => {
                const next = { ...prevInit };
                if (next[fromBu] === item.id) {
                    next[fromBu] = null;
                    next[toBu] = item.id;
                }
                return next;
            });

            return { ...prev, [fromBu]: from, [toBu]: to };
        });
    };

    const addCondition = (buId: number) => {
        const id = Date.now();
        const newCond: ConditionData = {
            id,
            label: 'Nueva condición',
            interaction_type: 'input',
            type: 'text',
            observation: '',
            options: [],
        };
        setConditionsByBU((prev) => {
            const prevList = prev[buId] ?? [];
            const list = [...prevList, newCond];
            // open the newly created condition in edit mode and populate editing values
            setEditingIdx(list.length - 1);
            setEditingValues({ label: newCond.label, observation: newCond.observation });
            return { ...prev, [buId]: list };
        });
    };

    const setInitialConditionForBU = (buId: number | null, conditionId: number) => {
        if (buId === null) return;
        setInitialConditionByBU((prev) => ({ ...prev, [buId]: conditionId }));
    };

    const buildPayload = () => {
        const out: Record<string, { initial_condition_id: number | null; conditions: ConditionData[] }> = {};
        const buIds = new Set<number>([...Object.keys(conditionsByBU).map((k) => Number(k)), ...businessUnits.map((b) => b.id)]);
        buIds.forEach((id) => {
            out[String(id)] = {
                initial_condition_id: initialConditionByBU[id] ?? null,
                conditions: (conditionsByBU[id] ?? []).map((c) => ({ ...c })),
            };
        });
        return out;
    };

    const validatePayload = (payload: Record<string, { initial_condition_id: number | null; conditions: ConditionData[] }>) => {
        const errors: string[] = [];
        const allowedInteraction: InteractionType[] = ['input', 'range', 'options'];
        const allowedTypes: ValueType[] = ['text', 'number', 'date'];

        Object.entries(payload).forEach(([buId, data]) => {
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
                    // Detect cycles per BU: build a directed graph where edges are next_condition references
                    Object.entries(payload).forEach(([buId, data]) => {
                        const graph: Record<number, number[]> = {};
                        data.conditions.forEach((c) => {
                            graph[c.id] = [];
                        });
                        data.conditions.forEach((c) => {
                            // edges from condition -> next_condition (if any)
                            if (c.next_condition !== undefined && c.next_condition !== null) {
                                graph[c.id].push(c.next_condition);
                            }
                            // edges from options -> next_condition
                            (c.options || []).forEach((o) => {
                                if (o.next_condition !== undefined && o.next_condition !== null) {
                                    graph[c.id].push(o.next_condition);
                                }
                            });
                        });

                        const visited = new Set<number>();
                        const onStack = new Set<number>();
                        const stack: number[] = [];
                        let found: (number | null)[] | null = null;

                        const dfs = (u: number): boolean => {
                            visited.add(u);
                            onStack.add(u);
                            stack.push(u);
                            for (const v of graph[u] || []) {
                                if (!visited.has(v)) {
                                    if (dfs(v)) return true;
                                } else if (onStack.has(v)) {
                                    const start = stack.indexOf(v);
                                    found = stack.slice(start).concat(v);
                                    return true;
                                }
                            }
                            onStack.delete(u);
                            stack.pop();
                            return false;
                        };

                        for (const node of Object.keys(graph).map((k) => Number(k))) {
                            if (!visited.has(node)) {
                                if (dfs(node)) break;
                            }
                        }

                        if (found) {
                            errors.push(`Unidad ${buId}: ciclo detectado entre condiciones: ${(found as (number | null)[]).join(' -> ')}`);
                        }
                    });

                    return errors;
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
        const url = (window as any).route ? (window as any).route('dashboard.business-unit.decision-tree.update') : '/dashboard/arbol-decision';
        router.post(url, payload as any);
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
            const [removed] = list.splice(index, 1);
            // clear initial if it was the removed condition
            setInitialConditionByBU((prevInit) => {
                if (prevInit[buId] === removed.id) {
                    return { ...prevInit, [buId]: null };
                }
                return prevInit;
            });

            return { ...prev, [buId]: list };
        });
    };

    // Per-BU mutation helpers
    const updateConditionForBU = (buId: number, index: number, patch: Partial<ConditionData>) => {
        setConditionsByBU((prev) => {
            const list = [...(prev[buId] ?? [])];
            list[index] = { ...list[index], ...patch };
            return { ...prev, [buId]: list };
        });
    };

    const addOptionForBU = (buId: number, index: number) => {
        setConditionsByBU((prev) => {
            const list = [...(prev[buId] ?? [])];
            const cond = { ...list[index] };
            cond.options = [...(cond.options ?? []), { label: '', is_other: false }];
            list[index] = cond;
            return { ...prev, [buId]: list };
        });
    };

    const updateOptionForBU = (buId: number, index: number, optIndex: number, patch: Partial<OptionData>) => {
        setConditionsByBU((prev) => {
            const list = [...(prev[buId] ?? [])];
            const opts = [...(list[index].options ?? [])];
            opts[optIndex] = { ...opts[optIndex], ...patch };
            list[index] = { ...list[index], options: opts };
            return { ...prev, [buId]: list };
        });
    };

    const removeOptionForBU = (buId: number, index: number, optIndex: number) => {
        setConditionsByBU((prev) => {
            const list = [...(prev[buId] ?? [])];
            const opts = [...(list[index].options ?? [])];
            opts.splice(optIndex, 1);
            list[index] = { ...list[index], options: opts };
            return { ...prev, [buId]: list };
        });
    };

    const conditionSelectForBU = (buId: number, currentIndex: number, value?: number, onChange?: (v?: number) => void, disabled?: boolean) => {
        const list = conditionsByBU[buId] ?? [];
        return (
            <select
                disabled={disabled}
                className={`w-full rounded-lg border p-2 ${disabled ? 'bg-gray-100' : ''}`}
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

    return (
        <AdminLayout>
            <div className="mx-auto max-w-7xl space-y-6">
                <h1 className="text-2xl font-semibold">Árbol de decisión</h1>
                <FlashAlert flash={flash}/>

                <div className="flex items-center gap-4">
                    <label className="text-sm">Unidad de negocio:</label>
                    <select
                        className="rounded border px-3 py-2"
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
                </div>

                {submitErrors.length > 0 && (
                    <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-800">
                        <strong>Errores de validación:</strong>
                        <ul className="mt-2 list-disc pl-5">
                            {submitErrors.map((err, i) => (
                                <li key={i}>{err}</li>
                            ))}
                        </ul>
                    </div>
                )}

                <div>
                    {selectedBU === null ? (
                        <p className="text-sm text-gray-500">Seleccione una unidad de negocio para ver su árbol de decisión.</p>
                    ) : (
                        <section className="rounded-2xl border bg-white p-4">
                            <header className="mb-3 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Button variant="crear" size="sm" onClick={() => addCondition(Number(selectedBU))}>
                                        <Plus className="h-4 w-4" />
                                    </Button>
                                </div>
                                {/* Guardar todo moved below the section, above the JSON preview */}
                            </header>

                            <ul className="space-y-3">
                                {(conditionsByBU[selectedBU] ?? []).length === 0 && <li className="text-sm text-gray-500">Sin condiciones.</li>}

                                {(conditionsByBU[selectedBU] ?? []).map((c, idx) => {
                                    const isInitial = selectedBU !== null && initialConditionByBU[Number(selectedBU)] === c.id;
                                    const anyOptionLeads = (c.options ?? []).some((o) => o.next_condition !== undefined);
                                    return (
                                        <li key={c.id} className="space-y-4 rounded-2xl border p-6 shadow-sm">
                                            <div className="flex items-center justify-between">
                                                <h2 className="flex items-center gap-2 text-lg font-semibold">
                                                    {isInitial && <Star className="h-4 w-4 text-green-600" />}
                                                    {editingIdx === idx ? (
                                                        <input
                                                            className="rounded border p-1"
                                                            value={editingValues.label}
                                                            onChange={(e) => setEditingValues((v) => ({ ...v, label: e.target.value }))}
                                                        />
                                                    ) : (
                                                        c.label || 'Condición sin etiqueta'
                                                    )}
                                                </h2>

                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={() => setInitialConditionForBU(selectedBU, c.id)}
                                                        className={`inline-flex items-center gap-2 rounded-md border px-3 py-1 text-sm ${isInitial ? 'border-green-400 bg-green-50 text-green-700' : 'bg-white hover:bg-gray-50'}`}
                                                    >
                                                        {isInitial ? 'Condición inicial' : 'Marcar como inicial'}
                                                    </button>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                                <div>
                                                    <label className="mb-2 block text-sm font-medium text-gray-700">Tipo de interacción</label>
                                                    <select
                                                        className="w-full rounded-lg border p-2"
                                                        value={c.interaction_type}
                                                        disabled={editingIdx !== idx}
                                                        onChange={(e) =>
                                                            editingIdx === idx &&
                                                            updateConditionForBU(Number(selectedBU), idx, {
                                                                interaction_type: e.target.value as InteractionType,
                                                                options: e.target.value === 'options' ? (c.options ?? []) : [],
                                                                next_condition: undefined,
                                                            })
                                                        }
                                                    >
                                                        <option value="input">Entrada</option>
                                                        <option value="range">Rango</option>
                                                        <option value="options">Opciones</option>
                                                    </select>
                                                </div>

                                                <div>
                                                    <label className="mb-2 block text-sm font-medium text-gray-700">Tipo de valor</label>
                                                    <select
                                                        className="w-full rounded-lg border p-2"
                                                        value={c.type}
                                                        disabled={editingIdx !== idx}
                                                        onChange={(e) =>
                                                            editingIdx === idx &&
                                                            updateConditionForBU(Number(selectedBU), idx, { type: e.target.value as ValueType })
                                                        }
                                                    >
                                                        <option value="text">Texto</option>
                                                        <option value="number">Número</option>
                                                        <option value="date">Fecha</option>
                                                    </select>
                                                </div>
                                            </div>

                                            {/* La etiqueta se edita en el encabezado; input duplicado eliminado */}

                                            <div>
                                                <label className="mb-2 block text-sm font-medium text-gray-700">Observación</label>
                                                {editingIdx === idx ? (
                                                    <input
                                                        className="w-full rounded-lg border p-2"
                                                        value={editingValues.observation}
                                                        onChange={(e) => setEditingValues((v) => ({ ...v, observation: e.target.value }))}
                                                    />
                                                ) : (
                                                    <input className="w-full rounded-lg border p-2" value={c.observation} disabled />
                                                )}
                                            </div>

                                            <div className="space-y-3">
                                                <label className="text-sm text-gray-600">Siguiente condición</label>
                                                {conditionSelectForBU(
                                                    Number(selectedBU),
                                                    idx,
                                                    c.next_condition,
                                                    (v) => editingIdx === idx && updateConditionForBU(Number(selectedBU), idx, { next_condition: v }),
                                                    editingIdx !== idx || anyOptionLeads,
                                                )}
                                                {anyOptionLeads && <p className="text-xs text-gray-500">Bloqueado porque una opción ya redirige</p>}
                                            </div>

                                            {c.interaction_type === 'options' && (
                                                <div className="space-y-3">
                                                    <div className="flex items-center justify-between">
                                                        <h3 className="font-medium">Opciones</h3>
                                                        <button
                                                            disabled={editingIdx !== idx}
                                                            onClick={() => editingIdx === idx && addOptionForBU(Number(selectedBU), idx)}
                                                            className="flex items-center gap-1 rounded-lg border px-3 py-1 text-sm hover:bg-gray-50"
                                                        >
                                                            <Plus className="h-4 w-4" /> Agregar opción
                                                        </button>
                                                    </div>

                                                    {(c.options ?? []).map((option, optIdx) => (
                                                        <div key={optIdx} className="grid grid-cols-1 items-center gap-3 md:grid-cols-4">
                                                            <input
                                                                disabled={editingIdx !== idx}
                                                                className="rounded-lg border p-2 md:col-span-1"
                                                                placeholder="Etiqueta"
                                                                value={option.label}
                                                                onChange={(e) =>
                                                                    editingIdx === idx &&
                                                                    updateOptionForBU(Number(selectedBU), idx, optIdx, { label: e.target.value })
                                                                }
                                                            />

                                                            <div className="md:col-span-2">
                                                                {conditionSelectForBU(
                                                                    Number(selectedBU),
                                                                    idx,
                                                                    option.next_condition,
                                                                    (v) =>
                                                                        editingIdx === idx &&
                                                                        updateOptionForBU(Number(selectedBU), idx, optIdx, { next_condition: v }),
                                                                    editingIdx !== idx || c.next_condition !== undefined,
                                                                )}
                                                            </div>

                                                            <label className="flex items-center gap-2 text-sm">
                                                                <input
                                                                    type="checkbox"
                                                                    checked={option.is_other}
                                                                    disabled={editingIdx !== idx}
                                                                    onChange={(e) =>
                                                                        editingIdx === idx &&
                                                                        updateOptionForBU(Number(selectedBU), idx, optIdx, {
                                                                            is_other: e.target.checked,
                                                                        })
                                                                    }
                                                                />
                                                                Otro
                                                            </label>

                                                            <div>
                                                                <button
                                                                    disabled={editingIdx !== idx}
                                                                    onClick={() =>
                                                                        editingIdx === idx && removeOptionForBU(Number(selectedBU), idx, optIdx)
                                                                    }
                                                                    className="rounded-lg p-2 hover:bg-red-50"
                                                                >
                                                                    <Trash2 className="h-4 w-4" />
                                                                </button>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}

                                            <div className="flex items-center gap-3">
                                                {editingIdx === idx ? (
                                                    <>
                                                        <button
                                                            onClick={() => {
                                                                // save
                                                                setConditionsByBU((prev) => {
                                                                    const list = [...(prev[selectedBU] ?? [])];
                                                                    list[idx] = {
                                                                        ...list[idx],
                                                                        label: editingValues.label,
                                                                        observation: editingValues.observation,
                                                                    };
                                                                    return { ...prev, [Number(selectedBU)]: list };
                                                                });
                                                                setEditingIdx(null);
                                                            }}
                                                            className="text-sm text-blue-600"
                                                        >
                                                            Guardar
                                                        </button>
                                                        <button onClick={() => setEditingIdx(null)} className="text-sm text-slate-600">
                                                            Cancelar
                                                        </button>
                                                    </>
                                                ) : (
                                                    <>
                                                        <button
                                                            onClick={() => {
                                                                setEditingIdx(idx);
                                                                setEditingValues({ label: c.label, observation: c.observation });
                                                            }}
                                                            className="text-sm text-slate-700"
                                                        >
                                                            Editar
                                                        </button>
                                                        <button
                                                            onClick={() => deleteCondition(Number(selectedBU), idx)}
                                                            className="text-sm text-red-600"
                                                        >
                                                            <Trash2 className="inline h-4 w-4" /> Eliminar
                                                        </button>
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

                <div className="mt-4 flex justify-end">
                    <Button
                        variant="crear"
                        size="sm"
                        onClick={handleSaveAll}
                        disabled={submitErrors.length > 0}
                        title={submitErrors.length > 0 ? submitErrors.join('\n') : undefined}
                    >
                        Guardar todo
                    </Button>
                </div>

                <pre className="overflow-auto rounded-lg bg-gray-100 p-4 text-xs">
                    {JSON.stringify(
                        (() => {
                            const out: Record<string, { initial_condition_id: number | null; conditions: ConditionData[] }> = {};
                            // ensure we include all known BU ids
                            const buIds = new Set<number>([...Object.keys(conditionsByBU).map((k) => Number(k)), ...businessUnits.map((b) => b.id)]);
                            buIds.forEach((id) => {
                                out[String(id)] = {
                                    initial_condition_id: initialConditionByBU[id] ?? null,
                                    conditions: conditionsByBU[id] ?? [],
                                };
                            });
                            return out;
                        })(),
                        null,
                        2,
                    )}
                </pre>
            </div>
        </AdminLayout>
    );
}
