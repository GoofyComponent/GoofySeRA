<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Ressource;
use App\Models\Project;
use Illuminate\Support\Facades\Storage;

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

        if ($request->type == 'image' || $request->type == 'audio' || $request->type == 'document') {
            if ($request->type == 'image') {
                if (!in_array($extension, ['jpeg', 'jpg', 'png', 'webp', 'gif'])) {
                    return response()->json([
                        'message' => 'Le type de fichier ne correspond pas. Seuls les fichiers jpeg, pjg, png, webp et gif sont acceptés'
                    ], 400);
                }
            } else if ($request->type == 'audio') {
                if ($extension != 'mp3') {
                    return response()->json([
                        'message' => 'Le type de fichier ne correspond pas. Seuls les fichiers mp3 sont acceptés'
                    ], 400);
                }
            } else if ($request->type == 'document') {
                if (!in_array($extension, ['pdf', 'docx', 'xlsx', 'pptx'])) {
                    return response()->json([
                        'message' => 'Le type de fichier ne correspond pas. Seuls les fichiers pdf, docx, xlsx et pptx sont acceptés'
                    ], 400);
                }
            }
        } else {
            return response()->json([
                'message' => 'Le type de fichier ne correspond pas. Seuls les fichiers image, audio et document sont acceptés'
            ], 400);
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
            'name' => 'string',
            'description' => 'string',
            'file' => 'file'
        ]);

        $ressource = Ressource::find($ressourceId)->first();

        if (!$ressource) {
            return response()->json([
                'message' => 'La ressource n\'existe pas'
            ], 400);
        }

        if($request->filled('name')){
            $ressource->name = $request->name;
        }

        $name = $ressource->name.'_'.$request->file->getClientOriginalName();
        $name = strtolower(str_replace(' ', '', $name));

        if($request->filled('description')){
            $ressource->description = $request->description;
        }

        if ($request->file) {
            $previousPath = $ressource->url;
            $extension = $request->file->getClientOriginalExtension();

            if ($ressource->type == 'image'){
                if (!in_array($extension, ['jpeg', 'jpg', 'png', 'webp', 'gif'])) {
                    return response()->json([
                        'message' => 'Le type de fichier ne correspond pas. Seuls les fichiers jpeg, pjg, png, webp et gif sont acceptés'
                    ], 400);
                }
            }else if ($ressource->type == 'audio'){
                if ($extension != 'mp3') {
                    return response()->json([
                        'message' => 'Le type de fichier ne correspond pas. Seuls les fichiers mp3 sont acceptés'
                    ], 400);
                }
            }else if ($ressource->type == 'document'){
                if (!in_array($extension, ['pdf', 'docx', 'xlsx', 'pptx'])) {
                    return response()->json([
                        'message' => 'Le type de fichier ne correspond pas. Seuls les fichiers pdf, docx, xlsx et pptx sont acceptés'
                    ], 400);
                }
            }else{
                return response()->json([
                    'message' => 'Le type de fichier ne correspond pas. Seuls les fichiers image, audio et document sont acceptés'
                ], 400);
            }

            Storage::disk('s3')->delete($previousPath);
            $path = $request->file->storeAs(
                'ressource/project_'.$ressource->project_id.'/'.$ressource->type,
                $name,
                's3'
            );
            if (!$path) {
                return response()->json([
                    'message' => 'Erreur lors de l\'upload du fichier'
                ], 400);
            }
            $ressource->url = $path;
        }

        $ressource->save();

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
