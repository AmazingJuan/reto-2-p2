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
        $businessUnits = BusinessUnit::select('id', 'display_name', 'initial_condition_id')->get();
        $viewData['businessUnits'] = [];
        foreach ($businessUnits as $businessUnit) {
            $viewData['businessUnits'][] = [$businessUnit->getId() => $businessUnit['display_name']];

            $viewData['decisionTrees'][] = [
                $businessUnit->getId() => [
                    'conditions' => DecisionTreeHelper::buildTree($businessUnit),
                    'initial_condition_id' => $businessUnit->getInitialCondition()?->getId() ?? null,
                ]
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