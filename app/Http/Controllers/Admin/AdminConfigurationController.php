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
        $config = Configuration::firstOrCreate(
            [],
            [
                'notification_email' => '',
                'application_url' => '',
            ]
        );

        $viewData = [];
        $viewData['configuration'] = $config->only($config->getFillable());

        return Inertia::render('admin/configurations/edit', compact('viewData'));
    }

    public function update(AdminConfigurationUpdateRequest $request): RedirectResponse
    {
        $config = Configuration::firstOrCreate(
            [],
            [
                'notification_email' => '',
                'application_url' => '',
            ]
        );

        $config->update($request->validated());

        return redirect()->route('dashboard.configurations.edit')->with('success', 'Configuración actualizada exitosamente.');
    }
}
