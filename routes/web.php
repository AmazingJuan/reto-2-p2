<?php

use App\Http\Controllers\Admin\AdminDashboardController;
use App\Http\Controllers\Admin\AdminGestionLineController;
use App\Http\Controllers\Admin\AdminQuotationOrderController;
use App\Http\Controllers\Admin\AdminServiceController;
use App\Http\Controllers\Api\QuotationApiController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\Portfolio\PortfolioController;
use App\Http\Controllers\Portfolio\Quotation\QuotationController;
use App\Http\Controllers\Portfolio\Quotation\QuotationListController;
use App\Http\Controllers\Portfolio\Services\ServicesController;
use App\Http\Controllers\TestApi\QuotationTestApiController;
use App\Http\Controllers\User\UserProfileController;
use App\Http\Controllers\User\UserQuotationOrderController;
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

Route::prefix('usuario')->group(function () {
    Route::get('/', [UserProfileController::class, 'index'])->name('user.profile');

    Route::get('/ordenes-cotizacion', [UserQuotationOrderController::class, 'index'])
        ->name('user.orders');
    Route::get('/ordenes-cotizacion/{id}', [UserQuotationOrderController::class, 'show'])
        ->name('user.orders.show');
});

Route::prefix('admin')->group(function () {
    Route::get('/', [AdminDashboardController::class, 'index'])->name('admin.dashboard');

    // Servicios
    Route::get('/servicios', [AdminServiceController::class, 'index'])->name('admin.services.index');
    Route::delete('/servicios/{id}', [AdminServiceController::class, 'delete'])->name('admin.services.delete');
    Route::get('/servicios/crear', [AdminServiceController::class, 'create'])->name('admin.services.create');
    Route::post('/servicios', [AdminServiceController::class, 'store'])->name('admin.services.store');
    Route::get('/servicios/{id}/editar', [AdminServiceController::class, 'edit'])->name('admin.services.edit');
    Route::put('/servicios/{id}', [AdminServiceController::class, 'update'])->name('admin.services.update');

    // Linea de gestion
    Route::get('/lineas-gestion', [AdminGestionLineController::class, 'index'])->name('admin.lines.index');
    Route::delete('/lineas-gestion/{id}', [AdminGestionLineController::class, 'delete'])->name('admin.lines.delete');
    Route::get('/lineas-gestion/crear', [AdminGestionLineController::class, 'create'])->name('admin.lines.create');
    Route::post('/lineas-gestion', [AdminGestionLineController::class, 'store'])->name('admin.lines.store');
    Route::get('/lineas-gestion/{id}/editar', [AdminGestionLineController::class, 'edit'])->name('admin.lines.edit');
    Route::put('/lineas-gestion/{id}', [AdminGestionLineController::class, 'update'])->name('admin.lines.update');

    // Ordenes de cotización
    Route::get('/ordenes-cotizacion', [AdminQuotationOrderController::class, 'index'])->name('admin.quotation-orders.index');
    Route::get('/ordenes-cotizacion/{id}', [AdminQuotationOrderController::class, 'show'])->name('admin.quotation-orders.show');

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
