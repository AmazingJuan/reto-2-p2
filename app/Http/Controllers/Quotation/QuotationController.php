<?php

namespace App\Http\Controllers\Quotation;

use App\Http\Controllers\Controller;
use App\Models\BusinessUnit;
use App\Models\GestionLine;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response as InertiaResponse;

class QuotationController extends Controller
{
    public function selectBusinessUnit(): InertiaResponse
    {
        $businessUnitNames = GestionLine::pluck('name');

        $viewData['businessUnits'] = $businessUnitNames;

        return Inertia::render('business-units/select', compact('viewData'));
    }

    public function getQuoteForBusinessUnit(string $businessUnitName): InertiaResponse|RedirectResponse
    {
        $selectedBusinessUnit = BusinessUnit::whereRaw('LOWER(name) = ?', [$businessUnitName])->first();

        if (! $selectedBusinessUnit) {
            return redirect()->route('test.select.business_unit')->withErrors(['businessUnit' => 'No hay ninguna unidad de negocio con ese nombre']);
        }

        $gestionLineNames = GestionLine::pluck('name');

        $viewData['businessUnit'] = $selectedBusinessUnit->getName();
        $viewData['gestionLines'] = $gestionLineNames;

        return Inertia::render('nose', compact('viewData'));
    }
}
