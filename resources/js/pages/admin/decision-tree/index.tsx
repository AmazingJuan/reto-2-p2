import React, { useEffect, useState } from 'react';
import { Plus, Trash2, Star } from 'lucide-react';
import AdminLayout from '@/layouts/admin-layout';
import { Button } from '@/components/ui/button';
import { usePage, router } from '@inertiajs/react';

// Types (kept minimal for runtime flexibility)
type InteractionType = 'range' | 'options' | 'input';
type ValueType = 'number' | 'date' | 'text';

interface OptionData {
  label: string;
  next_condition?: number;
  is_alternative: boolean;
}

interface ConditionData {
  id: number;
  label: string;
  interaction_type: InteractionType;
  type: ValueType;
  observation: string;
  allows_multiple_values: boolean;
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
    rawTrees.forEach((entry: any) => {
      const key = Object.keys(entry)[0];
      const id = Number(key);
      trees[id] = entry[key] ?? [];
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
      const val = rawInitials[String(b.id)];
      initMap[b.id] = val !== undefined && val !== null ? Number(val) : null;
    });
    setInitialConditionByBU(initMap);
    if (bus.length > 0) setSelectedBU((prev) => (prev ?? bus[0].id));
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
      allows_multiple_values: false,
      options: [],
    };
    setConditionsByBU((prev) => ({ ...prev, [buId]: [...(prev[buId] ?? []), newCond] }));
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
        if (typeof c.allows_multiple_values !== 'boolean') errors.push(`Unidad ${buId} condición[${idx}]: 'allows_multiple_values' debe ser booleano`);

        if (c.next_condition !== undefined && c.next_condition !== null && !ids.includes(c.next_condition)) {
          errors.push(`Unidad ${buId} condición[${idx}]: 'next_condition' (${c.next_condition}) no pertenece a las condiciones`);
        }

        if (!Array.isArray(c.options)) {
          errors.push(`Unidad ${buId} condición[${idx}]: 'options' debe ser arreglo`);
        } else {
          c.options.forEach((o, oi) => {
            if (typeof o.label !== 'string') errors.push(`Unidad ${buId} condición[${idx}] opción[${oi}]: 'label' debe ser texto`);
            if (typeof o.is_alternative !== 'boolean') errors.push(`Unidad ${buId} condición[${idx}] opción[${oi}]: 'is_alternative' debe ser booleano`);
            if (o.next_condition !== undefined && o.next_condition !== null && !ids.includes(o.next_condition)) {
              errors.push(`Unidad ${buId} condición[${idx}] opción[${oi}]: 'next_condition' (${o.next_condition}) no pertenece a las condiciones`);
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
      cond.options = [...(cond.options ?? []), { label: '', is_alternative: false }];
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

  const conditionSelectForBU = (
    buId: number,
    currentIndex: number,
    value?: number,
    onChange?: (v?: number) => void,
    disabled?: boolean
  ) => {
    const list = conditionsByBU[buId] ?? [];
    return (
      <select
        disabled={disabled}
        className={`border rounded-lg p-2 w-full ${disabled ? 'bg-gray-100' : ''}`}
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
      <div className="max-w-7xl mx-auto space-y-6">
        <h1 className="text-2xl font-semibold">Árbol de decisión</h1>

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

        <div>
          {selectedBU === null ? (
            <p className="text-sm text-gray-500">Seleccione una unidad de negocio para ver su árbol de decisión.</p>
          ) : (
            <section className="rounded-2xl border bg-white p-4">
              <header className="mb-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Button variant="crear" size="sm" onClick={() => addCondition(Number(selectedBU))}>
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                {/* Guardar todo moved below the section, above the JSON preview */}
              </header>

              <ul className="space-y-3">
                {(conditionsByBU[selectedBU] ?? []).length === 0 && <li className="text-sm text-gray-500">Sin condiciones.</li>}

                {(conditionsByBU[selectedBU] ?? []).map((c, idx) => {
                  const isInitial = selectedBU !== null && (initialConditionByBU[Number(selectedBU)] === c.id);
                  const anyOptionLeads = (c.options ?? []).some((o) => o.next_condition !== undefined);
                  return (
                    <li key={c.id} className="rounded-2xl border shadow-sm p-6 space-y-4">
                      <div className="flex justify-between items-center">
                        <h2 className="font-semibold text-lg flex items-center gap-2">
                          {isInitial && <Star className="w-4 h-4 text-green-600" />}
                          {editingIdx === idx ? (
                            <input
                              className="border p-1 rounded"
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
                            className={`inline-flex items-center gap-2 text-sm px-3 py-1 rounded-md border ${isInitial ? 'bg-green-50 border-green-400 text-green-700' : 'bg-white hover:bg-gray-50'}`}
                          >
                            {isInitial ? 'Condición inicial' : 'Marcar como inicial'}
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="mb-2 block text-sm font-medium text-gray-700">Tipo de interacción</label>
                          <select
                            className="border rounded-lg p-2 w-full"
                            value={c.interaction_type}
                            onChange={(e) => updateConditionForBU(Number(selectedBU), idx, { interaction_type: e.target.value as InteractionType, options: e.target.value === 'options' ? c.options ?? [] : [], next_condition: undefined })}
                          >
                            <option value="input">Entrada</option>
                            <option value="range">Rango</option>
                            <option value="options">Opciones</option>
                          </select>
                        </div>

                        <div>
                          <label className="mb-2 block text-sm font-medium text-gray-700">Tipo de valor</label>
                          <select className="border rounded-lg p-2 w-full" value={c.type} onChange={(e) => updateConditionForBU(Number(selectedBU), idx, { type: e.target.value as ValueType })}>
                            <option value="text">Texto</option>
                            <option value="number">Número</option>
                            <option value="date">Fecha</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">Etiqueta</label>
                        {editingIdx === idx ? (
                          <input className="border rounded-lg p-2 w-full" value={editingValues.label} onChange={(e) => setEditingValues((v) => ({ ...v, label: e.target.value }))} />
                        ) : (
                          <input className="border rounded-lg p-2 w-full" value={c.label} onChange={(e) => updateConditionForBU(Number(selectedBU), idx, { label: e.target.value })} />
                        )}
                      </div>

                      <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">Observación</label>
                        {editingIdx === idx ? (
                          <input className="border rounded-lg p-2 w-full" value={editingValues.observation} onChange={(e) => setEditingValues((v) => ({ ...v, observation: e.target.value }))} />
                        ) : (
                          <input className="border rounded-lg p-2 w-full" value={c.observation} onChange={(e) => updateConditionForBU(Number(selectedBU), idx, { observation: e.target.value })} />
                        )}
                      </div>

                      <label className="flex items-center gap-2 text-sm">
                        <input type="checkbox" checked={c.allows_multiple_values} onChange={(e) => updateConditionForBU(Number(selectedBU), idx, { allows_multiple_values: e.target.checked })} />
                        Permite múltiples valores
                      </label>

                      <div className="space-y-3">
                        <label className="text-sm text-gray-600">Siguiente condición</label>
                        {conditionSelectForBU(Number(selectedBU), idx, c.next_condition, (v) => updateConditionForBU(Number(selectedBU), idx, { next_condition: v }), anyOptionLeads)}
                        {anyOptionLeads && <p className="text-xs text-gray-500">Bloqueado porque una opción ya redirige</p>}
                      </div>

                      {c.interaction_type === 'options' && (
                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <h3 className="font-medium">Opciones</h3>
                            <button onClick={() => addOptionForBU(Number(selectedBU), idx)} className="flex items-center gap-1 text-sm px-3 py-1 rounded-lg border hover:bg-gray-50">
                              <Plus className="w-4 h-4" /> Agregar opción
                            </button>
                          </div>

                          {(c.options ?? []).map((option, optIdx) => (
                            <div key={optIdx} className="grid grid-cols-1 md:grid-cols-4 gap-3 items-center">
                                  <input className="border rounded-lg p-2 md:col-span-1" placeholder="Etiqueta" value={option.label} onChange={(e) => updateOptionForBU(Number(selectedBU), idx, optIdx, { label: e.target.value })} />

                              <div className="md:col-span-2">{conditionSelectForBU(Number(selectedBU), idx, option.next_condition, (v) => updateOptionForBU(Number(selectedBU), idx, optIdx, { next_condition: v }), c.next_condition !== undefined)}</div>

                              <label className="flex items-center gap-2 text-sm">
                                <input type="checkbox" checked={option.is_alternative} onChange={(e) => updateOptionForBU(Number(selectedBU), idx, optIdx, { is_alternative: e.target.checked })} />
                                Alternativa
                              </label>

                              <div>
                                <button onClick={() => removeOptionForBU(Number(selectedBU), idx, optIdx)} className="p-2 rounded-lg hover:bg-red-50">
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      <div className="flex items-center gap-3">
                        {editingIdx === idx ? (
                          <>
                            <button onClick={() => {
                              // save
                              setConditionsByBU((prev) => {
                                const list = [...(prev[selectedBU] ?? [])];
                                list[idx] = { ...list[idx], label: editingValues.label, observation: editingValues.observation };
                                return { ...prev, [Number(selectedBU)]: list };
                              });
                              setEditingIdx(null);
                            }} className="text-sm text-blue-600">Guardar</button>
                            <button onClick={() => setEditingIdx(null)} className="text-sm text-slate-600">Cancelar</button>
                          </>
                        ) : (
                          <>
                            <button onClick={() => { setEditingIdx(idx); setEditingValues({ label: c.label, observation: c.observation }); }} className="text-sm text-slate-700">Editar</button>
                            <button onClick={() => deleteCondition(Number(selectedBU), idx)} className="text-sm text-red-600"><Trash2 className="w-4 h-4 inline" /> Eliminar</button>
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

        <div className="flex justify-end mt-4">
          <Button variant="crear" size="sm" onClick={handleSaveAll}>
            Guardar todo
          </Button>
        </div>

        <pre className="bg-gray-100 rounded-lg p-4 text-xs overflow-auto">{JSON.stringify(
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
          })()
        , null, 2)}</pre>
      </div>
    </AdminLayout>
  );
}
