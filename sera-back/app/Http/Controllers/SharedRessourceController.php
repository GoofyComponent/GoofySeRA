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
        // FRONT -> BACK -> BUCKET -> REPONSE au BACK -> REPONSE au FRONT

        $acceptedTypes = ['image','audio', 'document'];

        $this->validate($request, [
            'project_id' => 'required|integer',
            'name' => 'required|string',
            'type' => 'required|string|in:'.implode(',', $acceptedTypes),
            'description' => 'required|string',
            'file' => 'required|file'
        ]);

        $project = Project::find($request->project_id);

        if (!$project) {
            return response()->json([
                'message' => 'Le projet n\'existe pas'
            ], 400);
        }
        $ressource = new Ressource();

        /**
        * Etape 1: stocker dans le modèle ce qu'on a déjà
        * Etape 2: Créer le nom du fichier
        * Etape 3: Stocker le fichier dans le bucket
        * Etape 4: Stocker dans l'URL de notre ressource dans le modèle
        */

        return response()->json($ressource, 201);

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
