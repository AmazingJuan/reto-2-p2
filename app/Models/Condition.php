<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Condition extends Model
{
    public function conditionValues(): HasMany
    {
        return $this->hasMany(ConditionValue::class);
    }

    public function serviceTypes()
    {
        return $this->belongsToMany(ServiceType::class, 'condition_service_type');
    }
}
