<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Collection;

class BusinessUnit extends Model
{
    protected $fillable = ['name'];

    public function services(): HasMany
    {
        return $this->hasMany(Service::class);
    }

    public function getServices(): Collection
    {
        return $this->services()->get();
    }
}
