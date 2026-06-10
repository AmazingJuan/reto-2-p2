<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Jobs\GenerateClientsExport;
use App\Models\Client;
use App\Models\QuotationProposalOrder;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\BinaryFileResponse;

class AdminClientController extends Controller
{
    private const PER_PAGE = 15;

    public function index(Request $request): Response
    {
        $filters = $this->resolveFilters($request);

        $paginated = $this->baseQuery($filters)
            ->paginate(self::PER_PAGE)
            ->withQueryString()
            ->through(fn (Client $client) => $this->mapClient($client));

        return Inertia::render('admin/clients/index', [
            'viewData' => [
                'clients' => $paginated,
                'filters' => $filters,
                'options' => $this->buildFilterOptions(),
            ],
        ]);
    }

    public function show(Client $client): Response
    {
        $client->loadCount([
            'quotationProposalOrders as quotations_count',
            'quotationProposalOrders as generated_count' => fn (Builder $q) => $q->where('is_generated', true),
            'quotationProposalOrders as pending_count' => fn (Builder $q) => $q->where('is_generated', false),
        ]);

        $orders = $client->quotationProposalOrders()
            ->orderByDesc('created_at')
            ->get();

        $clientData = [
            'id' => $client->getId(),
            'name' => $client->getName(),
            'email' => $client->getEmail(),
            'company' => $client->getCompany(),
            'phone' => $client->getPhone(),
            'role' => $client->getRole(),
            'quotations_count' => (int) $client->getAttribute('quotations_count'),
            'generated_count' => (int) $client->getAttribute('generated_count'),
            'pending_count' => (int) $client->getAttribute('pending_count'),
            'first_quotation_at' => optional($orders->last()?->getCreatedAt())->toIso8601String(),
            'last_quotation_at' => optional($orders->first()?->getCreatedAt())->toIso8601String(),
        ];

        $quotations = $orders->map(fn (QuotationProposalOrder $o) => [
            'id' => $o->getId(),
            'quotation_code' => $o->getQuotationCode(),
            'business_unit' => $o->getBusinessUnit(),
            'gestion_line' => $o->getGestionLine(),
            'services_count' => count($o->getServices() ?? []),
            'is_generated' => $o->getIsGenerated(),
            'quotation_url' => $o->getQuotationUrl(),
            'created_at' => optional($o->getCreatedAt())->toIso8601String(),
        ])->values();

        return Inertia::render('admin/clients/show', [
            'viewData' => [
                'client' => $clientData,
                'quotations' => $quotations,
            ],
        ]);
    }

    /**
     * Queue the Excel generation and return a token the frontend can poll.
     */
    public function startExport(Request $request): JsonResponse
    {
        $filters = $this->resolveFilters($request);
        $token = (string) Str::uuid();

        cache()->put(GenerateClientsExport::statusKey($token), 'pending', now()->addHours(GenerateClientsExport::RETENTION_HOURS));

        GenerateClientsExport::dispatch($token, $filters);

        return response()->json(['token' => $token]);
    }

    public function exportStatus(string $token): JsonResponse
    {
        $status = cache()->get(GenerateClientsExport::statusKey($token), 'unknown');

        return response()->json(['status' => $status]);
    }

    public function downloadExport(string $token): BinaryFileResponse
    {
        $status = cache()->get(GenerateClientsExport::statusKey($token));
        $path = GenerateClientsExport::relativePath($token);

        abort_if($status !== 'ready' || ! Storage::disk('local')->exists($path), 404);

        $downloadName = 'clientes_'.now()->format('d-m-Y_h-iA').'.xlsx';
        $fullPath = Storage::disk('local')->path($path);

        cache()->forget(GenerateClientsExport::statusKey($token));

        return response()->download($fullPath, $downloadName)->deleteFileAfterSend(true);
    }

    /**
     * @return array{search:string, company:string, business_unit:string}
     */
    private function resolveFilters(Request $request): array
    {
        return [
            'search' => $request->string('search')->trim()->toString(),
            'company' => $request->string('company')->trim()->toString(),
            'business_unit' => $request->string('business_unit')->trim()->toString(),
        ];
    }

    /**
     * @param  array{search:string, company:string, business_unit:string}  $filters
     */
    private function baseQuery(array $filters): Builder
    {
        return Client::query()
            ->withClientStats()
            ->applyClientFilters($filters)
            ->orderByActivity();
    }

    /**
     * @return array<string, mixed>
     */
    private function mapClient(Client $client): array
    {
        return [
            'id' => $client->getId(),
            'name' => $client->getName(),
            'email' => $client->getEmail(),
            'company' => $client->getCompany(),
            'phone' => $client->getPhone(),
            'role' => $client->getRole(),
            'quotations_count' => (int) $client->getAttribute('quotations_count'),
            'generated_count' => (int) $client->getAttribute('generated_count'),
            'pending_count' => (int) $client->getAttribute('pending_count'),
            'last_quotation_at' => $client->getAttribute('last_quotation_at')
                ? Carbon::parse($client->getAttribute('last_quotation_at'))->toIso8601String()
                : null,
        ];
    }

    /**
     * @return array{companies:array<int,string>, businessUnits:array<int,string>}
     */
    private function buildFilterOptions(): array
    {
        $companies = Client::query()
            ->whereNotNull('company')
            ->where('company', '!=', '')
            ->distinct()
            ->orderBy('company')
            ->pluck('company')
            ->values()
            ->all();

        $businessUnits = QuotationProposalOrder::query()
            ->whereNotNull('business_unit')
            ->where('business_unit', '!=', '')
            ->distinct()
            ->orderBy('business_unit')
            ->pluck('business_unit')
            ->values()
            ->all();

        return [
            'companies' => $companies,
            'businessUnits' => $businessUnits,
        ];
    }
}
