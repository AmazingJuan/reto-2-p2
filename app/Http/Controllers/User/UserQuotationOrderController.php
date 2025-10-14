<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\QuotationOrder;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class UserQuotationOrderController extends Controller
{
    public function index(): Response
    {
        $viewData = [];
        $user = Auth::user();
        $quotationOrders = $user->quotationOrders;
        $viewData['quotationOrders'] = $quotationOrders;

        return Inertia::render('users/quotation-orders/index', ['viewData' => $viewData]);
    }

    public function show(string $quotationOrderId): Response
    {
        $viewData = [];
        $quotationOrder = QuotationOrder::find($quotationOrderId);

        $viewData['quotationOrder'] = $quotationOrder;

        return Inertia::render('users/quotation-orders/show', ['viewData' => $viewData]);
    }
}
