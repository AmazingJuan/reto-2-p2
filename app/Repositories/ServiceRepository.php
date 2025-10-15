<?php

namespace App\Repositories;

use App\Models\Service;
use Illuminate\Support\Collection;

class ServiceRepository extends BaseRepository
{
    protected string $model = Service::class;

    protected array $with = ['gestionLine', 'serviceType'];

    public function getByServiceTypeAndKeyword(string $serviceTypeId, ?string $keyword = null): Collection
    {
        $query = $this->query()->where('service_type_id', $serviceTypeId);

        if ($keyword) {
            $query->where(function ($q) use ($keyword) {
                $q->where('name', 'like', "%{$keyword}%")
                ->orWhere('description', 'like', "%{$keyword}%");
            });
        }

        return $query->get()->map(fn ($service) => [
            'id' => $service->getId(),
            'name' => $service->getName(),
            'description' => $service->getDescription(),
            'gestion_line_name' => $service->gestionLine?->name,
        ]);
    }
}
