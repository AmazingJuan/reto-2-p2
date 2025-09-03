<?php

namespace App\Http\Controllers\Portfolio;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\ServiceType;

class PortfolioController extends Controller
{
    public function index(){
        $serviceTypes = ServiceType::pluck('name', 'id')->toArray();
        return Inertia::render('portfolio/index', [
            'services' => $serviceTypes,
        ]);
    }
}