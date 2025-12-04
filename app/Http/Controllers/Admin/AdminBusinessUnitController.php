<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\BusinessUnit;
use Inertia\Inertia;

class AdminBusinessUnitController extends Controller
{
    public function index()
    {
        $businessUnits = BusinessUnit::all();

        $viewData['businessUnits'] = $businessUnits;

        return Inertia::render('admin/business-units/index', compact('viewData'));
    }

    public function create() {}

    public function store() {}

    public function edit() {}

    public function update() {}
}
