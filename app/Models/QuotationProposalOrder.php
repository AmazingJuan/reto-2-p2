<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Carbon;

class QuotationProposalOrder extends Model
{
    use HasFactory;
    /**
     * Attributes:
     *
     * $this->attributes['id'] - int - Primary key identifier
     * $this->attributes['client_id'] - int|null - FK referencing the client that owns the quotation
     * $this->attributes['bussiness_unit'] - string - Business unit associated with the quotation
     * $this->attributes['gestion_line'] - string - String referencing to a gestion line name
     * $this->attributes['services'] - array - JSON-encoded list of services included in the quotation
     * $this->attributes['answers'] - array - JSON-encoded list of answers provided in the quotation form
     * $this->attributes['quotation_url'] - string|null - URL of the generated quotation document
     */

    /**
     * Mass assignable attributes.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'id',
        'quotation_code',
        'client_id',
        'business_unit',
        'gestion_line',
        'services',
        'answers',
        'professional_id',
        'is_generated',
        'quotation_url',
    ];

    /*
    |--------------------------------------------------------------------------
    | Casting
    |--------------------------------------------------------------------------
    */
    protected $casts = [
        'services' => 'array',
        'answers' => 'array',
        'options' => 'array',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /*
    |--------------------------------------------------------------------------
    | Options
    |--------------------------------------------------------------------------
    */
    public $incrementing = false;

    protected $keyType = 'string';

    public function professional(): BelongsTo
    {
        return $this->belongsTo(Professional::class);
    }

    public function client(): BelongsTo
    {
        return $this->belongsTo(Client::class);
    }

    public function getClient(): ?Client
    {
        return $this->client;
    }

    /*
    |--------------------------------------------------------------------------
    | Getters & Setters
    |--------------------------------------------------------------------------
    */

    // ID
    public function getId(): string
    {
        return (string) $this->getAttribute('id');
    }

    public function getQuotationCode(): ?string
    {
        $v = $this->attributes['quotation_code'] ?? null;
        if ($v === null) {
            return null;
        }
        $t = trim((string) $v);

        return $t === '' ? null : $t;
    }

    // Client

    public function getClientId(): ?int
    {
        $v = $this->attributes['client_id'] ?? null;

        return $v === null ? null : (int) $v;
    }

    public function setClientId(?int $value): void
    {
        $this->attributes['client_id'] = $value;
    }

    // Business Unit

    public function getBusinessUnit(): string
    {
        return $this->attributes['business_unit'];
    }

    public function setBusinessUnit(string $value): void
    {
        $this->attributes['business_unit'] = $value;
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

    // Services
    public function getServices(): array
    {
        return $this->getAttribute('services') ?? [];
    }

    public function setServices(array $value): void
    {
        $this->setAttribute('services', $value);
    }

    // Answers
    public function getAnswers(): array
    {
        return $this->getAttribute('answers');
    }

    public function setAnswers(array $value): void
    {
        $this->setAttribute('answers', $value);
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
    public function getCreatedAt(): ?Carbon
    {
        return $this->getAttribute('created_at');
    }

    // Updated At
    public function getUpdatedAt(): ?Carbon
    {
        return $this->getAttribute('updated_at');
    }
}
