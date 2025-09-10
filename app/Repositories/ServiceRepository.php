<?php

namespace App\Repositories;

use App\Models\Service;
use Illuminate\Support\Collection;

class ServiceRepository
{
    public function getByServiceTypeAndSearch(string $serviceTypeId, ?string $search = null): Collection
    {
        $query = Service::where('service_type_id', $serviceTypeId);

        if ($search) {
            $query->where('name', 'like', "%{$search}%");
        }

        return $query->get();
    }
}
