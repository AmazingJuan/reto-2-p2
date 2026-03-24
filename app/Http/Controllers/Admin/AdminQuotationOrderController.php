<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\AdminUpdateQuotationUrlRequest;
use App\Models\QuotationProposalOrder;
use Exception;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use App\Services\MailService;
class AdminQuotationOrderController extends Controller
{
    public function index(): Response
    {
        $viewData = [];
        $quotationOrders = QuotationProposalOrder::all();
        $viewData['quotationOrders'] = $quotationOrders;

        return Inertia::render('admin/quotation-orders/index', ['viewData' => $viewData]);
    }

    public function show(string $quotationOrderId): Response|RedirectResponse
    {
        try{
        $quotationOrder = QuotationProposalOrder::findOrFail($quotationOrderId);
        } catch (ModelNotFoundException $e) {
            return redirect()->route('dashboard.quotation-orders.index')->with('error', 'Orden de cotizacion con ID: '.$quotationOrderId.' no encontrada.');
        }
        catch (Exception $e) {
            return redirect()->route('dashboard.quotation-orders.index')->with('error', 'Ha ocurrido un error al buscar la orden de cotización.');
        }

        $viewData = [];
        $viewData['quotationOrder'] = $quotationOrder;

        return Inertia::render('admin/quotation-orders/show', ['viewData' => $viewData]);
    }

    public function uploadQuotationUrl(AdminUpdateQuotationurlRequest $request, string $quotationOrderId): Response|RedirectResponse
    {
        try{
            $quotationOrder = QuotationProposalOrder::findOrFail($quotationOrderId);
        } catch (ModelNotFoundException $e) {
            return redirect()->route('dashboard.quotation-orders.index')->with('error', 'Orden de cotizacion con ID: '.$quotationOrderId.' no encontrada.');
        }
        catch (Exception $e) {
            return redirect()->route('dashboard.quotation-orders.index')->with('error', 'Ha ocurrido un error al buscar la orden de cotización.');
        }

        $validatedData = $request->validated();
        $quotationUrl = $validatedData['quotation_url'];

        $quotationOrder->setQuotationUrl($quotationUrl);
        $quotationOrder->setIsGenerated(true);
        $quotationOrder->save();

        MailService::sendQuotationGeneratedEmail($quotationOrder);

        return redirect()->route('dashboard.quotation-orders.show', $quotationOrderId)->with('success', 'URL de cotización subida exitosamente.');
    }
}
