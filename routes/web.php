<?php

use Illuminate\Support\Facades\Route;

use App\Http\Controllers\Portfolio\PortfolioController;
use App\Http\Controllers\Portfolio\Services\ServicesController;

Route::get('/portafolio', [PortfolioController::class, 'index'])->name('portfolio.index');
Route::get('/portafolio/{serviceTypeId}', [ServicesController::class, 'index'])->name('services.index');
