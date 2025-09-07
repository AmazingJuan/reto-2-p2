<?php

use App\Http\Controllers\HomeController;
use App\Http\Controllers\Portfolio\PortfolioController;
use App\Http\Controllers\Portfolio\Services\ServicesController;
use App\Http\Controllers\Quotation\QuotationController;
use Illuminate\Support\Facades\Route;

Route::get('/', [HomeController::class, 'index'])->name('home');

Route::prefix('portafolio')->group(function () {
    Route::get('/', [PortfolioController::class, 'index'])->name('portfolio.index');
    Route::get('/{serviceTypeId}', [ServicesController::class, 'index'])->name('services.index');
});

Route::prefix('cotizar')->group(function () {
    Route::get('/', [QuotationController::class, 'index'])->name('quotation.index');
});
