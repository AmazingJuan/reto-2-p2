<?php

namespace App\Http\Controllers\Portfolio\Quotation;

use App\Http\Controllers\Controller;
use App\Models\Condition;
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

        // QUITAR TODO ESTO
        $lineaGestionCondition = Condition::where('name', 'Línea de gestión')
            ->where('is_fixed', true)
            ->first();

        $lineaGestionData = null;
        if ($lineaGestionCondition) {
            $lineaGestionData = [
                'name' => $lineaGestionCondition->getName(),
                'items' => $lineaGestionCondition->conditionValues->pluck('value')->toArray(),
                'flags' => [
                    'allows_other_values' => $lineaGestionCondition->allowsOtherValues(),
                    'allows_multiple_values' => $lineaGestionCondition->allowsMultipleValues(),
                    'is_time' => $lineaGestionCondition->getType() === 'time',
                    'is_fixed' => $lineaGestionCondition->isFixed(),
                ],
            ];
        }

        $viewData = [
            'serviceTypeId' => $serviceTypeId,
            'serviceType' => $serviceType->getName(),
            'conditionsArray' => $this->conditionService->resolveConditions($initialConditionId),
            'services' => $serviceType->services->pluck('name', 'id')->all(),
            'initialConditionId' => $initialConditionId,
            'gestionLines' => $gestionLines,
            // QUITAR
            'lineaGestion' => $lineaGestionData,
        ];

        return inertia('portfolio/cotizar', [
            'viewData' => $viewData,
        ]);
    }
}
