<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ServiceType extends Model
{
    /**
     * Attributes:
     *
     * $this->attributes['id'] - string - Primary key identifier (non-incrementing)
     * $this->attributes['name'] - string - Unique name of the service type
     * $this->attributes['initial_condition_id'] - int|null - Foreign key referencing conditions.id
     */

    /**
     * Primary key is a string, not auto-incrementing.
     */
    protected $keyType = 'string';

    public $incrementing = false;

    /**
     * Mass assignable attributes.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'id',
        'name',
        'initial_condition_id',
    ];

    public $timestamps = false;

    /*
    |--------------------------------------------------------------------------
    | Relationships
    |--------------------------------------------------------------------------
    */

    /**
     * A ServiceType has many Services.
     */
    public function services(): HasMany
    {
        return $this->hasMany(Service::class);
    }

    /**
     * A ServiceType belongs to many Conditions.
     */
    public function conditions(): BelongsToMany
    {
        return $this->belongsToMany(Condition::class, 'condition_service_type');
    }

    /**
     * A ServiceType may have an initial Condition.
     */
    public function initialCondition(): BelongsTo
    {
        return $this->belongsTo(Condition::class, 'initial_condition_id');
    }

    /*
    |--------------------------------------------------------------------------
    | Getters & Setters
    |--------------------------------------------------------------------------
    */

    // ID
    public function getId(): string
    {
        return $this->attributes['id'];
    }

    public function setId(string $value): void
    {
        $this->attributes['id'] = $value;
    }

    // Name
    public function getName(): string
    {
        return $this->attributes['name'];
    }

    public function setName(string $value): void
    {
        $this->attributes['name'] = $value;
    }

    // Initial Condition ID
    public function getInitialConditionId(): ?int
    {
        return $this->attributes['initial_condition_id'] ?? null;
    }

    public function setInitialConditionId(?int $value): void
    {
        $this->attributes['initial_condition_id'] = $value;
    }
}
