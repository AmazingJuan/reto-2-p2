<?php

namespace App\Http\Controllers\Test;

use App\Http\Controllers\Controller;
use Inertia\Inertia;
use Inertia\Response as InertiaResponse;

class QuotationController extends Controller
{
    public function selectBusinessUnit(): InertiaResponse
    {
        $businessUnitNames = ['Formacion', 'aUditoria', 'mInero Energetico', 'Consultoria'];

        $viewData['businessUnits'] = $businessUnitNames;

        return Inertia::render('business-units/select', compact('viewData'));
    }

    public function selectBusinessUnitMany(): InertiaResponse
    {
        $businessUnitNames = ['Formacion', 'aUditoria', 'mInero Energetico', 'Consultoria', 'aUditoria', 'mInero Energetico', 'Consultoria', 'aUditoria', 'mInero Energetico', 'Consultoria', 'aUditoria', 'mInero Energetico', 'Consultoria', 'aUditoria', 'mInero Energetico', 'Consultoria', 'aUditoria', 'mInero Energetico', 'Consultoria', 'aUditoria', 'mInero Energetico', 'Consultoria', 'aUditoria', 'mInero Energetico', 'Consultoria', 'aUditoria', 'mInero Energetico', 'Consultoria', 'aUditoria', 'mInero Energetico', 'Consultoria', 'aUditoria', 'mInero Energetico', 'Consultoria', 'aUditoria', 'mInero Energetico', 'Consultoria', 'aUditoria', 'mInero Energetico', 'Consultoria', 'aUditoria', 'mInero Energetico', 'Consultoria', 'aUditoria', 'mInero Energetico', 'Consultoria', 'aUditoria', 'mInero Energetico', 'Consultoria', 'aUditoria', 'mInero Energetico', 'Consultoria', 'aUditoria', 'mInero Energetico', 'Consultoria', 'aUditoria', 'mInero Energetico', 'Consultoria', 'aUditoria', 'mInero Energetico', 'Consultoria', 'aUditoria', 'mInero Energetico', 'Consultoria', 'aUditoria', 'mInero Energetico', 'Consultoria', 'aUditoria', 'mInero Energetico', 'Consultoria', 'aUditoria', 'mInero Energetico', 'Consultoria', 'aUditoria', 'mInero Energetico', 'Consultoria', 'aUditoria', 'mInero Energetico', 'Consultoria', 'aUditoria', 'mInero Energetico', 'Consultoria', 'aUditoria', 'mInero Energetico', 'Consultoria', 'aUditoria', 'mInero Energetico', 'Consultoria', 'aUditoria', 'mInero Energetico', 'Consultoria'];

        $viewData['businessUnits'] = $businessUnitNames;

        return Inertia::render('business-units/select', compact('viewData'));
    }

    public function selectBusinessUnitEmpty(): InertiaResponse
    {
        $businessUnitNames = [];

        $viewData['businessUnits'] = $businessUnitNames;

        return Inertia::render('business-units/select', compact('viewData'));
    }
}
