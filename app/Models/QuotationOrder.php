<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Carbon;

class QuotationOrder extends Model
{
    /**
     * Attributes:
     *
     * $this->attributes['id'] - int - Primary key identifier
     * $this->attributes['user_id'] - int|null - Foreign key referencing users.id
     * $this->attributes['service_type_id'] - int|null - Foreign key referencing service_types.id
     * $this->attributes['gestion_line_id'] - int|null - Foreign key referencing gestion_lines.id
     * $this->attributes['is_generated'] - bool - Indicates if the quotation has been generated
     * $this->attributes['services'] - array - JSON-encoded list of services included in the quotation
     * $this->attributes['options'] - array - JSON-encoded list of options related to the quotation
     * $this->attributes['quotation_url'] - string|null - URL of the generated quotation document
     * $this->attributes['created_at'] - \Illuminate\Support\Carbon - Record creation timestamp
     * $this->attributes['updated_at'] - \Illuminate\Support\Carbon - Record last update timestamp
     */

    /**
     * Mass assignable attributes.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'id',
        'user_id',
        'service_type_id',
        'gestion_line_id',
        'is_generated',
        'services',
        'options',
        'quotation_url',
    ];

    /*
    |--------------------------------------------------------------------------
    | Casting
    |--------------------------------------------------------------------------
    */
    protected $casts = [
        'is_generated' => 'boolean',
        'services' => 'array',
        'options' => 'array',
    ];

    /*
    |--------------------------------------------------------------------------
    | Options
    |--------------------------------------------------------------------------
    */
    public $incrementing = false;

    protected $keyType = 'string';

    /*
    |--------------------------------------------------------------------------
    | Relationships
    |--------------------------------------------------------------------------
    */

    /**
     * Get the user that owns this quotation order.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the service type associated with this quotation order.
     */
    public function serviceType()
    {
        return $this->belongsTo(ServiceType::class, 'service_type_id', 'id');
    }

    /**
     * Get the gestion line associated with this quotation order.
     */
    public function gestionLine()
    {
        return $this->belongsTo(GestionLine::class, 'gestion_line_id', 'id');
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

    // User ID
    public function getUserId(): ?int
    {
        return $this->attributes['user_id'] ?? null;
    }

    public function setUserId(?int $value): void
    {
        $this->attributes['user_id'] = $value;
    }

    // Service Type ID
    public function getServiceTypeId(): ?int
    {
        return $this->attributes['service_type_id'];
    }

    public function setServiceTypeId(?int $value): void
    {
        $this->attributes['service_type_id'] = $value;
    }

    // Gestion Line ID
    public function getGestionLineId(): ?int
    {
        return $this->attributes['gestion_line_id'];
    }

    public function setGestionLineId(?int $value): void
    {
        $this->attributes['gestion_line_id'] = $value;
    }

    // Is Generated
    public function getIsGenerated(): bool
    {
        return (bool) $this->attributes['is_generated'];
    }

    public function setIsGenerated(bool $value): void
    {
        $this->attributes['is_generated'] = $value;
    }

    // Services
    public function getServices(): array
    {
        return json_decode($this->attributes['services'], true) ?? [];
    }

    public function setServices(array $value): void
    {
        $this->attributes['services'] = json_encode($value);
    }

    // Options
    public function getOptions(): array
    {
        return json_decode($this->attributes['options'], true) ?? [];
    }

    public function setOptions(array $value): void
    {
        $this->attributes['options'] = json_encode($value);
    }

    // Quotation URL
    public function getQuotationUrl(): ?string
    {
        return $this->attributes['quotation_url'] ?? null;
    }

    public function setQuotationUrl(?string $value): void
    {
        $this->attributes['quotation_url'] = $value;
    }

    // Created At
    public function getCreatedAt(): Carbon
    {
        return $this->attributes['created_at'];
    }

    // Updated At
    public function getUpdatedAt(): Carbon
    {
        return $this->attributes['updated_at'];
    }
}
