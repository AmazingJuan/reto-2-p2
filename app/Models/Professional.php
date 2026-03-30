<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Professional extends Model
{
    protected $fillable = [
        'name',
        'summary',
        'years_experience',
    ];

    protected function casts(): array
    {
        return [
            'years_experience' => 'integer',
        ];
    }

    public function quotationProposalOrders(): HasMany
    {
        return $this->hasMany(QuotationProposalOrder::class, 'professional_id');
    }
}
