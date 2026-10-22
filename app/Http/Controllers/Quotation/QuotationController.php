<?php

namespace App\Http\Controllers\Quotation;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreQuotationProposal;
use App\Models\BusinessUnit;
use App\Models\Client;
use App\Models\GestionLine;
use App\Models\Professional;
use App\Models\QuotationProposalOrder;
use App\Models\Service;
use App\Services\DecisionTreeService;
use App\Services\MailService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response as InertiaResponse;

class QuotationController extends Controller
{
    public function __construct(
        private readonly DecisionTreeService $trees,
        private readonly MailService $mail,
    ) {}

    public function selectBusinessUnit(): InertiaResponse
    {
        return Inertia::render('business-units/select', [
            'viewData' => [
                // Units without services can't be quoted, so they aren't offered.
                'businessUnits' => BusinessUnit::query()
                    ->whereHas('services')
                    ->withCount('services')
                    ->orderBy('display_name')
                    ->get(['id', 'name', 'display_name'])
                    ->map(fn (BusinessUnit $unit) => [
                        'name' => $unit->getName(),
                        'display_name' => $unit->getDisplayName(),
                        'services_count' => $unit->services_count,
                    ]),
            ],
        ]);
    }

    public function getQuoteForBusinessUnit(string $businessUnitName): InertiaResponse|RedirectResponse
    {
        $businessUnit = BusinessUnit::query()->where('name', $businessUnitName)->first();

        if (! $businessUnit) {
            return $this->backToSelection('No hay ninguna unidad de negocio con ese nombre.');
        }

        $servicesByLine = Service::query()
            ->where('business_unit_id', $businessUnit->getId())
            ->with('gestionLine:id,name')
            ->orderBy('name')
            ->get(['id', 'name', 'gestion_line_id'])
            ->groupBy(fn (Service $service) => $service->getGestionLine()->getName())
            ->sortKeys()
            ->map(fn ($services) => $services->map(fn (Service $service) => $service->getName())->values());

        if ($servicesByLine->isEmpty()) {
            return $this->backToSelection('No existen servicios configurados para esta unidad de negocio.');
        }

        $conditions = $this->trees->reachableTree($businessUnit);

        if ($conditions === []) {
            return $this->backToSelection('No existen condiciones definidas para la unidad de negocio seleccionada.');
        }

        return Inertia::render('quotation/index', [
            'viewData' => [
                'businessUnit' => $businessUnit->getDisplayName(),
                'gestionLines' => $servicesByLine->keys(),
                'services' => $servicesByLine,
                'conditions' => $conditions,
                'initial_condition_id' => $businessUnit->initial_condition_id,
                'professionalsByGestionLine' => $this->professionalsByLine($servicesByLine->keys()->all()),
            ],
        ]);
    }

    public function storeQuotationProposal(StoreQuotationProposal $request): RedirectResponse
    {
        $data = $request->validated();

        $order = DB::transaction(function () use ($data) {
            $businessUnit = BusinessUnit::query()->where('display_name', $data['businessUnit'])->firstOrFail();

            return QuotationProposalOrder::create([
                'quotation_code' => $businessUnit->lockAndAllocateNextQuotationCode(),
                'client_id' => Client::upsertFromContact($data['contact'])->getId(),
                'services' => $data['services'],
                'business_unit' => $data['businessUnit'],
                'gestion_line' => implode(', ', $data['gestionLines']),
                'answers' => $data['answers'],
                'professional_id' => $data['professional_id'] ?? null,
            ]);
        });

        $this->mail->sendQuotationPending($order);

        return to_route('home')->with('success', 'Su cotización ha sido procesada exitosamente.');
    }

    /**
     * Link sent by e-mail: marks the quotation as seen and forwards the client
     * to the document.
     */
    public function receiveQuotation(Request $request, string $quotationId): RedirectResponse
    {
        if (! $request->hasValidSignature()) {
            return to_route('home')->with('error', 'La URL de la cotización ha expirado o no es válida.');
        }

        $quotation = QuotationProposalOrder::find($quotationId);

        if (! $quotation?->getQuotationUrl()) {
            return to_route('home')->with('error', 'La cotización aún no tiene un documento disponible.');
        }

        if (! $quotation->getViewedByClient()) {
            $quotation->setViewedByClient(true);
            $quotation->save();
        }

        return redirect()->away($quotation->getQuotationUrl());
    }

    /**
     * Professionals per gestion line, anonymised (id + experience only).
     *
     * @param  list<string>  $lineNames
     * @return array<string, list<array{id:int, years_experience:int}>>
     */
    private function professionalsByLine(array $lineNames): array
    {
        return GestionLine::query()
            ->whereIn('name', $lineNames)
            ->with(['professionals' => fn ($query) => $query
                ->select('professionals.id', 'professionals.years_experience')
                ->orderBy('professionals.years_experience')
                ->orderBy('professionals.id')])
            ->get()
            ->mapWithKeys(fn (GestionLine $line) => [
                $line->getName() => $line->professionals
                    ->map(fn (Professional $professional) => $professional->only('id', 'years_experience'))
                    ->all(),
            ])
            ->all();
    }

    private function backToSelection(string $error): RedirectResponse
    {
        return to_route('quotation.select.business_unit')->with('error', $error);
    }
}
