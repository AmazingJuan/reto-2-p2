<?php

namespace App\Http\Controllers\Portfolio\Services;

use App\Http\Controllers\Controller;
use App\Models\ServiceType;
use Inertia\Inertia;

class ServicesController extends Controller
{
    public function index($serviceTypeId)
    {
        $serviceType = ServiceType::findOrFail($serviceTypeId);
        $services = $serviceType->services;

        return Inertia::render('services/index', ['serviceType' => $serviceType, 'services' => $services]);
    }
}
