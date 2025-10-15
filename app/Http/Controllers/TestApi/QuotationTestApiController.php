<?php

namespace App\Http\Controllers\TestApi;

use App\Http\Controllers\Controller;
use App\Models\QuotationOrder;
use Inertia\Inertia;
use Inertia\Response;

class QuotationTestApiController extends Controller
{
    public function index(): Response
    {
        $viewData = [];
        $quotationOrders = QuotationOrder::where('is_generated', false)->get();
        $viewData['quotationOrders'] = $quotationOrders;

        return Inertia::render('test/quotation-api/index', ['viewData' => $viewData]);
    }
}
