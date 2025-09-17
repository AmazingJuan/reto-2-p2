<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ConditionValue extends Model
{
    /**
     * Attributes:
     *
     * $this->attributes['id'] - int - Primary key identifier
     * $this->attributes['condition_id'] - int - Foreign key referencing conditions.id
     * $this->attributes['service_type_id'] - string|null - Foreign key referencing service_types.id
     * $this->attributes['next_condition_id'] - int|null - Foreign key referencing conditions.id (next condition)
     * $this->attributes['value'] - string - Option or value for the condition
     */

    /**
     * Mass assignable attributes.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'condition_id',
        'service_type_id',
        'next_condition_id',
        'value',
    ];

    public $timestamps = false;

    /*
    |--------------------------------------------------------------------------
    | Relationships
    |--------------------------------------------------------------------------
    */

    /**
     * A ConditionValue belongs to a Condition.
     */
    public function condition(): BelongsTo
    {
        return $this->belongsTo(Condition::class);
    }

    /**
     * A ConditionValue may belong to a ServiceType.
     */
    public function serviceType(): BelongsTo
    {
        return $this->belongsTo(ServiceType::class, 'service_type_id', 'id');
    }

    /**
     * A ConditionValue may point to a next Condition.
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

    // Condition ID
    public function getConditionId(): int
    {
        return $this->attributes['condition_id'];
    }

    public function setConditionId(int $value): void
    {
        $this->attributes['condition_id'] = $value;
    }

    // Service Type ID
    public function getServiceTypeId(): ?string
    {
        return $this->attributes['service_type_id'] ?? null;
    }

    public function setServiceTypeId(?string $value): void
    {
        $this->attributes['service_type_id'] = $value;
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

    // Value
    public function getValue(): string
    {
        return $this->attributes['value'];
    }

    public function setValue(string $value): void
    {
        $this->attributes['value'] = $value;
    }
}
