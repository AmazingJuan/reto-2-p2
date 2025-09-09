<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Service extends Model
{
    use HasFactory;

    /**
     * Attributes:
     *
     * $this->attributes['id'] - int - Primary key identifier
     * $this->attributes['name'] - string - Unique name of the service
     * $this->attributes['description'] - string|null - Optional description of the service
     * $this->attributes['service_type_id'] - string - Foreign key referencing service_types.id
     * $this->attributes['gestion_line'] - string - Management line (up to 50 characters)
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
        'description',
        'service_type_id',
        'gestion_line',
    ];

    /*
    |--------------------------------------------------------------------------
    | Relationships
    |--------------------------------------------------------------------------
    */

    /**
     * A Service belongs to a ServiceType.
     */
    public function serviceType(): BelongsTo
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

    // Name
    public function getName(): string
    {
        return $this->attributes['name'];
    }

    public function setName(string $value): void
    {
        $this->attributes['name'] = $value;
    }

    // Description
    public function getDescription(): ?string
    {
        return $this->attributes['description'];
    }

    public function setDescription(?string $value): void
    {
        $this->attributes['description'] = $value;
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

    // Gestion Line
    public function getGestionLine(): string
    {
        return $this->attributes['gestion_line'];
    }

    public function setGestionLine(string $value): void
    {
        $this->attributes['gestion_line'] = $value;
    }

    public function scopeSearchByName($query, ?string $term)
    {
        if ($term) {
            return $query->where('name', 'like', "%{$term}%");
        }

        return $query;
    }
}
