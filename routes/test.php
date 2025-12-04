<?php

use App\Http\Controllers\Test\Quotation\QuotationController;
use Illuminate\Support\Facades\Route;

Route::prefix('test')->group(function () {
    Route::get('/select-business-line', [QuotationController::class, 'selectBusinessUnit'])->name('test.select.business_unit');
    Route::get('/select-business-line/empty', [QuotationController::class, 'selectBusinessUnitEmpty']);
    Route::get('/select-business-line/many', [QuotationController::class, 'selectBusinessUnitMany']);

});
