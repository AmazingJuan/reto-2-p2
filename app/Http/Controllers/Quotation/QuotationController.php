<?php

namespace App\Http\Controllers\Quotation;

use App\Http\Controllers\Controller;
use App\Models\BusinessUnit;
use App\Models\GestionLine;
use App\Models\Service;
use App\Services\MailService;
use App\Helpers\DecisionTreeHelper;
use App\Http\Requests\StoreQuotationProposal;
use App\Models\QuotationProposalOrder;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response as InertiaResponse;

class QuotationController extends Controller
{
    public function selectBusinessUnit(): InertiaResponse
    {
        $businessUnitNames = BusinessUnit::select('name', 'display_name')->get();

        $viewData['businessUnits'] = $businessUnitNames;

        return Inertia::render('business-units/select', compact('viewData'));
    }

    public function getQuoteForBusinessUnit(string $businessUnitName): InertiaResponse|RedirectResponse
    {
        $selectedBusinessUnit = BusinessUnit::where('name', $businessUnitName)->first();

        if (! $selectedBusinessUnit) {
            return redirect()->route('quotation.select.business_unit')->with('error', 'No hay ninguna unidad de negocio con ese nombre');
        }

        $gestionLineNames = GestionLine::pluck('name');

        if ($gestionLineNames->isEmpty()) {
            return redirect()->route('quotation.select.business_unit')->with('error', 'No existen líneas de gestión disponibles para cotizar.');
        }

        $services = Service::select('id', 'name', 'gestion_line_id')
            ->with('gestionLine:id,name')
            ->get();

        if ($services->isEmpty()) {
            return redirect()->route('quotation.select.business_unit')->with('error', 'No existen servicios disponibles para cotizar.');
        }

        $decisionTree = DecisionTreeHelper::buildTree($selectedBusinessUnit);

        if (empty($decisionTree)) {
            return redirect()->route('quotation.select.business_unit')->with('error', 'No existen condiciones definidas para la unidad de negocio seleccionada.');
        }

        $formattedServices = $services->groupBy(fn ($s) => $s->gestionLine->name)
            ->map(fn ($group) => $group->map(fn ($s) => $s->name));

        $viewData['businessUnit'] = $selectedBusinessUnit->getDisplayName();
        $viewData['gestionLines'] = $gestionLineNames;
        $viewData['services'] = $formattedServices;
        $viewData['conditions'] = $decisionTree;
        $viewData['initial_condition_id'] = $selectedBusinessUnit->getInitialCondition()?->getId() ?? null;

        return Inertia::render('quotation/index', compact('viewData'));
    }

    public function storeQuotationProposal(StoreQuotationProposal $request): RedirectResponse
    {
        $quotationProposalData = $request->validated();
        $quotationProposalId = (string) Str::uuid();

        $quotationProposalOrder = QuotationProposalOrder::create([
            'id' => $quotationProposalId,
            'contact_info' => $quotationProposalData['contact'],
            'services' => $quotationProposalData['services'],
            'business_unit' => $quotationProposalData['businessUnit'],
            'answers' => $quotationProposalData['answers'],
        ]);

        MailService::sendQuotationPendingEmail($quotationProposalOrder);

        return redirect()->route('home')->with('success', 'Su cotización ha sido procesada exitosamente.');
    }
}
