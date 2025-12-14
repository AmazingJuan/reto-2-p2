<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Collection;

class ConditionOption extends Model
{
    /**
     * Attributes:
     *
     * $this->attributes['id'] - int - Primary key identifier
     * $this->attributes['label'] - string - Label or name of the option
     * $this->attributes['condition_id'] - int - Foreign key referencing conditions.id
     * $this->attributes['next_condition_id'] - int|null - Foreign key referencing conditions.id (next condition)
     * $this->attributes['is_other'] - boolean - Indicates if this option represents an "other" choice
     */

    /**
     * Mass assignable attributes.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'label',
        'condition_id',
        'next_condition_id',
        'is_other',
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
    public function getCondition(): Collection
    {
        return $this->belongsTo(Condition::class)->get();
    }

    /**
     * A ConditionOption may point to a next Condition.
     */
    public function getNextCondition(): Collection
    {
        return $this->belongsTo(Condition::class, 'next_condition_id')->get();
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

    // Label

    public function getLabel(): string
    {
        return $this->attributes['label'];
    }

    public function setLabel(string $value): void
    {
        $this->attributes['label'] = $value;
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

    // Next Condition ID
    public function getNextConditionId(): ?int
    {
        return $this->attributes['next_condition_id'] ?? null;
    }

    public function setNextConditionId(?int $value): void
    {
        $this->attributes['next_condition_id'] = $value;
    }

    // is_other
    public function getIsOther(): bool
    {
        return $this->attributes['is_other'];
    }

    public function setIsOther(bool $value): void
    {
        $this->attributes['is_other'] = $value;
    }
}
