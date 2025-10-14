<?php

namespace App\Http\Controllers\Portfolio\Quotation;

use App\Http\Controllers\Controller;
use App\Models\GestionLine;
use App\Models\ServiceType;
use App\Repositories\ServiceTypeRepository;
use App\Services\ConditionService;
use Illuminate\Http\RedirectResponse;
use Inertia\Response as InertiaResponse;

class QuotationController extends Controller
{
    // Condition service (it's used for resolving conditions tree).
    protected ConditionService $conditionService;

    // Service type repository (it's used for fetching service type data).
    protected ServiceTypeRepository $serviceTypeRepository;

    public function __construct(ConditionService $conditionService, ServiceTypeRepository $serviceTypeRepository)
    {
        $this->conditionService = $conditionService;
        $this->serviceTypeRepository = $serviceTypeRepository;
    }

    // Redirects to the portfolio index with the quotation.show base path.
    public function index(): RedirectResponse
    {
        return redirect()->route('portfolio.index', ['base_path' => 'quotation.show']);
    }

    // Show the quotation page for a specific service type (includes many util aspects such as service type, services, etc).
    public function show(string $serviceTypeId): InertiaResponse|RedirectResponse
    {
        $serviceType = $this->serviceTypeRepository->find($serviceTypeId); // Search serviceType in DB.
        $gestionLines = GestionLine::all();

        if (! $serviceType) {
            return redirect()
                ->route('quotation.index')
                ->with('error', 'El servicio seleccionado no existe. Por favor selecciona otro.');
        }

        $initialConditionId = $serviceType->getInitialConditionId();

        // Servicios con su gestion_line_id
        $services = $serviceType->services->map(function ($service) {
            return [
                'id' => (string) $service->id,
                'name' => $service->name,
                'gestion_line_id' => $service->gestion_line_id,
            ];
        })->values()->all();

        $viewData = [
            'serviceTypeId' => $serviceTypeId,
            'serviceType' => $serviceType->getName(),
            'conditionsArray' => $this->conditionService->resolveConditions($initialConditionId),
            'services' => $services,
            'initialConditionId' => $initialConditionId,
            'gestionLines' => $gestionLines,
        ];

        return inertia('portfolio/cotizar', [
            'viewData' => $viewData,
        ]);
    }
}