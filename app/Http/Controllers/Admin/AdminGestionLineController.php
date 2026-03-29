<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\AdminGestionLineRequest;
use App\Models\GestionLine;
use Exception;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response as InertiaResponse;

class AdminGestionLineController extends Controller
{
    public function index(Request $request): InertiaResponse
    {
        $search = $request->string('search')->trim()->toString();

        $query = GestionLine::query()->select('id', 'name')->orderBy('id');

        if ($search !== '') {
            $like = '%'.$search.'%';
            $query->where(function ($q) use ($like, $search) {
                $q->where('name', 'like', $like);
                if (ctype_digit($search)) {
                    $q->orWhere('id', (int) $search);
                }
            });
        }

        $viewData['gestionLines'] = $query->paginate(15)->withQueryString();
        $viewData['filters'] = [
            'search' => $search,
        ];

        return Inertia::render('admin/gestion-lines/index', compact('viewData'));
    }

    public function delete(int $id): RedirectResponse
    {
        try {
            $gestionLine = GestionLine::findOrFail($id);
        } catch (ModelNotFoundException $e) {
            return redirect()->route('dashboard.lines.index')->with('error', 'Línea de gestión con ID '.$id.' no encontrada.');
        }

        if ($gestionLine->getServices()->isNotEmpty()) {
            return redirect()->route('dashboard.lines.index')->with('error', 'No se puede eliminar la línea de gestión con ID '.$id.' porque tiene servicios asociados.');
        }

        $gestionLine->delete();

        return redirect()->route('dashboard.lines.index')->with('success', 'Línea de gestión eliminada exitosamente.');
    }

    public function create(): InertiaResponse
    {
        return Inertia::render('admin/gestion-lines/create');
    }

    public function store(AdminGestionLineRequest $request): RedirectResponse
    {
        $validatedData = $request->validated();
        try {
            GestionLine::create($validatedData);

            return redirect()->route('dashboard.lines.index')->with('success', 'Línea de gestión creada correctamente.');
        } catch (Exception $e) {
            return redirect()->route('dashboard.lines.index')->with('error', 'Ha ocurrido un error al crear la línea de gestión.');
        }
    }

    public function edit(int $id): InertiaResponse|RedirectResponse
    {
        try {
            $viewData = [];
            $gestionLine = GestionLine::findOrFail($id);
            $viewData['gestionLine'] = $gestionLine;

            return Inertia::render('admin/gestion-lines/edit', $viewData);
        } catch (ModelNotFoundException $e) {
            return redirect()->route('dashboard.lines.index')->with('error', 'Línea de gestión con ID '.$id.' no encontrada.');
        }
    }

    public function update(AdminGestionLineRequest $request, int $id): RedirectResponse
    {
        $validatedData = $request->validated();

        try {
            $gestionLine = GestionLine::findOrFail($id);
            $gestionLine->update($validatedData);

            return redirect()->route('dashboard.lines.index')->with('success', 'Línea de gestión actualizada exitosamente.');
        } catch (ModelNotFoundException $e) {
            return redirect()->route('dashboard.lines.index')->with('error', 'Línea de gestión con ID '.$id.' no encontrada.');
        }
    }
}
