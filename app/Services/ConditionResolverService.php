<?php

namespace App\Services;

use App\Models\ServiceType;

class ConditionResolverService
{
    /**
     * Resuelve los valores posibles para una condición según el tipo de servicio.
     *
     * @param  \App\Models\Condition  $condition
     * @param  string|null  $serviceType
     * @return array
     */
    public function resolveConditionValues($condition, $serviceType = null)
    {
        if ($condition->isBoolean()) {
            return ['Si', 'No'];
        }

        // Si no es booleano, busca los valores asociados
        // Incluye valores globales (service_type = null) y específicos del tipo de servicio
        return $condition->conditionValues()
            ->where(function ($query) use ($serviceType) {
                $query->whereNull('service_type');
                if ($serviceType) {
                    $query->orWhere('service_type', $serviceType);
                }
            })
            ->pluck('value')
            ->toArray();
    }

    /**
     * Obtiene las condiciones asociadas a un tipo de servicio y resuelve sus valores.
     *
     * @return array
     */
    public function getConditionsWithValues(ServiceType $serviceType)
    {
        $finalResult = [];

        // Determinar el tipo de servicio para el filtrado
        $serviceTypeName = strtolower($serviceType->name);

        // Obtiene todas las condiciones (ya no están asociadas directamente al serviceType)
        $conditions = \App\Models\Condition::all();

        foreach ($conditions as $condition) {
            $conditionFlags = [
                'allows_other_values' => $condition->allowsOtherValue(),
                'allows_multiple_values' => $condition->allowsMultipleValues(),
                'is_time' => $condition->isTime(),
                'is_fixed' => $condition->isFixed(),
            ];
            $conditionResolvedValues = $this->resolveConditionValues($condition, $serviceTypeName);

            // Solo incluir condiciones que tengan valores para este tipo de servicio
            if (! empty($conditionResolvedValues)) {
                $finalResult[] = [$condition->name => ['flags' => $conditionFlags, 'items' => $conditionResolvedValues]];
            }
        }

        return $finalResult;
    }
}
