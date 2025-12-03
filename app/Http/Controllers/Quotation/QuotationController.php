<?php

namespace App\Http\Controllers\Quotation;

use App\Http\Controllers\Controller;
use App\Models\GestionLine;
use App\Models\BusinessUnit;
use Inertia\Inertia;
use Inertia\Response as InertiaResponse;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class QuotationController extends Controller
{
    public function selectBusinessUnit(): InertiaResponse
    {
        $businessUnitNames = GestionLine::pluck('name');
        
        $viewData['businessUnits'] = $businessUnitNames;

        return Inertia::render('business-units/select', compact('viewData'));
    }

    public function getQuoteForBusinessUnit(string $businessUnitName): InertiaResponse
    {
        $selectedBusinessUnit  = BusinessUnit::whereRaw('LOWER(name) = ?', [$businessUnitName])->first();

        if (!$selectedBusinessUnit){
            $viewData['errors'] = ['No hay ninguna unidad de negocio con ese nombre'];
            return Inertia::render('business-units/select', compact('viewData'));
        }

        $gestionLineNames = GestionLine::pluck('name');

        $viewData['businessUnit'] = $selectedBusinessUnit;
        $viewData['gestionLines'] = $gestionLineNames;

        return Inertia::render('nose', compact('viewData'));
    }
}
