<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Collection;

class ConditionRange extends Model
{
    /**
     * Attributes:
     *
     * $this->attributes['id'] - int - Primary key identifier
     * $this->attributes['condition_id'] - int - Foreign key referencing conditions.id
     * $this->attributes['min_value'] - string - Minimum value of the range
     * $this->attributes['max_value'] - string - Maximum value of the range
     */

    /**
     * Mass assignable attributes.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'condition_id',
        'min_value',
        'max_value',
    ];

    public $timestamps = false;

    /*
    |--------------------------------------------------------------------------
    | Relationships
    |--------------------------------------------------------------------------
    */

    /**
     * A ConditionOption belongs to a Condition.
     */

    public function condition(): BelongsTo
    {
        return $this->belongsTo(Condition::class, 'condition_id');
    }

    public function getCondition(): Condition
    {
        return $this->condition;
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

    // Min Value
    public function getMinValue(): string
    {
        return $this->attributes['min_value'];
    }

    public function setMinValue(string $value): void
    {
        $this->attributes['min_value'] = $value;
    }

    // Max Value
    public function getMaxValue(): string
    {
        return $this->attributes['max_value'];
    }

    public function setMaxValue(string $value): void
    {
        $this->attributes['max_value'] = $value;
    }
}
