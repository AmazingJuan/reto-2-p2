<?php

namespace App\Http\Controllers\Portfolio\Quotation;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class QuotationListController extends Controller
{
    public function index(): JsonResponse
    {
        $quotationList = session()->get('quotation_list', []);

        return response()->json($quotationList);
    }

    public function add(Request $request)
    {
        $quotationList = session()->get('quotation_list', []);

        $listItem = [
            'id' => uniqid(),
            'services' => $request->services,
            'options' => $request->options,
            'service_type_id' => $request->service_type_id,
            'service_type' => $request->service_type,
            'gestion_line' => $request->gestion_line,
            'gestion_line_id' => $request->gestion_line_id,
        ];

        $quotationList[] = $listItem;
        session()->put('quotation_list', $quotationList);
        return response()->json([
            'quotation_list' => $quotationList,
        ], 201);
    }
}
