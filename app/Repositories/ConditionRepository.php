<?php

namespace App\Repositories;

use App\Models\Condition;

class ConditionRepository extends BaseRepository
{
    protected string $model = Condition::class;

    protected array $with = [];
}
