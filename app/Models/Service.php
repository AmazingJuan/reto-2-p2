<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Service extends Model
{
    use HasFactory;

    /**
     * Mass assignable attributes.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'description',
        'service_type_id',
        'gestion_line_id',
    ];

    public $timestamps = false;

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

    /**
     * A Service belongs to a GestionLine.
     */
    public function gestionLine(): BelongsTo
    {
        return $this->belongsTo(GestionLine::class, 'gestion_line_id', 'id');
    }

    /*
    |--------------------------------------------------------------------------
    | Accessors
    |--------------------------------------------------------------------------
    */

    /**
     * Get the ServiceType name.
     */
    public function getServiceTypeNameAttribute(): ?string
    {
        return $this->serviceType->name ?? null;
    }

    /**
     * Get the GestionLine name.
     */
    public function getGestionLineNameAttribute(): ?string
    {
        return $this->gestionLine->name ?? null;
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

    // Gestion Line ID
    public function getGestionLineId(): string
    {
        return $this->attributes['gestion_line_id'];
    }

    public function setGestionLineId(string $value): void
    {
        $this->attributes['gestion_line_id'] = $value;
    }
}
