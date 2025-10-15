<?php

/*
 * BaseRepository.php
 * Abstract base repository providing common CRUD operations with eager loading.
 * Author: Juan Avendaño
*/

namespace App\Repositories;

use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;

abstract class BaseRepository
{
    /**
     * Repository model.
     */
    protected string $model;

    /**
     * Relationships to eager load.
     */
    protected array $with = [];

    /**
     * Base query with eager loading.
     */
    protected function query()
    {
        return ($this->model)::with($this->with);
    }

    /**
     * Search by ID.
     */
    public function find($id): ?Model
    {
        return $this->query()->find($id);
    }

    /**
     * List all.
     */
    public function all(): Collection
    {
        return $this->query()->get();
    }

    /**
     * Create a new record.
     */
    public function create(array $data): Model
    {
        return ($this->model)::create($data)->fresh($this->with);
    }

    /**
     * Update a record by ID or Model.
     */
    public function update(array $data, ?Model $entity, $id = null): ?Model
    {
        // Search by ID if Model not provided.
        if (! $entity && $id !== null) {
            $entity = $this->find($id);
        }

        if ($entity) {
            $entity->update($data);

            return $entity->fresh($this->with);
        }

        return null;
    }

    /**
     * Delete a record by ID or Model.
     */
    public function delete(?Model $entity = null, $id = null): ?Model
    {
        if (! $entity && $id !== null) {
            $entity = $this->find($id);
        }

        if ($entity) {
            $entity->delete();
        }

        return $entity;
    }

    public function getColumns(array $columns)
    {
        return $this->query()
            ->select($columns)
            ->get();
    }
}
