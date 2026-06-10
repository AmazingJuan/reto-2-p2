<?php

namespace App\Repositories;

use App\Models\GestionLine;

class GestionLineRepository extends BaseRepository
{
    protected string $model = GestionLine::class;

    protected array $with = [];
}
