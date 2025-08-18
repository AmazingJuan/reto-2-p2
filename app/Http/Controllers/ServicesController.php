<?php

namespace App\Http\Controllers;

use App\Models\Service;
use Inertia\Inertia;

class ServicesController extends Controller
{
    public function index()
    {
        /*$servicesType = ['Consultoría', 'Auditoría', 'Formación'];

        return Inertia::render('services/index', ['servicesType' => $servicesType]);*/

        return Inertia::render('services/index', [
            'services' => [
                ['name' => 'Auditoría', 'slug' => 'auditoria'],
                ['name' => 'Consultoría', 'slug' => 'consultoria'],
                ['name' => 'Formación', 'slug' => 'formacion'],
            ],
        ]);
    }

    public function show($type)
    {
        $services = Service::all();

        return Inertia::render('services/show', ['services' => $services]);
    }
}
