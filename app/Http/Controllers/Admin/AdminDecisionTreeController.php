<?php
namespace App\Http\Controllers\Admin;


use App\Http\Controllers\Controller;
use Inertia\Inertia;


class AdminDecisionTreeController extends Controller
{
    public function index()
    {
        return Inertia::render('admin/decision-tree/index');
    }
}