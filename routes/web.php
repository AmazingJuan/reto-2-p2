<?php

use App\Http\Controllers\Api\QuotationApiController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\TestApi\QuotationTestApiController;
use Illuminate\Support\Facades\Route;

Route::get('/', [HomeController::class, 'index'])->name('home');

require __DIR__.'/auth.php';
include __DIR__.'/admin.php';
include __DIR__.'/quotation.php';
include __DIR__.'/test.php';
