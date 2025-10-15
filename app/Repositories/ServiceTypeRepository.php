<?php

namespace App\Repositories;

use App\Models\ServiceType;

class ServiceTypeRepository extends BaseRepository
{
    protected string $model = ServiceType::class;

    protected array $with = [];
}
