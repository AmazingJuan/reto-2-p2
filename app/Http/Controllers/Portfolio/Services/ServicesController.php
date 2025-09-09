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

    public function index(Request $request, $serviceTypeId)
    {
        $search = $request->query('search');
        $serviceType = ServiceType::findOrFail($serviceTypeId);

        $services = $this->serviceRepo->getByServiceTypeAndSearch($serviceTypeId, $search)->toArray();

        return Inertia::render('services/index', [
            'services' => $services,
            'serviceTypeId' => $serviceType->id,
            'searchQuery' => $search,
        ]);
    }
}
