<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\AdminServiceRequest;
use App\Models\BusinessUnit;
use App\Models\GestionLine;
use App\Models\Service;
use Exception;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response as InertiaResponse;

class AdminServiceController extends Controller
{
    public function index(Request $request): InertiaResponse
    {
        $search = $request->string('search')->trim()->toString();
        $businessUnitId = $request->input('business_unit_id');

        $query = Service::query()
            ->select('id', 'name', 'business_unit_id', 'gestion_line_id')
            ->with([
                'businessUnit:id,display_name',
                'gestionLine:id,name',
            ])
            ->orderBy('id');

        if ($businessUnitId !== null && $businessUnitId !== '' && $businessUnitId !== 'all') {
            $query->where('business_unit_id', $businessUnitId);
        }

        if ($search !== '') {
            $query->where('name', 'like', '%'.$search.'%');
        }

        $viewData['services'] = $query->paginate(15)->withQueryString();
        $viewData['businessUnits'] = BusinessUnit::all(['id', 'display_name']);
        $viewData['filters'] = [
            'search' => $search,
            'business_unit_id' => ($businessUnitId !== null && $businessUnitId !== '' && $businessUnitId !== 'all')
                ? (string) $businessUnitId
                : '',
        ];

        return Inertia::render('admin/services/index', compact('viewData'));
    }

    public function delete(int $id): RedirectResponse
    {
        try {
            $service = Service::findOrFail($id);
            $service->delete();

            return redirect()->route('dashboard.services.index')->with('success', 'Servicio eliminado exitosamente.');
        } catch (ModelNotFoundException $e) {
            return redirect()->route('dashboard.services.index')->with('error', 'Servicio con ID '.$id.' no encontrado.');
        }
    }

    public function create(): InertiaResponse|RedirectResponse
    {
        $businessUnits = BusinessUnit::all(['id', 'display_name']);
        if ($businessUnits->isEmpty()) {
            return redirect()->route('dashboard.services.index')->with('error', 'No existen unidades de negocio con las cuales usted pueda asociar un nuevo servicio.');
        }

        $gestionLines = GestionLine::all(['id', 'name']);
        if ($gestionLines->isEmpty()) {
            return redirect()->route('dashboard.services.index')->with('error', 'No existen lineas de gestion con las cuales usted pueda asociar un nuevo servicio.');
        }

        $viewData['businessUnits'] = $businessUnits;
        $viewData['gestionLines'] = $gestionLines;

        return Inertia::render('admin/services/create', $viewData);
    }

    public function store(AdminServiceRequest $request): RedirectResponse
    {
        $validatedData = $request->validated();

        try {
            Service::create($validatedData);

            return redirect()->route('dashboard.services.index')->with('success', 'Servicio creado correctamente.');
        } catch (Exception $e) {
            return redirect()->route('dashboard.services.index')->with('error', 'Ha ocurrido un error al crear el servicio.');
        }
    }

    public function edit(int $id): InertiaResponse|RedirectResponse
    {
        try {
            $service = Service::findOrFail($id);
        } catch (ModelNotFoundException $e) {
            return redirect()->route('dashboard.services.index')->with('error', 'Servicio con ID '.$id.' no encontrado.');
        }

        $businessUnits = BusinessUnit::all(['id', 'display_name']);
        if ($businessUnits->isEmpty()) {
            return redirect()->route('dashboard.services.index')->with('error', 'No existen unidades de negocio con las cuales usted pueda asociar un nuevo servicio.');
        }

        $gestionLines = GestionLine::all(['id', 'name']);
        if ($gestionLines->isEmpty()) {
            return redirect()->route('dashboard.services.index')->with('error', 'No existen lineas de gestion con las cuales usted pueda asociar un nuevo servicio.');
        }

        $viewData['service'] = $service;
        $viewData['businessUnits'] = $businessUnits;
        $viewData['gestionLines'] = $gestionLines;

        return Inertia::render('admin/services/edit', $viewData);
    }

    public function update(AdminServiceRequest $request, int $id): RedirectResponse
    {
        $validatedData = $request->validated();

        try {
            $service = Service::findOrFail($id);
            $service->update($validatedData);

            return redirect()->route('dashboard.services.index')->with('success', 'Servicio actualizado exitosamente.');
        } catch (ModelNotFoundException $e) {
            return redirect()->route('dashboard.services.index')->with('error', 'Servicio con ID '.$id.' no encontrado.');
        }
    }
}
