<?php

namespace App\Http\Controllers\Portfolio;

use App\Http\Controllers\Controller;
use App\Models\ServiceType;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PortfolioController extends Controller
{
    public function index(Request $request)
    {
        $serviceTypes = ServiceType::pluck('name', 'id')->all();
        $basePath = $request->query('base_path', 'services.index');
        return Inertia::render('portfolio/index', [
            'services' => $serviceTypes,
            'basePath' => $basePath, // "portafolio",
        ]);
    }
}
