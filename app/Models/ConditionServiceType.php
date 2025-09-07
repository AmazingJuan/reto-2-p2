<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ConditionServiceType extends Model
{
    /**
     * Attributes:
     * 
     * $this->attributes['id'] - int - Primary key identifier
     * $this->attributes['condition_id'] - int - Foreign key referencing conditions.id
     * $this->attributes['service_type_id'] - string - Foreign key referencing service_types.id (string PK)
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
        'service_type_id',
    ];

    /*
    |--------------------------------------------------------------------------
    | Relationships
    |--------------------------------------------------------------------------
    */

    public function condition()
    {
        return $this->belongsTo(Condition::class);
    }

    public function serviceType()
    {
        return $this->belongsTo(ServiceType::class, 'service_type_id', 'id');
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
    public function getServiceTypeId(): string
    {
        return $this->attributes['service_type_id'];
    }

    public function setServiceTypeId(string $value): void
    {
        $this->attributes['service_type_id'] = $value;
    }
}
