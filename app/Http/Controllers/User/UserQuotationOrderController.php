<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class UserQuotationOrderController extends Controller
{
    public function index() : Response
    {
        $viewData = [];
        $user = Auth::user();
        $quotationOrders = $user->quotationOrders;
        $viewData['quotationOrders'] = $quotationOrders;

        return Inertia::render('users/quotation-orders/index', ['viewData' => $viewData]);
    }
}
