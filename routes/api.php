<?php

use App\Api\Controllers\QuotationOrderApiController;
use Illuminate\Support\Facades\Route;

Route::apiResource('/quotations', QuotationOrderApiController::class)->only(['index']);
