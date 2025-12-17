<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Support\Collection;

class BusinessUnit extends Model
{
    /**
     * Attributes:
     *
     * $this->attributes['id'] - int - Primary key identifier
     * $this->attributes['name'] - string - Unique name of the condition
     * $this->attributes['created_at'] - Carbon - Record creation timestamp
     * $this->attributes['updated_at'] - Carbon - Record last update timestamp
     * $this->attributes['services'] - Service[] - Services associated with the business unit
     */
    protected $fillable = ['name'];

    // Relationships

    // Getters

    public function getId(): int
    {
        return $this->attributes['id'];
    }

    public function getName(): string
    {
        return $this->attributes['name'];
    }

    // Setters

    public function setName(string $name): void
    {
        $this->attributes['name'] = $name;
    }

    // Relationships

    public function services(): HasMany
    {
        return $this->hasMany(Service::class);
    }

    public function getServices(): Collection
    {
        return $this->services;
    }

    public function initialCondition(): HasOne
    {
        return $this->HasOne(Condition::class, 'initial_condition_id');
    }

    public function getInitialCondition(): Condition
    {
        return $this->initialCondition;
    }
}
