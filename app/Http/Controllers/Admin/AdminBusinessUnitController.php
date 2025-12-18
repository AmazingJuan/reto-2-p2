<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\AdminBusinessUnitRequest;
use App\Models\BusinessUnit;
use Exception;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response as InertiaResponse;

class AdminBusinessUnitController extends Controller
{
    public function index(): InertiaResponse
    {
        $businessUnits = BusinessUnit::select('id', 'name')->orderBy('id')->get();

        $viewData['businessUnits'] = $businessUnits;

        return Inertia::render('admin/business-units/index', compact('viewData'));
    }

    public function show(int $businessUnitId): InertiaResponse|RedirectResponse
    {
        $businessUnit = BusinessUnit::where('id', $businessUnitId)->select('id', 'name')->first();

        if (! $businessUnit) {
            return redirect()->route('dashboard.business-unit.index')->with('error', 'Unidad de negocio con ID: '.$businessUnitId.' no encontrada.');
        }

        $associatedServices = $businessUnit->getServices();

        $viewData['businessUnit'] = $businessUnit;
        $viewData['services'] = $associatedServices;

        return Inertia::render('admin/business-units/show', compact('viewData'));
    }

    public function create(): InertiaResponse
    {
        return Inertia::render('admin/business-units/create');
    }

    public function store(AdminBusinessUnitRequest $request): RedirectResponse
    {
        $validatedData = $request->validated();
        try {
            if ($request->get('needs_error') == 'true') {
                throw new Exception('Error de prueba en la creación de unidad de negocio.');
            }

            BusinessUnit::create($validatedData);
            $successMessage = 'La unidad de negocio: '.$validatedData['name'].', ha sido creada exitosamente.';

            return redirect()->route('dashboard.business-unit.index')->with('success', $successMessage);
        } catch (Exception $e) {
            return redirect()->route('dashboard.business-unit.index')->with('error', 'Ha ocurrido un error al crear la unidad de negocio.');
        }
    }

    public function edit(int $businessUnitId): InertiaResponse|RedirectResponse
    {
        $businessUnit = BusinessUnit::where('id', $businessUnitId)->select('id', 'name')->first();

        if (! $businessUnit) {
            return redirect()->route('dashboard.business-unit.index')->with('error', 'Unidad de negocio con ID: '.$businessUnitId.' no encontrada.');
        }

        $viewData['businessUnit'] = $businessUnit;

        return Inertia::render('admin/business-units/edit', compact('viewData'));
    }

    public function update(AdminBusinessUnitRequest $request, int $businessUnitId): RedirectResponse
    {
        $businessUnit = BusinessUnit::where('id', $businessUnitId)->select('id', 'name')->first();

        if (! $businessUnit) {
            return redirect()->route('dashboard.business-unit.index')->with('error', 'Unidad de negocio con ID: '.$businessUnitId.' no encontrada.');
        }

        $validatedData = $request->validated();

        try {
            if ($request->get('needs_error') == 'true') {
                throw new Exception('Error de prueba en la creación de unidad de negocio.');
            }
            $businessUnit->update($validatedData);
            $successMessage = 'La unidad de negocio: '.$validatedData['name'].', ha sido actualizada exitosamente.';

            return redirect()->route('dashboard.business-unit.index')->with('success', $successMessage);
        } catch (Exception $e) {
            return redirect()->route('dashboard.business-unit.index')->with('error', 'Ha ocurrido un error al actualizar la unidad de negocio.');
        }
    }

    public function delete(int $businessUnitId): RedirectResponse
    {
        $businessUnit = BusinessUnit::where('id', $businessUnitId)->first();

        if (! $businessUnit) {
            return redirect()->route('dashboard.business-unit.index')->with('error', 'Unidad de negocio con ID: '.$businessUnitId.' no encontrada.');
        }

        $associatedServices = $businessUnit->getServices();
        if (count($associatedServices) > 0) {
            return redirect()->route('dashboard.business-unit.index')->with('error', 'No se puede eliminar la unidad de negocio: '.$businessUnit->name.' porque tiene servicios asociados.');
        }

        try {
        
            $businessUnit->delete();
            $successMessage = 'La unidad de negocio: '.$businessUnit->name.', ha sido eliminada exitosamente.';

            return redirect()->route('dashboard.business-unit.index')->with('success', $successMessage);
        } catch (Exception $e) {
            return redirect()->route('dashboard.business-unit.index')->with('error', 'Ha ocurrido un error al eliminar la unidad de negocio.');
        }
    }
}
