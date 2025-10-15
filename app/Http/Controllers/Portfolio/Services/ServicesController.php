<?php

namespace App\Http\Controllers\Portfolio\Services;

use App\Http\Controllers\Controller;
use App\Models\ServiceType;
use App\Repositories\ServiceRepository;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ServicesController extends Controller
{
    protected ServiceRepository $serviceRepo;

    public function __construct(ServiceRepository $serviceRepo)
    {
        $this->serviceRepo = $serviceRepo;
    }

    public function index(Request $request, $serviceTypeId, $gestionLineId = null)
    {
        $viewData = [];

        $searchQuery = $request->query('search');
        $viewData['searchQuery'] = $searchQuery;

        $serviceType = ServiceType::findOrFail($serviceTypeId);
        $viewData['serviceType'] = $serviceType->getName();
        $viewData['serviceTypeId'] = $serviceType->getId();

        $services = $this->serviceRepo->getByServiceTypeAndKeyword($serviceTypeId, $searchQuery);
        $viewData['services'] = $services;

        return Inertia::render('services/index', ['viewData' => $viewData]);
    }
}
