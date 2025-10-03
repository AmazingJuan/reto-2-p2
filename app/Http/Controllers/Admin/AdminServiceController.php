<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use App\Models\Service;
use App\Models\ServiceType;
use App\Models\GestionLine;

use App\Http\Requests\Admin\AdminServiceRequest;

use Illuminate\Http\RedirectResponse;

class AdminServiceController extends Controller
{
    public function index() : Response
    {
        $viewData = [];

        $services = Service::select('id', 'name', 'description')
            ->orderBy('id')
            ->get();
        $viewData['services'] = $services;

        return Inertia::render('admin/services/index', $viewData);
    }

    public function delete(int $id) : RedirectResponse
    {
        Service::destroy($id);

        return redirect()->route('admin.services.index');
    }

    public function create() : Response
    {
        $viewData = [];

        $viewData['serviceTypes'] = ServiceType::all(['id', 'name']);
        $viewData['gestionLines'] = GestionLine::all(['id', 'name']);

        return Inertia::render('admin/services/create', $viewData);
    }

    public function store(AdminServiceRequest $request) : RedirectResponse
    {
        $validatedData = $request->validated();

        Service::create($validatedData);

        return redirect()->route('admin.services.index');
    }

    public function edit(int $id) : Response
    {
        $viewData = [];

        $service = Service::findOrFail($id);
        $viewData['service'] = $service;
        $viewData['serviceTypes'] = ServiceType::all(['id', 'name']);
        $viewData['gestionLines'] = GestionLine::all(['id', 'name']);

        return Inertia::render('admin/services/edit', $viewData);
    }

    public function update(AdminServiceRequest $request, int $id) : RedirectResponse
    {
        $validatedData = $request->validated();

        $service = Service::findOrFail($id);
        $service->update($validatedData);

        return redirect()->route('admin.services.index');
    }

}
