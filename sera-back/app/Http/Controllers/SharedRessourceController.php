<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Ressource;
use App\Models\Project;

class SharedRessourceController extends Controller
{

    public function index($projectId)
    {

        $project = Project::find($projectId);

        if (!$project) {
            return response()->json([
                'message' => 'La ressource n\'existe pas'
            ], 400);
        }

        $ressources = $project->ressources();

        return response()->json($ressources);

    }

    public function store(Request $request,$projectId)
    {
        $acceptedTypes = ['image','audio', 'document'];

        $this->validate($request, [
            'name' => 'required|string',
            'type' => 'required|string|in:'.implode(',', $acceptedTypes),
            'description' => 'required|string',
            'file' => 'required|file'
        ]);

        $project = Project::find($projectId);

        if (!$project) {
            return response()->json([
                'message' => 'Le projet n\'existe pas'
            ], 400);
        }
        
        $ressource = new Ressource();
        $ressource->name = $request->name;
        $ressource->type = $request->type;
        $ressource->description = $request->description;
        $ressource->project_id = $projectId;


        $name = $request->name.'_'.$request->file->getClientOriginalName();
        $name = strtolower(str_replace(' ', '', $name));

        $extension = $request->file->getClientOriginalExtension();
        echo $extension;

        if ($extension == 'jpeg' || $extension == 'png' || $extension == 'webp' || $extension == 'gif') {
            if ($request->type != 'image') {
                return response()->json([
                    'message' => 'Le type de fichier ne correspond pas'
                ], 400);
            }
        } else if ($extension == 'mp3') {
            if ($request->type != 'audio') {
                return response()->json([
                    'message' => 'Le type de fichier ne correspond pas'
                ], 400);
            }
        } else if ($extension == 'pdf' || $extension == 'docx' || $extension == 'xlsx' || $extension == 'pptx') {
            if ($request->type != 'document') {
                return response()->json([
                    'message' => 'Le type de fichier ne correspond pas'
                ], 400);
            }
        }

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

    public function show($ressourceId)
    {
        $ressources = Ressource::find($ressourceId);

        if (!$ressources) {
            return response()->json([
                'message' => 'La ressource n\'existe pas'
            ], 400);
        }

        return response()->json($ressources, 201);
    }

    public function update(Request $request, $ressourceId)
    {
        $validatedData = $request->validate([
            'name' => 'required|string',
            'description' => 'required|string',
        ]);

        $ressource = Ressource::find($ressourceId);

        if (!$ressource) {
            return response()->json([
                'message' => 'La ressource n\'existe pas'
            ], 400);
        }

        $ressource->update($validatedData);

        return response()->json($ressource, 201);
    }

    public function destroy($ressourceId)
    {
        $ressource = Ressource::find($ressourceId);

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
