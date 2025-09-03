<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

use App\Http\Controllers\Portfolio\PortfolioController;
use App\Http\Controllers\Portfolio\Services\ServicesController;
use App\Http\Controllers\HomeController;

Route::get('/', [HomeController::class, 'index'])->name('home');
Route::get('/portafolio', [PortfolioController::class, 'index'])->name('portfolio.index');
Route::get('/portafolio/cotizar', function () { return Inertia::render('portfolio/cotizar');})->name('portfolio.cotizar');
Route::get('/portafolio/{serviceTypeId}', [ServicesController::class, 'index'])->name('services.index');

