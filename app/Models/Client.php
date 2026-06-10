<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Carbon;

class Client extends Model
{
    use HasFactory;

    /**
     * Attributes:
     *
     * $this->attributes['id'] - int - Primary key identifier
     * $this->attributes['name'] - string - Client full name
     * $this->attributes['email'] - string - Unique client email (lowercased)
     * $this->attributes['company'] - string|null - Company the client represents
     * $this->attributes['phone'] - string - Contact phone number
     * $this->attributes['role'] - string|null - Role/position of the client
     * $this->attributes['created_at'] - Carbon - Record creation timestamp
     * $this->attributes['updated_at'] - Carbon - Record last update timestamp
     */

    /**
     * Mass assignable attributes.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'email',
        'company',
        'phone',
        'role',
    ];

    /*
    |--------------------------------------------------------------------------
    | Relationships
    |--------------------------------------------------------------------------
    */

    public function quotationProposalOrders(): HasMany
    {
        return $this->hasMany(QuotationProposalOrder::class, 'client_id');
    }

    /*
    |--------------------------------------------------------------------------
    | Query Scopes (shared by the clients list and the Excel export)
    |--------------------------------------------------------------------------
    */

    /**
     * Attach the derived counters and the latest-quotation timestamp.
     */
    public function scopeWithClientStats(Builder $query): Builder
    {
        return $query
            ->withCount([
                'quotationProposalOrders as quotations_count',
                'quotationProposalOrders as generated_count' => fn (Builder $q) => $q->where('is_generated', true),
                'quotationProposalOrders as pending_count' => fn (Builder $q) => $q->where('is_generated', false),
            ])
            ->withMax('quotationProposalOrders as last_quotation_at', 'created_at');
    }

    /**
     * @param  array{search?:string, company?:string, business_unit?:string}  $filters
     */
    public function scopeApplyClientFilters(Builder $query, array $filters): Builder
    {
        return $query
            ->when(($filters['search'] ?? '') !== '', function (Builder $q) use ($filters) {
                $like = '%'.$filters['search'].'%';
                $q->where(function (Builder $inner) use ($like) {
                    $inner->where('name', 'like', $like)
                        ->orWhere('email', 'like', $like)
                        ->orWhere('company', 'like', $like)
                        ->orWhere('phone', 'like', $like)
                        ->orWhere('role', 'like', $like);
                });
            })
            ->when(($filters['company'] ?? '') !== '', fn (Builder $q) => $q->where('company', $filters['company']))
            ->when(($filters['business_unit'] ?? '') !== '', fn (Builder $q) => $q->whereHas(
                'quotationProposalOrders',
                fn (Builder $q2) => $q2->where('business_unit', $filters['business_unit'])
            ));
    }

    public function scopeOrderByActivity(Builder $query): Builder
    {
        return $query->orderByDesc('last_quotation_at')->orderBy('name');
    }

    /*
    |--------------------------------------------------------------------------
    | Getters & Setters
    |--------------------------------------------------------------------------
    */

    public function getId(): int
    {
        return $this->attributes['id'];
    }

    public function getName(): string
    {
        return $this->attributes['name'];
    }

    public function setName(string $value): void
    {
        $this->attributes['name'] = $value;
    }

    public function getEmail(): string
    {
        return $this->attributes['email'];
    }

    public function setEmail(string $value): void
    {
        $this->attributes['email'] = $value;
    }

    public function getCompany(): ?string
    {
        return $this->attributes['company'] ?? null;
    }

    public function setCompany(?string $value): void
    {
        $this->attributes['company'] = $value;
    }

    public function getPhone(): ?string
    {
        return $this->attributes['phone'] ?? null;
    }

    public function setPhone(?string $value): void
    {
        $this->attributes['phone'] = $value;
    }

    public function getRole(): ?string
    {
        return $this->attributes['role'] ?? null;
    }

    public function setRole(?string $value): void
    {
        $this->attributes['role'] = $value;
    }

    public function getCreatedAt(): ?Carbon
    {
        return $this->getAttribute('created_at');
    }

    public function getUpdatedAt(): ?Carbon
    {
        return $this->getAttribute('updated_at');
    }
}
