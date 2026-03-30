<?php

use App\Http\Controllers\Admin\AdminBusinessUnitController;
use App\Http\Controllers\Admin\AdminConfigurationController;
use App\Http\Controllers\Admin\AdminDashboardController;
use App\Http\Controllers\Admin\AdminDecisionTreeController;
use App\Http\Controllers\Admin\AdminGestionLineController;
use App\Http\Controllers\Admin\AdminProfessionalController;
use App\Http\Controllers\Admin\AdminQuotationOrderController;
use App\Http\Controllers\Admin\AdminServiceController;
use App\Http\Controllers\Admin\AdminUserController;
use App\Http\Controllers\Admin\AdminWelcomeBroadcastController;
use Illuminate\Support\Facades\Route;

Route::prefix('dashboard')->middleware(['auth', 'verified'])->group(function () {
    Route::get('/', [AdminDashboardController::class, 'index'])->name('dashboard');

    // Usuarios
    Route::get('/usuarios', [AdminUserController::class, 'index'])->name('dashboard.users.index');
    Route::get('/usuarios/crear', [AdminUserController::class, 'create'])->name('dashboard.users.create');
    Route::post('/usuarios', [AdminUserController::class, 'store'])->name('dashboard.users.store');
    Route::get('/usuarios/{id}/editar', [AdminUserController::class, 'edit'])->where('id', '[0-9]+')->name('dashboard.users.edit');
    Route::put('/usuarios/{id}', [AdminUserController::class, 'update'])->where('id', '[0-9]+')->name('dashboard.users.update');
    Route::delete('/usuarios/{id}', [AdminUserController::class, 'destroy'])->where('id', '[0-9]+')->name('dashboard.users.delete');

    // Services
    Route::get('/servicios', [AdminServiceController::class, 'index'])->name('dashboard.services.index');
    Route::delete('/servicios/{id}', [AdminServiceController::class, 'delete'])->name('dashboard.services.delete');
    Route::get('/servicios/crear', [AdminServiceController::class, 'create'])->name('dashboard.services.create');
    Route::post('/servicios', [AdminServiceController::class, 'store'])->name('dashboard.services.store');
    Route::get('/servicios/{id}/editar', [AdminServiceController::class, 'edit'])->name('dashboard.services.edit');
    Route::put('/servicios/{id}', [AdminServiceController::class, 'update'])->name('dashboard.services.update');

    // Profesionales
    Route::get('/profesionales', [AdminProfessionalController::class, 'index'])->name('dashboard.professionals.index');
    Route::get('/profesionales/crear', [AdminProfessionalController::class, 'create'])->name('dashboard.professionals.create');
    Route::post('/profesionales', [AdminProfessionalController::class, 'store'])->name('dashboard.professionals.store');
    Route::get('/profesionales/{id}', [AdminProfessionalController::class, 'show'])->where('id', '[0-9]+')->name('dashboard.professionals.show');
    Route::get('/profesionales/{id}/editar', [AdminProfessionalController::class, 'edit'])->where('id', '[0-9]+')->name('dashboard.professionals.edit');
    Route::put('/profesionales/{id}', [AdminProfessionalController::class, 'update'])->where('id', '[0-9]+')->name('dashboard.professionals.update');
    Route::delete('/profesionales/{id}', [AdminProfessionalController::class, 'destroy'])->where('id', '[0-9]+')->name('dashboard.professionals.delete');

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
    Route::post('/ordenes-cotizacion/{id}/upload-quotation-url', [AdminQuotationOrderController::class, 'uploadQuotationUrl'])->name('dashboard.quotation-orders.upload-quotation-url');
    // Unidades de negocio
    Route::get('/unidad-negocio', [AdminBusinessUnitController::class, 'index'])->name('dashboard.business-unit.index');
    Route::get('/unidad-negocio/{id}', [AdminBusinessUnitController::class, 'show'])->where('id', '[0-9]+')->name('dashboard.business-unit.show');
    Route::delete('/unidad-negocio/{id}', [AdminBusinessUnitController::class, 'delete'])->where('id', '[0-9]+')->name('dashboard.business-unit.delete');
    Route::get('/unidad-negocio/crear', [AdminBusinessUnitController::class, 'create'])->name('dashboard.business-unit.create');
    Route::post('/unidad-negocio', [AdminBusinessUnitController::class, 'store'])->name('dashboard.business-unit.store');
    Route::get('/unidad-negocio/{id}/editar', [AdminBusinessUnitController::class, 'edit'])->where('id', '[0-9]+')->name('dashboard.business-unit.edit');
    Route::put('/unidad-negocio/{id}', [AdminBusinessUnitController::class, 'update'])->where('id', '[0-9]+')->name('dashboard.business-unit.update');

    // Arbol de decision

    Route::get('/arbol-decision', [AdminDecisionTreeController::class, 'index'])->name('dashboard.business-unit.decision-tree');
    Route::post('/arbol-decision', [AdminDecisionTreeController::class, 'update'])->name('dashboard.business-unit.decision-tree.update');

    // Configuraciones
    Route::get('/configuraciones', [AdminConfigurationController::class, 'edit'])->name('dashboard.configurations.edit');
    Route::put('/configuraciones', [AdminConfigurationController::class, 'update'])->name('dashboard.configurations.update');

    // Correos de bienvenida (lista manual)
    Route::get('/correos-bienvenida', [AdminWelcomeBroadcastController::class, 'create'])->name('dashboard.welcome-broadcast.create');
    Route::post('/correos-bienvenida', [AdminWelcomeBroadcastController::class, 'store'])->name('dashboard.welcome-broadcast.store');
});
