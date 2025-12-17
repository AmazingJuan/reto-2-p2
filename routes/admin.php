<?php

use App\Http\Controllers\Admin\AdminBusinessUnitController;
use App\Http\Controllers\Admin\AdminDashboardController;
use App\Http\Controllers\Admin\AdminGestionLineController;
use App\Http\Controllers\Admin\AdminQuotationOrderController;
use App\Http\Controllers\Admin\AdminServiceController;
use App\Http\Controllers\Admin\AdminUserController;
use App\Http\Controllers\ProfileController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/perfil', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/perfil', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/perfil', [ProfileController::class, 'destroy'])->name('profile.destroy');
});


Route::prefix('dashboard')->middleware(['auth', 'verified'])->group(function () {
    Route::get('/', [AdminDashboardController::class, 'index'])->name('dashboard');

    // Services
    Route::get('/servicios', [AdminServiceController::class, 'index'])->name('dashboard.services.index');
    Route::delete('/servicios/{id}', [AdminServiceController::class, 'delete'])->name('dashboard.services.delete');
    Route::get('/servicios/crear', [AdminServiceController::class, 'create'])->name('dashboard.services.create');
    Route::post('/servicios', [AdminServiceController::class, 'store'])->name('dashboard.services.store');
    Route::get('/servicios/{id}/editar', [AdminServiceController::class, 'edit'])->name('dashboard.services.edit');
    Route::put('/servicios/{id}', [AdminServiceController::class, 'update'])->name('dashboard.services.update');

    // Lineas de gestion
    Route::get('/lineas-gestion', [AdminGestionLineController::class, 'index'])->name('dashboard.lines.index');
    Route::delete('/lineas-gestion/{id}', [AdminGestionLineController::class, 'delete'])->name('dashboard.lines.delete');
    Route::get('/lineas-gestion/crear', [AdminGestionLineController::class, 'create'])->name('dashboard.lines.create');
    Route::post('/lineas-gestion', [AdminGestionLineController::class, 'store'])->name('dashboard.lines.store');
    Route::get('/lineas-gestion/{id}/editar', [AdminGestionLineController::class, 'edit'])->name('dashboard.lines.edit');
    Route::put('/lineas-gestion/{id}', [AdminGestionLineController::class, 'update'])->name('dashboard.lines.update');

    // Ordenes de cotización
    Route::get('/ordenes-cotizacion', [AdminQuotationOrderController::class, 'index'])->name('dashboard.quotation-orders.index');
    Route::get('/ordenes-cotizacion/{id}', [AdminQuotationOrderController::class, 'show'])->name('dashboard.quotation-orders.show');

    // Unidades de negocio
    Route::get('/unidad-negocio', [AdminBusinessUnitController::class, 'index'])->name('dashboard.business-unit.index');
    Route::get('/unidad-negocio/{id}', [AdminBusinessUnitController::class, 'show'])->where('id', '[0-9]+')->name('dashboard.business-unit.show');
    Route::delete('/unidad-negocio/{id}', [AdminBusinessUnitController::class, 'delete'])->where('id', '[0-9]+')->name('dashboard.business-unit.delete');
    Route::get('/unidad-negocio/crear', [AdminBusinessUnitController::class, 'create'])->name('dashboard.business-unit.create');
    Route::post('/unidad-negocio', [AdminBusinessUnitController::class, 'store'])->name('dashboard.business-unit.store');
    Route::get('/unidad-negocio/{id}/editar', [AdminBusinessUnitController::class, 'edit'])->where('id', '[0-9]+')->name('dashboard.business-unit.edit');
    Route::put('/unidad-negocio/{id}', [AdminBusinessUnitController::class, 'update'])->where('id', '[0-9]+')->name('dashboard.business-unit.update');

    // Usuarios
    Route::get('/usuarios', [AdminUserController::class, 'index'])->name('dashboard.users.index');
    Route::delete('/usuarios/{id}', [AdminUserController::class, 'delete'])->name('dashboard.users.delete');
    Route::get('/usuarios/crear', [AdminUserController::class, 'create'])->name('dashboard.users.create');
    Route::post('/usuarios', [AdminUserController::class, 'store'])->name('dashboard.users.store');
    Route::get('/usuarios/{id}/editar', [AdminUserController::class, 'edit'])->name('dashboard.users.edit');
    Route::put('/usuarios/{id}', [AdminUserController::class, 'update'])->name('dashboard.users.update');
});
