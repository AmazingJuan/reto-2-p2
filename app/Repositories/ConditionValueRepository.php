<?php

namespace App\Repositories;

use App\Models\ConditionValue;

class ConditionValueRepository extends BaseRepository
{
    protected string $model = ConditionValue::class;

    protected array $with = [];
}
