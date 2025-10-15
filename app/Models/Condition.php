<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Condition extends Model
{
    /**
     * Attributes:
     *
     * $this->attributes['id'] - int - Primary key identifier
     * $this->attributes['name'] - string - Unique name of the condition
     * $this->attributes['type'] - string - Input type (default: "text")
     * $this->attributes['description'] - string|null - Description of the condition
     * $this->attributes['next_condition_id'] - int|null - ID of the next condition in sequence
     * $this->attributes['is_fixed'] - bool - Whether the condition is fixed and cannot be changed
     * $this->attributes['allows_other_values'] - bool - Whether the condition allows an "other" value
     * $this->attributes['allows_multiple_values'] - bool - Whether multiple values can be selected
     * $this->attributes['is_boolean'] - bool - Whether the condition is a true/false type
     * $this->attributes['created_at'] - \Illuminate\Support\Carbon - Record creation timestamp
     * $this->attributes['updated_at'] - \Illuminate\Support\Carbon - Record last update timestamp
     */

    /**
     * Mass assignable attributes.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'type',
        'description',
        'next_condition_id',
        'is_fixed',
        'allows_other_values',
        'allows_multiple_values',
        'is_boolean',
    ];

    public $timestamps = false;

    /*
    |--------------------------------------------------------------------------
    | Relationships
    |--------------------------------------------------------------------------
    */

    public function conditionValues(): HasMany
    {
        return $this->hasMany(ConditionValue::class);
    }

    public function serviceTypes()
    {
        return $this->belongsToMany(ServiceType::class, 'condition_service_type');
    }

    /**
     * The next condition in the sequence (self-referencing).
     */
    public function nextCondition(): BelongsTo
    {
        return $this->belongsTo(Condition::class, 'next_condition_id');
    }

    /*
    |--------------------------------------------------------------------------
    | Getters & Setters
    |--------------------------------------------------------------------------
    */

    // ID
    public function getId(): int
    {
        return $this->attributes['id'];
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

    // Type
    public function getType(): string
    {
        return $this->attributes['type'];
    }

    public function setType(string $value): void
    {
        $this->attributes['type'] = $value;
    }

    // Description
    public function getDescription(): ?string
    {
        return $this->attributes['description'] ?? null;
    }

    public function setDescription(?string $value): void
    {
        $this->attributes['description'] = $value;
    }

    // Next Condition ID
    public function getNextConditionId(): ?int
    {
        return $this->attributes['next_condition_id'] ?? null;
    }

    public function setNextConditionId(?int $value): void
    {
        $this->attributes['next_condition_id'] = $value;
    }

    // Is Fixed
    public function isFixed(): bool
    {
        return (bool) ($this->attributes['is_fixed'] ?? true);
    }

    public function setIsFixed(bool $value): void
    {
        $this->attributes['is_fixed'] = $value;
    }

    // Allows Other Values
    public function allowsOtherValues(): bool
    {
        return (bool) ($this->attributes['allows_other_values'] ?? false);
    }

    public function setAllowsOtherValues(bool $value): void
    {
        $this->attributes['allows_other_values'] = $value;
    }

    // Allows Multiple Values
    public function allowsMultipleValues(): bool
    {
        return (bool) ($this->attributes['allows_multiple_values'] ?? false);
    }

    public function setAllowsMultipleValues(bool $value): void
    {
        $this->attributes['allows_multiple_values'] = $value;
    }

    // Is Boolean
    public function isBoolean(): bool
    {
        return (bool) ($this->attributes['is_boolean'] ?? false);
    }

    public function setIsBoolean(bool $value): void
    {
        $this->attributes['is_boolean'] = $value;
    }

    // Is Time
    public function isTime(): bool
    {
        return $this->attributes['type'] === 'time';
    }
}
