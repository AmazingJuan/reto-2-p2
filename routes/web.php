<?php

use App\Http\Controllers\Api\QuotationApiController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\Quotation\QuotationController;
use App\Http\Controllers\Quotation\QuotationListController;
use App\Http\Controllers\TestApi\QuotationTestApiController;
use Illuminate\Support\Facades\Route;

Route::get('/', [HomeController::class, 'index'])->name('home');

Route::prefix('cotizacion')->group(function () {
    Route::get('/', [QuotationController::class, 'selectBusinessUnit'])->name('quotation.index');
    Route::get('/{serviceTypeId}', [QuotationController::class, 'show'])->name('quotation.show');
});

Route::prefix('lista')->middleware(['ajax'])->group(function () {
    Route::get('/', [QuotationListController::class, 'index'])->name('list.index');          // ver lista
    Route::post('/add', [QuotationListController::class, 'add'])->name('list.add');         // agregar item
    Route::put('/{id}', [QuotationListController::class, 'update'])->name('list.update'); // actualizar item
    Route::delete('/{id}', [QuotationListController::class, 'destroy'])->name('list.destroy'); // eliminar item
});

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


use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Inertia\Inertia;

require __DIR__.'/auth.php';
include __DIR__.'/admin.php';
include __DIR__.'/quotation.php';
include __DIR__.'/test.php';
include __DIR__.'/settings.php';
