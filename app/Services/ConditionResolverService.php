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
        if ($condition->is_boolean) {
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

            $conditionResolvedValues = $this->resolveConditionValues($condition);
            $finalResult[] = [$condition->name => $conditionResolvedValues];
        }

        return $finalResult;
    }
}
