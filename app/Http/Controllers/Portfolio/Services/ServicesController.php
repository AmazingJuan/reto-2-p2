<?php

namespace App\Http\Controllers\Portfolio\Services;

use App\Http\Controllers\Controller;
use App\Models\ServiceType;
use App\Services\ConditionResolverService;
use Inertia\Inertia;

class ServicesController extends Controller
{
    public function index($serviceTypeId, ConditionResolverService $conditionResolverService)
    {   

        $serviceType = ServiceType::findOrFail($serviceTypeId);
        $services = $serviceType->services;
        $conditionResolvedValues = $conditionResolverService->getConditionsWithValues($serviceType);
        return json_encode($conditionResolvedValues);
        return Inertia::render('services/index', ['serviceType' => $serviceType, 'services' => $services, 'conditions' => $conditionResolvedValues]);
    }
}
