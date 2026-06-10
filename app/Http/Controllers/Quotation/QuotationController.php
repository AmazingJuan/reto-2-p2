<?php

namespace App\Http\Controllers\Quotation;

use App\Helpers\DecisionTreeHelper;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreQuotationProposal;
use App\Models\BusinessUnit;
use App\Models\Client;
use App\Models\GestionLine;
use App\Models\Professional;
use App\Models\QuotationProposalOrder;
use App\Models\Service;
use App\Services\MailService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Illuminate\Http\Request;
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

        $services = Service::query()
            ->where('business_unit_id', $selectedBusinessUnit->getId())
            ->whereNotNull('gestion_line_id')
            ->select('id', 'name', 'gestion_line_id')
            ->with('gestionLine:id,name')
            ->orderBy('name')
            ->get();

        if ($services->isEmpty()) {
            return redirect()->route('quotation.select.business_unit')->with('error', 'No existen servicios configurados para esta unidad de negocio.');
        }

        $decisionTree = DecisionTreeHelper::buildTree($selectedBusinessUnit);

        if (empty($decisionTree)) {
            return redirect()->route('quotation.select.business_unit')->with('error', 'No existen condiciones definidas para la unidad de negocio seleccionada.');
        }

        $formattedServices = $services
            ->filter(fn (Service $s) => $s->gestionLine !== null)
            ->groupBy(fn (Service $s) => $s->gestionLine->getName())
            ->map(fn ($group) => $group->map(fn (Service $s) => $s->getName())->values());

        if ($formattedServices->isEmpty()) {
            return redirect()->route('quotation.select.business_unit')->with('error', 'Los servicios de esta unidad no tienen línea de gestión válida. Revise la configuración.');
        }

        $gestionLineNames = $formattedServices->keys()->sort()->values();

        $viewData['businessUnit'] = $selectedBusinessUnit->getDisplayName();
        $viewData['gestionLines'] = $gestionLineNames;
        $viewData['services'] = $formattedServices;
        $viewData['conditions'] = $decisionTree;
        $viewData['initial_condition_id'] = $selectedBusinessUnit->getInitialCondition()?->getId() ?? null;

        $lineNamesForQuote = $gestionLineNames->all();

        $viewData['professionalsByGestionLine'] = GestionLine::query()
            ->whereIn('name', $lineNamesForQuote)
            ->with(['professionals' => function ($q) {
                $q->select(['professionals.id', 'professionals.years_experience'])
                    ->orderBy('professionals.years_experience')
                    ->orderBy('professionals.id');
            }])
            ->orderBy('name')
            ->get()
            ->mapWithKeys(fn (GestionLine $line) => [
                $line->getName() => $line->professionals->map(fn (Professional $p) => [
                    'id' => $p->id,
                    'years_experience' => $p->years_experience,
                ])->values()->all(),
            ])
            ->all();
        $viewData['hasAnyProfessionalsInDb'] = Professional::query()->exists();

        return Inertia::render('quotation/index', compact('viewData'));
    }

    public function storeQuotationProposal(StoreQuotationProposal $request): RedirectResponse
    {
        $quotationProposalData = $request->validated();
        $quotationProposalId = (string) Str::uuid();

        $quotationProposalOrder = DB::transaction(function () use ($quotationProposalData, $quotationProposalId) {
            $businessUnit = BusinessUnit::query()
                ->where('display_name', $quotationProposalData['businessUnit'])
                ->firstOrFail();

            $quotationCode = $businessUnit->lockAndAllocateNextQuotationCode();

            $client = $this->resolveClient($quotationProposalData['contact']);

            return QuotationProposalOrder::create([
                'id' => $quotationProposalId,
                'quotation_code' => $quotationCode,
                'client_id' => $client->getId(),
                'services' => $quotationProposalData['services'],
                'business_unit' => $quotationProposalData['businessUnit'],
                'gestion_line' => $quotationProposalData['gestionLine'],
                'answers' => $quotationProposalData['answers'],
                'professional_id' => $quotationProposalData['professional_id'] ?? null,
            ]);
        });

        MailService::sendQuotationPendingEmail($quotationProposalOrder);

        return redirect()->route('home')->with('success', 'Su cotización ha sido procesada exitosamente.');
    }

    /**
     * Find the client by email (case-insensitive) or create it, refreshing the
     * contact data with the latest values provided in this quotation.
     *
     * @param  array<string, mixed>  $contact
     */
    private function resolveClient(array $contact): Client
    {
        $email = Str::lower(trim((string) ($contact['email'] ?? '')));

        $normalize = static function ($value): ?string {
            if (! is_string($value)) {
                return null;
            }
            $trimmed = trim($value);

            return $trimmed === '' ? null : $trimmed;
        };

        return Client::updateOrCreate(
            ['email' => $email],
            [
                'name' => trim((string) ($contact['name'] ?? '')),
                'company' => $normalize($contact['company'] ?? null),
                'phone' => $normalize($contact['phone'] ?? null),
                'role' => $normalize($contact['role'] ?? null),
            ]
        );
    }
}
