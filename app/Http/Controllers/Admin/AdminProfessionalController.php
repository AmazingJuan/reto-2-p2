<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\AdminProfessionalRequest;
use App\Models\GestionLine;
use App\Models\Professional;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response as InertiaResponse;

class AdminProfessionalController extends Controller
{
    public function index(Request $request): InertiaResponse
    {
        $search = $request->string('search')->trim()->toString();

        $professionals = Professional::query()
            ->with('gestionLines:id,name')
            ->search($search, ['name', 'summary'])
            ->orderBy('name')
            ->paginate(self::PER_PAGE)
            ->withQueryString();

        return Inertia::render('admin/professionals/index', [
            'viewData' => [
                'professionals' => $professionals,
                'filters' => ['search' => $search],
            ],
        ]);
    }

    public function create(): InertiaResponse
    {
        return Inertia::render('admin/professionals/create', [
            'gestionLines' => $this->gestionLineOptions(),
        ]);
    }

    public function store(AdminProfessionalRequest $request): RedirectResponse
    {
        DB::transaction(function () use ($request) {
            $professional = Professional::create($request->safe()->except('gestion_line_ids'));
            $professional->gestionLines()->sync($request->validated('gestion_line_ids'));
        });

        return to_route('dashboard.professionals.index')->with('success', 'Profesional creado correctamente.');
    }

    public function show(Professional $professional): InertiaResponse
    {
        return Inertia::render('admin/professionals/show', [
            'viewData' => [
                'professional' => $professional->load('gestionLines:id,name'),
            ],
        ]);
    }

    public function edit(Professional $professional): InertiaResponse
    {
        return Inertia::render('admin/professionals/edit', [
            'viewData' => [
                'professional' => $professional->load('gestionLines:id'),
            ],
            'gestionLines' => $this->gestionLineOptions(),
        ]);
    }

    public function update(AdminProfessionalRequest $request, Professional $professional): RedirectResponse
    {
        DB::transaction(function () use ($request, $professional) {
            $professional->update($request->safe()->except('gestion_line_ids'));
            $professional->gestionLines()->sync($request->validated('gestion_line_ids'));
        });

        return to_route('dashboard.professionals.index')->with('success', 'Profesional actualizado correctamente.');
    }

    public function destroy(Professional $professional): RedirectResponse
    {
        $professional->delete();

        return to_route('dashboard.professionals.index')->with('success', 'Profesional eliminado.');
    }

    private function gestionLineOptions()
    {
        return GestionLine::query()->orderBy('name')->get(['id', 'name']);
    }
}
