<?php

namespace App\Http\Controllers\Portfolio;

use App\Http\Controllers\Controller;
use App\Repositories\GestionLineRepository;
use App\Repositories\ServiceTypeRepository;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PortfolioController extends Controller
{
    protected ServiceTypeRepository $serviceTypeRepo;

    protected GestionLineRepository $gestionLineRepo;

    public function __construct(ServiceTypeRepository $serviceTypeRepository, GestionLineRepository $gestionLineRepository)
    {
        $this->serviceTypeRepo = $serviceTypeRepository;
        $this->gestionLineRepo = $gestionLineRepository;
    }

    public function index(Request $request)
    {

        $serviceTypes = $this->serviceTypeRepo->getColumns(['id', 'name']);
        $gestionLines = $this->gestionLineRepo->getColumns(['id', 'name']);

        $basePath = $request->query('base_path', 'services.index');

        return Inertia::render('portfolio/index', [
            'services' => $serviceTypes,
            'basePath' => $basePath, // "portafolio",
        ]);
    }
}
