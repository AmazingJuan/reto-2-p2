<?php

use App\Http\Controllers\Admin\AdminDashboardController;
use App\Http\Controllers\Admin\AdminGestionLineController;
use App\Http\Controllers\Admin\AdminQuotationOrderController;
use App\Http\Controllers\Admin\AdminServiceController;
use Illuminate\Support\Facades\Route;

Route::prefix('admin')->group(function () {
    Route::get('/', [AdminDashboardController::class, 'index'])->name('admin.dashboard');

    // Services
    Route::get('/servicios', [AdminServiceController::class, 'index'])->name('admin.services.index');
    Route::delete('/servicios/{id}', [AdminServiceController::class, 'delete'])->name('admin.services.delete');
    Route::get('/servicios/crear', [AdminServiceController::class, 'create'])->name('admin.services.create');
    Route::post('/servicios', [AdminServiceController::class, 'store'])->name('admin.services.store');
    Route::get('/servicios/{id}/editar', [AdminServiceController::class, 'edit'])->name('admin.services.edit');
    Route::put('/servicios/{id}', [AdminServiceController::class, 'update'])->name('admin.services.update');

    // Gestion lines
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