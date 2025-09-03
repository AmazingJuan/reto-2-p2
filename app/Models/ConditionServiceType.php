<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ConditionServiceType extends Model
{
    public function condition()
    {
        return $this->belongsTo(Condition::class);
    }

    public function serviceType()
    {
        return $this->belongsTo(ServiceType::class);
    }
}
