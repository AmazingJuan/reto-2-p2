<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
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
    protected $fillable = ['name', 'display_name'];

    // Getters

    public function getId(): int
    {
        return $this->attributes['id'];
    }

    public function getName(): string
    {
        return $this->attributes['name'];
    }

    public function getDisplayName(): string
    {
        return $this->attributes['display_name'];
    }

    // Setters

    public function setName(string $name): void
    {
        $this->attributes['name'] = $name;
    }

    public function setDisplayName(string $displayName): void
    {
        $this->attributes['display_name'] = $displayName;
    }

    // Relationships

    public function getServices(): Collection
    {
        return $this->hasMany(Service::class)->get();
    }
}
