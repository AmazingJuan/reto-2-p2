<?php

namespace App\Services;

use App\Models\Condition;
use App\Repositories\ConditionRepository;
use App\Repositories\ConditionValueRepository;

class ConditionService
{
    protected $conditionRepository;

    protected $conditionValueRepository;

    public function __construct(ConditionRepository $conditionRepository, ConditionValueRepository $conditionValueRepository)
    {
        $this->conditionRepository = $conditionRepository;
        $this->conditionValueRepository = $conditionValueRepository;
    }

    private function resolveConditionFlags(Condition $condition): array
    {
        return [
            'allows_other_values' => $condition->allowsOtherValues(),
            'allows_multiple_values' => $condition->allowsMultipleValues(),
            'is_time' => $condition->getType() === 'time',
        ];
    }

    public function resolveConditions($initialConditionId): array
    {
        $conditions = [];
        $pendingConditionQueue = [$this->conditionRepository->find($initialConditionId)];

        while (! empty($pendingConditionQueue)) {
            $condition = array_pop($pendingConditionQueue);
            $conditionValues = $condition->conditionValues;

            $conditions[$condition->getId()] = ['name' => $condition->getName(), 'items' => []];

            foreach ($conditionValues as $value) {
                $internalNextId = $value->getNextConditionId();
                if ($internalNextId) {
                    $internalCondition = $this->conditionRepository->find($internalNextId);
                    if ($internalCondition) {
                        $pendingConditionQueue[] = $internalCondition;
                    }
                }
                $conditions[$condition->getId()]['items'][] = ['value' => $value->getValue(), 'next_condition_id' => $value->getNextConditionId()];
            }

            $externalNextId = $condition->getNextConditionId();
            $externalCondition = $this->conditionRepository->find($externalNextId);
            if ($externalCondition) {
                $pendingConditionQueue[] = $externalCondition;
            }

            $conditions[$condition->getId()]['next_condition_id'] = $externalNextId;
            $conditions[$condition->getId()]['flags'] = $this->resolveConditionFlags($condition);
        }

        return $conditions;
    }

    // Create condition logic

    private function constructValues(?array $values, int $conditionId, bool $isBoolean = false): void
    {
        if ($isBoolean) {
            $values = ['Sí', 'No'];
        }

        if (empty($values)) {
            return;
        }

        foreach ($values as $value) {
            if (is_array($value)) {
                $this->conditionValueRepository->create([
                    'condition_id' => $conditionId,
                    'value' => $value['value'],
                    'next_condition_id' => $value['next_condition_id'] ?? null,
                    'service_type_id' => $value['service_type_id'] ?? null,
                ]);
            } else {
                $this->conditionValueRepository->create([
                    'condition_id' => $conditionId,
                    'value' => $value,
                ]);
            }
        }
    }

    public function create(array $data, ?array $conditionValues = null)
    {

        $condition = $this->conditionRepository->create($data);
        $isBoolean = $condition->isBoolean();

        $this->constructValues($conditionValues, $condition->getId(), $isBoolean);

        return $condition;
    }
}
