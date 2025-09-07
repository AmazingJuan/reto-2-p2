<?php

namespace App\Http\Controllers\Quotation;

use App\Data\QuotationParams;
use App\Http\Controllers\Controller;
use App\Models\ServiceType;
use App\Services\ConditionResolverService;
use Illuminate\Http\Request;

class QuotationController extends Controller
{
    public function index(Request $request, ConditionResolverService $conditionResolverService)
    {
        $params = QuotationParams::fromRequest($request);
        $serviceTypeId = $params->getType();
        if (!$serviceTypeId) {
            return inertia('Quotation/SelectType'); // seria ideal definir una ruta central donde el usuario pueda seleccionar el tipo de servicio
        }

        $serviceType = ServiceType::findOrFail($serviceTypeId);
        if (! $serviceType) {
            return redirect()
                ->route('quotation.index')
                ->with('error', 'El servicio seleccionado no existe. Por favor selecciona otro.');
        }

        $viewData = [
            'serviceType' => $params->getType(),
            'serviceId' => $params->getServiceId(),
            'conditions' => $conditionResolverService->getConditionsWithValues($serviceType),
        ];

        $viewData['conditions']['services'] = $serviceType->services->pluck('name', 'id');
        return inertia('Quotation/Index', [
            'viewData' => $viewData,
        ]);
    }
}
