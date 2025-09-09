<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class QuotationController extends Controller
{
    public function index()
    {
        // Retorna la vista de cotización
        return Inertia::render('quotation');
    }
}
