<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\AdminProfessionalRequest;
use App\Models\GestionLine;
use App\Models\Professional;
use Exception;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response as InertiaResponse;

class AdminProfessionalController extends Controller
{
    public function index(Request $request): InertiaResponse
    {
        $search = $request->string('search')->trim()->toString();

        $query = Professional::query()
            ->with('gestionLines:id,name')
            ->orderBy('name');

        if ($search !== '') {
            $like = '%'.$search.'%';
            $query->where(function ($q) use ($like, $search) {
                $q->where('name', 'like', $like)
                    ->orWhere('summary', 'like', $like);
                if (ctype_digit($search)) {
                    $q->orWhere('id', (int) $search);
                }
            });
        }

        $viewData = [
            'professionals' => $query->paginate(15)->withQueryString(),
            'filters' => [
                'search' => $search,
            ],
        ];

        return Inertia::render('admin/professionals/index', compact('viewData'));
    }

    public function create(): InertiaResponse
    {
        return Inertia::render('admin/professionals/create', [
            'gestionLines' => GestionLine::query()->orderBy('name')->get(['id', 'name']),
        ]);
    }

    public function store(AdminProfessionalRequest $request): RedirectResponse
    {
        try {
            $validated = $request->validated();
            $lineIds = $validated['gestion_line_ids'];
            unset($validated['gestion_line_ids']);

            $professional = Professional::create($validated);
            $professional->gestionLines()->sync($lineIds);

            return redirect()->route('dashboard.professionals.index')->with('success', 'Profesional creado correctamente.');
        } catch (Exception $e) {
            return redirect()->route('dashboard.professionals.index')->with('error', 'No se pudo crear el profesional.');
        }
    }

    public function show(int $id): InertiaResponse|RedirectResponse
    {
        try {
            $professional = Professional::query()->with('gestionLines:id,name')->findOrFail($id);
        } catch (ModelNotFoundException $e) {
            return redirect()->route('dashboard.professionals.index')->with('error', 'Profesional no encontrado.');
        }

        return Inertia::render('admin/professionals/show', [
            'viewData' => [
                'professional' => $professional,
            ],
        ]);
    }

    public function edit(int $id): InertiaResponse|RedirectResponse
    {
        try {
            $professional = Professional::query()->with('gestionLines:id')->findOrFail($id);
        } catch (ModelNotFoundException $e) {
            return redirect()->route('dashboard.professionals.index')->with('error', 'Profesional no encontrado.');
        }

        return Inertia::render('admin/professionals/edit', [
            'viewData' => [
                'professional' => $professional,
            ],
            'gestionLines' => GestionLine::query()->orderBy('name')->get(['id', 'name']),
        ]);
    }

    public function update(AdminProfessionalRequest $request, int $id): RedirectResponse
    {
        try {
            $professional = Professional::findOrFail($id);
        } catch (ModelNotFoundException $e) {
            return redirect()->route('dashboard.professionals.index')->with('error', 'Profesional no encontrado.');
        }

        try {
            $validated = $request->validated();
            $lineIds = $validated['gestion_line_ids'];
            unset($validated['gestion_line_ids']);

            $professional->update($validated);
            $professional->gestionLines()->sync($lineIds);

            return redirect()->route('dashboard.professionals.index')->with('success', 'Profesional actualizado correctamente.');
        } catch (Exception $e) {
            return redirect()->route('dashboard.professionals.edit', $id)->with('error', 'No se pudo actualizar el profesional.');
        }
    }

    public function destroy(int $id): RedirectResponse
    {
        try {
            $professional = Professional::findOrFail($id);
            $professional->delete();

            return redirect()->route('dashboard.professionals.index')->with('success', 'Profesional eliminado.');
        } catch (ModelNotFoundException $e) {
            return redirect()->route('dashboard.professionals.index')->with('error', 'Profesional no encontrado.');
        }
    }
}
