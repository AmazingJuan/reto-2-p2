<?php

namespace App\Http\Controllers\Portfolio;

use App\Http\Controllers\Controller;
use App\Models\ServiceType;
use Inertia\Inertia;

class PortfolioController extends Controller
{
    public function index()
    {
        $serviceTypes = ServiceType::pluck('name', 'id')->toArray();

        return Inertia::render('portfolio/index', [
            'services' => $serviceTypes,
        ]);
    }
}
