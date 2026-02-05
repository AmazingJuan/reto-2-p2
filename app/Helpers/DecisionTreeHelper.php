<?php

namespace App\Helpers;

use App\Models\BusinessUnit;
use App\Models\Condition;
use App\Models\ConditionOption;
use Illuminate\Support\Facades\DB;

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
                        'is_other' => $option->isOther(),
                    ];

                    if ($next = $option->getNextCondition()) {
                        $optionData['next_condition'] = $next->getId();
                        $conditionStack[] = $next;
                    }

                    $conditionData['options'][] = $optionData;
                }
            }

            $conditions[$conditionId] = $conditionData;
        }
        
        return $conditions;
        
    }

    /**
     * Update multiple decision trees payload coming from the frontend.
     * Expected payload shape per business unit:
     * {
     *   initial_condition_id: <tempId|null>,
    *   conditions: [ { id: <tempId>, label, interaction_type, type, observation, options: [...], next_condition }, ... ]
     * }
     */
    public static function updateTrees(array $treesPayload)
    {
        foreach ($treesPayload as $businessUnitId => $treeData) {
            $businessUnit = BusinessUnit::find($businessUnitId);
            if (! $businessUnit) {
                continue;
            }

            DB::transaction(function () use ($businessUnit, $treeData) {
                $businessUnit->conditions()->delete();

                $conditions = $treeData['conditions'] ?? [];
                $initial = $treeData['initial_condition_id'] ?? null;

                // Map client temporary IDs to newly created DB IDs
                $idMap = [];

                // First pass: create conditions without next_condition_id
                foreach ($conditions as $c) {
                    $created = Condition::create([
                        'label' => $c['label'] ?? '',
                        'interaction_type' => $c['interaction_type'] ?? 'input',
                        'type' => $c['type'] ?? 'text',
                        'observation' => $c['observation'] ?? null,
                        'business_unit_id' => $businessUnit->getId(),
                    ]);

                    $idMap[$c['id']] = $created->id;
                }

                // Second pass: create options/ranges and set next_condition references
                foreach ($conditions as $c) {
                    $newId = $idMap[$c['id']];

                    // update next_condition for this condition (if provided)
                    if (! empty($c['next_condition'])) {
                        $mapped = $idMap[$c['next_condition']] ?? null;
                        if ($mapped) {
                            Condition::where('id', $newId)->update(['next_condition_id' => $mapped]);
                        }
                    }

                    // options
                    if (($c['interaction_type'] ?? '') === 'options' && ! empty($c['options'])) {
                        foreach ($c['options'] as $opt) {
                            ConditionOption::create([
                                'label' => $opt['label'] ?? '',
                                'condition_id' => $newId,
                                'next_condition_id' => (! empty($opt['next_condition']) ? ($idMap[$opt['next_condition']] ?? null) : null),
                                'is_other' => ! empty($opt['is_other']),
                            ]);
                        }
                    }
                }

                // Set initial condition on business unit (map temp id to DB id)
                if ($initial !== null && isset($idMap[$initial])) {
                    $businessUnit->initial_condition_id = $idMap[$initial];
                } else {
                    $businessUnit->initial_condition_id = null;
                }
                $businessUnit->save();
            });
        }
    }
}
