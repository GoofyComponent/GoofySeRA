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

        $ressource->name = $request->name;
        $ressource->type = $request->type;
        $ressource->description = $request->description;
        $ressource->project_id = $request->project_id;


        $name = $request->name.'_'.$request->file->getClientOriginalName();

        $name = strtolower(str_replace(' ', '', $name));

        $path = $request->file->storeAs(
            'ressource/project_'.$project->id.'/'.$request->type,
            $name,
            's3'
        );

        if (!$path) {
            return response()->json([
                'message' => 'Erreur lors de l\'upload du fichier'
            ], 400);
        }

        $ressource->url = $path;
        $ressource->save();

        return response()->json($ressource, 201);

    }

    public function show($id)
    {
        $ressources = Ressource::find($id);

        if (!$ressources) {
            return response()->json([
                'message' => 'La ressource n\'existe pas'
            ], 400);
        }

        return response()->json($ressources, 201);
    }

    public function update(Request $request, $id)
    {
        $validatedData = $request->validate([
            'name' => 'required|string',
            'description' => 'required|string',
        ]);

        $ressource = Ressource::find($id);

        if (!$ressource) {
            return response()->json([
                'message' => 'La ressource n\'existe pas'
            ], 400);
        }

        $ressource->update($validatedData);

        return response()->json($ressource, 201);
    }

    public function destroy($id)
    {
        $ressource = Ressource::find($id);

        if (!$ressource) {
            return response()->json([
                'message' => 'La ressource n\'existe pas'
            ], 400);
        }

        $ressource->delete();

        return response()->json([
            'message' => 'La ressource a bien été supprimée'
        ], 200);
    }
}
