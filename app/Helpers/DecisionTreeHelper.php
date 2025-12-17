<?php

namespace App\Helpers;

use App\Models\BusinessUnit;

class DecisionTreeHelper
{
    public static function buildTree(BusinessUnit $businessUnit): array
    {
        $conditions = [];
        $visited = [];

        $conditionStack = [
            $businessUnit->getInitialCondition(),
        ];

        while (! empty($conditionStack)) {
            $currentCondition = array_shift($conditionStack);

            if (! $currentCondition) {
                continue;
            }

            $conditionId = $currentCondition->getId();

            if (isset($visited[$conditionId])) {
                continue;
            }

            $visited[$conditionId] = true;

            $conditionData = [
                'label' => $currentCondition->getLabel(),
                'interaction_type' => $currentCondition->getInteractionType(),
                'type' => $currentCondition->getType(),
                'observation' => $currentCondition->getObservation(),
                'allows_multiple_values' => $currentCondition->getAllowsMultipleValues(),
            ];

            if ($next = $currentCondition->getNextCondition()) {
                $conditionData['next_condition'] = $next->getId();
                $conditionStack[] = $next;
            }

            if ($currentCondition->getInteractionType() === 'options') {
                $conditionData['options'] = [];

                foreach ($currentCondition->getOptions() as $option) {
                    $optionData = [
                        'label' => $option->getLabel(),
                    ];

                    if ($next = $option->getNextCondition()) {
                        $optionData['next_condition'] = $next->getId();
                        $conditionStack[] = $next;
                    }

                    $conditionData['options'][] = $optionData;
                }
            }

            if ($currentCondition->getInteractionType() === 'range') {
                $conditionData['ranges'] = [];
                foreach ($currentCondition->getRanges() as $range) {
                    $conditionData['ranges'][] = [
                        'min_value' => $range->getMinValue(),
                        'max_value' => $range->getMaxValue(),
                    ];
                }
            }

            $conditions[$conditionId] = $conditionData;
        }

        return $conditions;
    }
}
