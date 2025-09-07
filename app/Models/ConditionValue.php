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
     * $this->attributes['value'] - string - Option or value for the condition
     * $this->attributes['created_at'] - \Illuminate\Support\Carbon - Record creation timestamp
     * $this->attributes['updated_at'] - \Illuminate\Support\Carbon - Record last update timestamp
     */

    /**
     * Mass assignable attributes.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'condition_id',
        'value',
    ];

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
