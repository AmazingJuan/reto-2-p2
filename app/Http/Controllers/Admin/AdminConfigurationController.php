<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\AdminConfigurationUpdateRequest;
use App\Models\Configuration;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response as InertiaResponse;

class AdminConfigurationController extends Controller
{
    public function edit(): InertiaResponse
    {
        $config = Configuration::query()->first();
        abort_if($config === null, 500, 'No existe el registro de configuración. Ejecute las migraciones (php artisan migrate).');

        $viewData = [];
        $viewData['configuration'] = $config->only($config->getFillable());

        return Inertia::render('admin/configurations/edit', compact('viewData'));
    }

    public function update(AdminConfigurationUpdateRequest $request): RedirectResponse
    {
        $config = Configuration::query()->first();
        abort_if($config === null, 500, 'No existe el registro de configuración. Ejecute las migraciones (php artisan migrate).');

        $config->update($request->validated());

        return redirect()->route('dashboard.configurations.edit')->with('success', 'Configuración actualizada exitosamente.');
    }
}
