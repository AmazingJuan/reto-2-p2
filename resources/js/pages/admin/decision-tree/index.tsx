import { useState } from "react";
import { Plus, Trash2, Star } from "lucide-react";

// --------------------
// Types
// --------------------

type InteractionType = "range" | "options" | "input";
type ValueType = "number" | "date" | "text";

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

interface FlowPayload {
  initial_condition: number | null;
  conditions: Record<number, ConditionData>;
}

// --------------------
// Component
// --------------------

export default function ConditionBuilder() {
  const [conditions, setConditions] = useState<Record<number, ConditionData>>({});
  const [order, setOrder] = useState<number[]>([]);
  const [initialConditionId, setInitialConditionId] = useState<number | null>(null);

  const addCondition = () => {
    const id = Date.now();

    setConditions((prev) => ({
      ...prev,
      [id]: {
        id,
        label: "",
        interaction_type: "input",
        type: "text",
        observation: "",
        allows_multiple_values: false,
        options: [],
      },
    }));

    setOrder((prev) => [...prev, id]);

    if (initialConditionId === null) {
      setInitialConditionId(id);
    }
  };

  const updateCondition = (id: number, patch: Partial<ConditionData>) => {
    setConditions((prev) => ({
      ...prev,
      [id]: { ...prev[id], ...patch },
    }));
  };

  const addOption = (conditionId: number) => {
    setConditions((prev) => ({
      ...prev,
      [conditionId]: {
        ...prev[conditionId],
        options: [...prev[conditionId].options, { label: "", is_alternative: false }],
      },
    }));
  };

  const updateOption = (
    conditionId: number,
    index: number,
    patch: Partial<OptionData>
  ) => {
    setConditions((prev) => {
      const condition = prev[conditionId];
      const options = [...condition.options];
      options[index] = { ...options[index], ...patch };

      return {
        ...prev,
        [conditionId]: { ...condition, options },
      };
    });
  };

  const removeOption = (conditionId: number, index: number) => {
    setConditions((prev) => ({
      ...prev,
      [conditionId]: {
        ...prev[conditionId],
        options: prev[conditionId].options.filter((_, i) => i !== index),
      },
    }));
  };

  const conditionSelect = (
    currentId: number,
    value?: number,
    onChange?: (v?: number) => void,
    disabled?: boolean
  ) => (
    <select
      disabled={disabled}
      className={`border rounded-lg p-2 w-full ${disabled ? "bg-gray-100" : ""}`}
      value={value ?? ""}
      onChange={(e) => onChange?.(e.target.value ? Number(e.target.value) : undefined)}
    >
      <option value="">— Seleccionar condición —</option>
      {order
        .filter((id) => id !== currentId)
        .map((id) => (
          <option key={id} value={id}>
            {conditions[id].label || "(sin etiqueta)"}
            {id === initialConditionId ? " ★ Inicial" : ""}
          </option>
        ))}
    </select>
  );

  const buildPayload = (): FlowPayload => ({
    initial_condition: initialConditionId,
    conditions,
  });

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <h1 className="text-2xl font-semibold">Constructor de condiciones</h1>

      {order.map((id) => {
        const condition = conditions[id];
        const isInitial = id === initialConditionId;
        const anyOptionLeads = condition.options.some((o) => o.next_condition !== undefined);

        return (
          <div key={id} className={`rounded-2xl border shadow-sm p-6 space-y-4 ${isInitial ? "border-green-500" : ""}`}>
            <div className="flex justify-between items-center">
              <h2 className="font-semibold text-lg flex items-center gap-2">
                {isInitial && <Star className="w-4 h-4 text-green-600" />}
                {condition.label || "Condición sin etiqueta"}
              </h2>

              <button
                onClick={() => setInitialConditionId(id)}
                className={`text-sm px-3 py-1 rounded-lg border ${isInitial ? "bg-green-50 border-green-400" : "hover:bg-gray-50"}`}
              >
                {isInitial ? "Condición inicial" : "Marcar como inicial"}
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <input
                className="border rounded-lg p-2"
                placeholder="Etiqueta"
                value={condition.label}
                onChange={(e) => updateCondition(id, { label: e.target.value })}
              />

              <select
                className="border rounded-lg p-2"
                value={condition.interaction_type}
                onChange={(e) =>
                  updateCondition(id, {
                    interaction_type: e.target.value as InteractionType,
                    options: e.target.value === "options" ? condition.options : [],
                    next_condition: undefined,
                  })
                }
              >
                <option value="input">Input</option>
                <option value="range">Range</option>
                <option value="options">Options</option>
              </select>

              <select
                className="border rounded-lg p-2"
                value={condition.type}
                onChange={(e) => updateCondition(id, { type: e.target.value as ValueType })}
              >
                <option value="text">Text</option>
                <option value="number">Number</option>
                <option value="date">Date</option>
              </select>

              <input
                className="border rounded-lg p-2"
                placeholder="Observación"
                value={condition.observation}
                onChange={(e) => updateCondition(id, { observation: e.target.value })}
              />
            </div>

            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={condition.allows_multiple_values}
                onChange={(e) => updateCondition(id, { allows_multiple_values: e.target.checked })}
              />
              Permite múltiples valores
            </label>

            <div className="space-y-2">
              <label className="text-sm text-gray-600">Siguiente condición</label>
              {conditionSelect(
                id,
                condition.next_condition,
                (v) => updateCondition(id, { next_condition: v }),
                anyOptionLeads
              )}
              {anyOptionLeads && <p className="text-xs text-gray-500">Bloqueado porque una opción ya redirige</p>}
            </div>

            {condition.interaction_type === "options" && (
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <h3 className="font-medium">Opciones</h3>
                  <button
                    onClick={() => addOption(id)}
                    className="flex items-center gap-1 text-sm px-3 py-1 rounded-lg border hover:bg-gray-50"
                  >
                    <Plus className="w-4 h-4" /> Agregar opción
                  </button>
                </div>

                {condition.options.map((option, index) => (
                  <div key={index} className="grid grid-cols-4 gap-3 items-center">
                    <input
                      className="border rounded-lg p-2"
                      placeholder="Label"
                      value={option.label}
                      onChange={(e) => updateOption(id, index, { label: e.target.value })}
                    />

                    {conditionSelect(
                      id,
                      option.next_condition,
                      (v) => updateOption(id, index, { next_condition: v }),
                      condition.next_condition !== undefined
                    )}

                    <label className="flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        checked={option.is_alternative}
                        onChange={(e) => updateOption(id, index, { is_alternative: e.target.checked })}
                      />
                      Alternativa
                    </label>

                    <button
                      onClick={() => removeOption(id, index)}
                      className="p-2 rounded-lg hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}

      <button
        onClick={addCondition}
        className="w-full flex justify-center items-center gap-2 border rounded-xl py-3 hover:bg-gray-50"
      >
        <Plus className="w-4 h-4" /> Agregar condición
      </button>

      <pre className="bg-gray-100 rounded-lg p-4 text-xs overflow-auto">
        {JSON.stringify(buildPayload(), null, 2)}
      </pre>
    </div>
  );
}
