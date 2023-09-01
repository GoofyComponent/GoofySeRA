<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Ressource;
use App\Models\Project;

class SharedRessourceController extends Controller
{

    public function index(Request $request)
    {
        $this->validate($request, [
            'project_id' => 'required|integer'
        ]);

        $project = Project::find($request->project_id);

        if (!$project) {
            throw new \Exception("Le projet n'existe pas");
        }

        $ressources = $project->ressources();

        return response()->json($ressources);

    }

    public function store(Request $request)
    {

    }

    public function show($id)
    {

    }

    public function update(Request $request, $id)
    {

    }

    public function destroy($id): void
    {

    }
}
