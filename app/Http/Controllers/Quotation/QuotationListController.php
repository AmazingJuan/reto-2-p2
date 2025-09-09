<?php

namespace App\Http\Controllers\Quotation;

use App\Http\Controllers\Controller;
use Illuminate\Database\Eloquent\Casts\Json;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class QuotationListController extends Controller
{
    public function index(): JsonResponse
    {
        $quotationList = session()->get('quotation_list', []);

        return response()->json($quotationList);

    }

    public function add(Request $request) : JsonResponse
    {
        $quotationList = session()->get('quotation_list', []);

        $listItem = [
            'id' => uniqid(),
            'services' => $request->services,
            'options' => $request->options,
            'type' => $request->serviceType,
        ];

        $quotationList[] = $listItem;
        session()->put('quotation_list', $quotationList);

        return response()->json(['quotation_list' => $quotationList]);
    }

    public function destroy($id) : JsonResponse
    {
        $quotationList = session()->get('quotation_list', []);
        $quotationList = array_filter($quotationList, fn ($item) => $item['id'] != $id);
        session()->put('quotation_list', array_values($quotationList));

        return response()->json(['quotation_list' => $quotationList]);
    }
}
