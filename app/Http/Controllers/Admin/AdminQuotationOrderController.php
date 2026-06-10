<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\AdminUpdateQuotationUrlRequest;
use App\Models\QuotationProposalOrder;
use App\Services\MailService;
use Exception;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AdminQuotationOrderController extends Controller
{
    public function index(Request $request): Response
    {
        $search = $request->string('search')->trim()->toString();

        $query = QuotationProposalOrder::query()->orderByDesc('created_at');

        if ($search !== '') {
            $like = '%'.$search.'%';
            $query->where(function ($q) use ($like) {
                $q->where('quotation_code', 'like', $like)
                    ->orWhere('business_unit', 'like', $like)
                    ->orWhere('contact_info->name', 'like', $like)
                    ->orWhere('contact_info->email', 'like', $like)
                    ->orWhere('contact_info->company', 'like', $like)
                    ->orWhere('contact_info->phone', 'like', $like)
                    ->orWhere('contact_info->role', 'like', $like);
            });
        }

        $viewData = [
            'quotationOrders' => $query->paginate(15)->withQueryString(),
            'filters' => [
                'search' => $search,
            ],
        ];

        return Inertia::render('admin/quotation-orders/index', ['viewData' => $viewData]);
    }

    public function show(string $quotationOrderId): Response|RedirectResponse
    {
        try {
            $quotationOrder = QuotationProposalOrder::with('professional')->findOrFail($quotationOrderId);
        } catch (ModelNotFoundException $e) {
            return redirect()->route('dashboard.quotation-orders.index')->with('error', 'Orden de cotizacion con ID: '.$quotationOrderId.' no encontrada.');
        } catch (Exception $e) {
            return redirect()->route('dashboard.quotation-orders.index')->with('error', 'Ha ocurrido un error al buscar la orden de cotización.');
        }

        $viewData = [];
        $viewData['quotationOrder'] = $quotationOrder;

        return Inertia::render('admin/quotation-orders/show', ['viewData' => $viewData]);
    }

    public function uploadQuotationUrl(AdminUpdateQuotationUrlRequest $request, string $quotationOrderId): Response|RedirectResponse
    {
        try {
            $quotationOrder = QuotationProposalOrder::findOrFail($quotationOrderId);
        } catch (ModelNotFoundException $e) {
            return redirect()->route('dashboard.quotation-orders.index')->with('error', 'Orden de cotizacion con ID: '.$quotationOrderId.' no encontrada.');
        } catch (Exception $e) {
            return redirect()->route('dashboard.quotation-orders.index')->with('error', 'Ha ocurrido un error al buscar la orden de cotización.');
        }

        $validatedData = $request->validated();
        $quotationUrl = $validatedData['quotation_url'];

        $quotationOrder->setQuotationUrl($quotationUrl);
        $quotationOrder->setIsGenerated(true);
        $quotationOrder->setViewedByClient(false);
        $quotationOrder->save();

        MailService::sendQuotationGeneratedEmail($quotationOrder);

        return redirect()->route('dashboard.quotation-orders.show', $quotationOrderId)->with('success', 'URL de cotización subida exitosamente.');
    }
}
