<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Mail\QuotationGenerated;
use App\Models\QuotationOrder;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Mail;

class QuotationApiController extends Controller
{
    public function store(Request $request): JsonResponse
    {
        $quotationData = $request->only('services', 'options', 'service_type_id', 'gestion_line_id');
        $quotationData['id'] = uniqid();
        $quotationData['user_id'] = Auth::id();

        $quotationOrder = QuotationOrder::create($quotationData);

        return response()->json($quotationOrder, 201);
    }

    public function updateQuotationUrl(Request $request, string $quotationId): JsonResponse
    {
        $generatedQuotationUrl = $request->input('url');

        $quotationOrder = QuotationOrder::find($quotationId);

        if ($quotationOrder == null) {
            return response()->json(['error' => 'Quotation Order not found'], 404);
        }

        $quotationOrder->update([
            'quotation_url' => $generatedQuotationUrl,
            'is_generated' => true,
        ]);

        $user = $quotationOrder->user;

        Mail::to($user->email)->send(new QuotationGenerated($quotationOrder));

        return response()->json([], 204);
    }
}
