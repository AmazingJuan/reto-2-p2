<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\QuotationOrder;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class AdminQuotationOrderController extends Controller
{
    public function index(): Response
    {
        $viewData = [];
        $quotationOrders = QuotationOrder::all();
        $viewData['quotationOrders'] = $quotationOrders;

        return Inertia::render('admin/quotation-orders/index', ['viewData' => $viewData]);
    }

    public function show(string $quotationOrderId): Response|RedirectResponse
    {
        $viewData = [];
        $quotationOrder = QuotationOrder::find($quotationOrderId);

        if (! $quotationOrderId) {
            return redirect()->route('error');
        }

        $viewData['quotationOrder'] = $quotationOrder;

        return Inertia::render('admin/quotation-orders/show', ['viewData' => $viewData]);
    }
}
