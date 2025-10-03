<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\GestionLine;
use Illuminate\Http\RedirectResponse;
use App\Http\Requests\Admin\AdminGestionLineRequest;
use Inertia\Response;

class AdminGestionLineController extends Controller
{
    public function index() : Response
    {
        $viewData = [];
        $gestionLines = GestionLine::select('id', 'name')->orderBy('id')->get();
        $viewData['gestionLines'] = $gestionLines;

        return Inertia::render('admin/gestion-lines/index', $viewData);
    }

    public function delete(int $id) : RedirectResponse
    {
        GestionLine::destroy($id);

        return redirect()->route('admin.lines.index');
    }

    public function create() : Response
    {
        return Inertia::render('admin/gestion-lines/create');
    }

    public function store(AdminGestionLineRequest $request) : RedirectResponse
    {
        $validatedData = $request->validated();
        GestionLine::create($validatedData);

        return redirect()->route('admin.lines.index');
    }

    public function edit(int $id) : Response
    {
        $viewData = [];
        $gestionLine = GestionLine::findOrFail($id);
        $viewData['gestionLine'] = $gestionLine;

        return Inertia::render('admin/gestion-lines/edit', $viewData);
    }

    public function update(AdminGestionLineRequest $request, int $id) : RedirectResponse
    {
        $validatedData = $request->validated();
        $gestionLine = GestionLine::findOrFail($id);
        $gestionLine->update($validatedData);

        return redirect()->route('admin.lines.index');
    }
}
