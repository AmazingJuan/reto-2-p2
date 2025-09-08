<?php

namespace App\Services;

use App\Models\ServiceType;

class ConditionResolverService
{
    /**
     * Resuelve los valores posibles para una condición.
     *
     * @param  \App\Models\Condition  $condition
     * @return array
     */
    public function resolveConditionValues($condition)
    {
        if ($condition->isBoolean()) {
            return ['Si', 'No'];
        }

        // Si no es booleano, busca los valores asociados
        return $condition->conditionValues()->pluck('value')->toArray();
    }

    /**
     * Obtiene las condiciones asociadas a un tipo de servicio y resuelve sus valores.
     *
     * @return array
     */
    public function getConditionsWithValues(ServiceType $serviceType)
    {
        $finalResult = [];

        // Obtiene las condiciones asociadas al tipo de servicio
        $conditions = $serviceType->conditions;
        foreach ($conditions as $condition) {
            $conditionFlags = [
                'allows_other_values' => $condition->allowsOtherValue(),
                'allows_multiple_values' => $condition->allowsMultipleValues(),
                'is_time' => $condition->isTime(),
                'is_fixed' => $condition->isFixed(),
            ];
            $conditionResolvedValues = $this->resolveConditionValues($condition);
            $finalResult[] = [$condition->name => ['flags' => $conditionFlags, 'items' => $conditionResolvedValues]];
        }

        return $finalResult;
    }
}
