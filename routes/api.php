<?php

use App\Http\Controllers\Api\QuotationApiController;
use Illuminate\Support\Facades\Route;

Route::prefix('api')->group(function () {
    Route::post('/quotation', [QuotationApiController::class, 'store']);
    Route::update('/quotation/{quotationOrderId}/quotation-url', [QuotationApiController::class, 'update']);
});
