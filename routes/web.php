<?php

use App\Http\Controllers\Api\QuotationApiController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\TestApi\QuotationTestApiController;
use Illuminate\Support\Facades\Route;

Route::get('/', [HomeController::class, 'index'])->name('home');

Route::prefix('test-api')->group(function () {
    Route::get('/quotation', [QuotationTestApiController::class, 'index']);
});

Route::prefix('api')->group(function () {
    Route::post('/quotation', [QuotationApiController::class, 'store'])->name('quotation_order.create');
    Route::patch('/quotation/{quotationOrderId}/quotation-url', [QuotationApiController::class, 'updateQuotationUrl'])->name('quotation_order.confirm');
});

Route::get('/test-email/quotation', function () {
    $quotationId = 12345;
    $quotationUrl = 'https://www.trainingcorporation.com.co/cotizaciones/12345';

    return view('emails.quotation', [
        'quotationId' => $quotationId,
        'quotationUrl' => $quotationUrl,
    ]);
});

require __DIR__.'/auth.php';
include __DIR__.'/admin.php';
include __DIR__.'/quotation.php';
include __DIR__.'/test.php';
