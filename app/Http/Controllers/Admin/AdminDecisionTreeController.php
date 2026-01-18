<?php
namespace App\Http\Controllers\Admin;


use App\Http\Controllers\Controller;
use App\Models\BusinessUnit;
use App\Helpers\DecisionTreeHelper;
use Illuminate\Http\Request;
use Inertia\Inertia;


class AdminDecisionTreeController extends Controller
{
    public function index()
    {
        $businessUnits = BusinessUnit::select('id', 'name')->get();
        $viewData['businessUnits'] = [];
        foreach ($businessUnits as $businessUnit) {
            $viewData['businessUnits'][] = [$businessUnit->getId() => $businessUnit['display_name']];

            $viewData['decisionTrees'][] = [
                $businessUnit->getId() => DecisionTreeHelper::buildTree($businessUnit)
            ];
        }
        
        return Inertia::render('admin/decision-tree/index', compact('viewData'));
    }

    public function update(Request $request){
        $treesData = $request->all();
        DecisionTreeHelper::updateTrees($treesData);
        return redirect()->route('dashboard')->with('success', 'Los árboles de decisión han sido actualizados exitosamente.');
    }
}