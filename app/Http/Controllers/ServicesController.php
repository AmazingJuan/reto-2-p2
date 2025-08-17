<?php

namespace App\Http\Controllers;

use App\Models\Service;
use Inertia\Inertia;

class ServicesController extends Controller
{
    public function index()
    {
        $services = Service::all();

        return Inertia::render('Servicios/Index', ['services' => $services]);
    }
}
