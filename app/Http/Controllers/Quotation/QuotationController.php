<?php

namespace App\Http\Controllers\Quotation;

use App\Http\Controllers\Controller;
use App\Models\ServiceType;
use App\Services\ConditionResolverService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class QuotationController extends Controller
{
    public function index(): RedirectResponse
    {
        return redirect()->route('portfolio.index', ['base_path' => 'quotation.show']);
    }

    public function show(string $serviceTypeId, ConditionResolverService $conditionResolverService, Request $request)
    {
        $serviceId = $request->query('serviceId', null);

        $serviceType = ServiceType::find($serviceTypeId);
        if (! $serviceType) {
            return redirect()
                ->route('quotation.index')
                ->with('error', 'El servicio seleccionado no existe. Por favor selecciona otro.');
        }

        $viewData = [
            'serviceTypeId' => $serviceTypeId,
            'serviceType' => $serviceType->getName(),
            'serviceId' => $serviceId,
            'conditions' => $conditionResolverService->getConditionsWithValues($serviceType),
        ];

        $viewData['conditions']['services'] = $serviceType->services->pluck('name', 'id')->all();

        return inertia('portfolio/cotizar', [
            'viewData' => $viewData,
        ]);
    }
}
