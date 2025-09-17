<?php

use App\Http\Controllers\HomeController;
use App\Http\Controllers\Portfolio\PortfolioController;
use App\Http\Controllers\Portfolio\Quotation\QuotationController;
use App\Http\Controllers\Portfolio\Quotation\QuotationListController;
use App\Http\Controllers\Portfolio\Services\ServicesController;
use Illuminate\Support\Facades\Route;

Route::get('/', [HomeController::class, 'index'])->name('home');

Route::prefix('portafolio')->group(function () {
    Route::get('/', [PortfolioController::class, 'index'])->name('portfolio.index');
    Route::get('/{serviceTypeId}', [ServicesController::class, 'index'])->name('services.index');
});

Route::prefix('cotizacion')->group(function () {
    Route::get('/', [QuotationController::class, 'index'])->name('quotation.index');
    Route::get('/{serviceTypeId}', [QuotationController::class, 'show'])->name('quotation.show');
});

Route::prefix('lista')->middleware(['ajax'])->group(function () {
    Route::get('/', [QuotationListController::class, 'index'])->name('list.index');          // ver lista
    Route::post('/add', [QuotationListController::class, 'add'])->name('list.add');         // agregar item
    Route::put('/{id}', [QuotationListController::class, 'update'])->name('list.update'); // actualizar item
    Route::delete('/{id}', [QuotationListController::class, 'destroy'])->name('list.destroy'); // eliminar item
});
