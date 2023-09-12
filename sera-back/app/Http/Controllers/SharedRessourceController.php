<?php

namespace App\Http\Controllers;

use App\Models\Project;
use App\Models\Ressource;
use App\Models\VideoReview;
use Illuminate\Http\Request;
use App\Models\Transcription;
use Illuminate\Support\Facades\Storage;

class SharedRessourceController extends Controller
{

    /**
    * @OA\Get(
    *     path="/api/projects/{projectId}/ressources",
    *     summary="Get all ressources of a project",
    *     tags={"Ressources"},
    *     @OA\Parameter(
    *         name="projectId",
    *         in="path",
    *         description="Id of the project",
    *         required=true,
    *         @OA\Schema(
    *             type="integer",
    *             format="int64"
    *         )
    *     ),
    *     @OA\Response(
    *         response=200,
    *         description="Ressources of the project",
    *         @OA\JsonContent(
    *             @OA\Property(property="id", type="integer", example="1" ),
    *             @OA\Property(property="name", type="string", example="Ressource 1" ),
    *             @OA\Property(property="type", type="string", example="image" ),
    *             @OA\Property(property="description", type="string", example="Description de la ressource 1" ),
    *             @OA\Property(property="url", type="string", example="https://s3.eu-west-3.amazonaws.com/sera-bucket/ressource/project_1/image/ressource1_image.jpg" ),
    *             @OA\Property(property="project_id", type="integer", example="1" ),
    *             @OA\Property(property="created_at", type="string", example="2021-03-30T14:00:00.000000Z" ),
    *             @OA\Property(property="updated_at", type="string", example="2021-03-30T14:00:00.000000Z" ),
    *         )
    *     ),
    *     @OA\Response(
    *         response=400,
    *         description="The project doesn't exist",
    *         @OA\JsonContent(
    *             @OA\Property(property="message", type="string", example="La ressource n'existe pas" ),
    *         )
    *     ),
    * )
    */
    public function index(Request $request, $projectId)
    {
        $validated = $request->validate([
            'filter' => 'string',
        ]);

        $project = Project::find($projectId);

        if (!$project) {
            return response()->json([
                'message' => 'La ressource n\'existe pas'
            ], 400);
        }

        $filter = $request->filter;

        if ($filter === 'video'){
            return response()->json([
                'message' => 'Vous n\'etes pas autorisés à accéder aux vidéos'
            ], 400);
        }

        if ($filter) {
            $ressources = Ressource::where('project_id', $projectId)->where('type', $filter)->get();
        } else {

            $ressources = Ressource::where('project_id', $projectId)->where('type', '!=', 'video')->where('type', '!=', 'transcription')->get();

            $videoReview = VideoReview::where('project_id', $projectId)->where('validated', 1)->first();
            if ($videoReview) {
                $ressource = Ressource::find($videoReview->ressource_id);
                $ressources->prepend($ressource);
            }

            $transcriptions = Transcription::where('project_id', $projectId)->where('is_valid', 1)->get();
            foreach ($transcriptions as $transcription) {
                $ressource = Ressource::find($transcription->ressource_id);
                $ressources->prepend($ressource);
            }

        }

        return response()->json($ressources, 201);
    }

        /**
    * @OA\Post(
    *     path="/api/projects/{projectId}/ressources",
    *     summary="Create a ressource",
    *     tags={"Ressources"},
    *     @OA\Parameter(
    *         name="projectId",
    *         in="path",
    *         description="Id of the project",
    *         required=true,
    *         @OA\Schema(
    *             type="integer",
    *             format="int64"
    *         )
    *     ),
    *     @OA\RequestBody(
    *         description="Ressource object that needs to be added to the project",
    *         required=true,
    *         @OA\JsonContent(
    *             @OA\Property(property="name", type="string", example="Ressource 1" ),
    *             @OA\Property(property="type", type="string", example="image" ),
    *             @OA\Property(property="description", type="string", example="Description de la ressource 1" ),
    *             @OA\Property(property="file", type="file", example="ressource1_image.jpg" ),
    *         ),
    *     ),
    *     @OA\Response(
    *         response=201,
    *         description="Ressource created",
    *         @OA\JsonContent(
    *             @OA\Property(property="id", type="integer", example="1" ),
    *             @OA\Property(property="name", type="string", example="Ressource 1" ),
    *             @OA\Property(property="type", type="string", example="image" ),
    *             @OA\Property(property="description", type="string", example="Description de la ressource 1" ),
    *             @OA\Property(property="url", type="string", example="https://s3.eu-west-3.amazonaws.com/sera-bucket/ressource/project_1/image/ressource1_image.jpg" ),
    *             @OA\Property(property="project_id", type="integer", example="1" ),
    *             @OA\Property(property="created_at", type="string", example="2021-03-30T14:00:00.000000Z" ),
    *             @OA\Property(property="updated_at", type="string", example="2021-03-30T14:00:00.000000Z" ),
    *         )
    *     ),
    *     @OA\Response(
    *         response=400,
    *         description="The project doesn't exist",
    *         @OA\JsonContent(
    *             @OA\Property(property="message", type="string", example="Le projet n'existe pas" ),
    *         )
    *     ),
    * )
    */
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
                if (!in_array($extension, ['pdf', 'docx', 'xlsx', 'pptx', 'txt'])) {
                    return response()->json([
                        'message' => 'Le type de fichier ne correspond pas. Seuls les fichiers pdf, docx, xlsx, pptx et txt sont acceptés'
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

    /**
    * @OA\Get(
    *     path="/api/projects/{projectId}/ressources/{ressourceId}",
    *     summary="Get a ressource",
    *     tags={"Ressources"},
    *     @OA\Parameter(
    *         name="projectId",
    *         in="path",
    *         description="Id of the project",
    *         required=true,
    *         @OA\Schema(
    *             type="integer",
    *             format="int64"
    *         )
    *     ),
    *     @OA\Parameter(
    *         name="ressourceId",
    *         in="path",
    *         description="Id of the ressource",
    *         required=true,
    *         @OA\Schema(
    *             type="integer",
    *             format="int64"
    *         )
    *     ),
    *     @OA\Response(
    *         response=201,
    *         description="Ressource",
    *         @OA\JsonContent(
    *             @OA\Property(property="id", type="integer", example="1" ),
    *             @OA\Property(property="name", type="string", example="Ressource 1" ),
    *             @OA\Property(property="type", type="string", example="image" ),
    *             @OA\Property(property="description", type="string", example="Description de la ressource 1" ),
    *             @OA\Property(property="url", type="string", example="https://s3.eu-west-3.amazonaws.com/sera-bucket/ressource/project_1/image/ressource1_image.jpg" ),
    *             @OA\Property(property="project_id", type="integer", example="1" ),
    *             @OA\Property(property="created_at", type="string", example="2021-03-30T14:00:00.000000Z" ),
    *             @OA\Property(property="updated_at", type="string", example="2021-03-30T14:00:00.000000Z" ),
    *         )
    *     ),
    *     @OA\Response(
    *         response=400,
    *         description="The ressource doesn't exist",
    *         @OA\JsonContent(
    *             @OA\Property(property="message", type="string", example="La ressource n'existe pas" ),
    *         )
    *     ),
    * )
    */
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

    /**
    * @OA\Post(
    *     path="/api/ressources/{ressourceId}/update",
    *     summary="Update a ressource",
    *     tags={"Ressources"},
    *     @OA\Parameter(
    *         name="ressourceId",
    *         in="path",
    *         description="Id of the ressource",
    *         required=true,
    *         @OA\Schema(
    *             type="integer",
    *             format="int64"
    *         )
    *     ),
    *     @OA\RequestBody(
    *         description="Ressource object that needs to be updated",
    *         required=true,
    *         @OA\JsonContent(
    *             @OA\Property(property="name", type="string", example="Ressource 1" ),
    *             @OA\Property(property="description", type="string", example="Description de la ressource 1" ),
    *             @OA\Property(property="file", type="file", example="ressource1_image.jpg" ),
    *         ),
    *     ),
    *     @OA\Response(
    *         response=201,
    *         description="Ressource updated",
    *         @OA\JsonContent(
    *             @OA\Property(property="id", type="integer", example="1" ),
    *             @OA\Property(property="name", type="string", example="Ressource 1" ),
    *             @OA\Property(property="type", type="string", example="image" ),
    *             @OA\Property(property="description", type="string", example="Description de la ressource 1" ),
    *             @OA\Property(property="url", type="string", example="https://s3.eu-west-3.amazonaws.com/sera-bucket/ressource/project_1/image/ressource1_image.jpg" ),
    *             @OA\Property(property="project_id", type="integer", example="1" ),
    *             @OA\Property(property="created_at", type="string", example="2021-03-30T14:00:00.000000Z" ),
    *             @OA\Property(property="updated_at", type="string", example="2021-03-30T14:00:00.000000Z" ),
    *         )
    *     ),
    *     @OA\Response(
    *         response=400,
    *         description="The ressource doesn't exist",
    *         @OA\JsonContent(
    *             @OA\Property(property="message", type="string", example="La ressource n'existe pas" ),
    *         )
    *     ),
    * )
    */
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
                if (!in_array($extension, ['pdf', 'docx', 'xlsx', 'pptx', 'txt'])) {
                    return response()->json([
                        'message' => 'Le type de fichier ne correspond pas. Seuls les fichiers pdf, docx, xlsx, pptx et txt sont acceptés'
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

    /**
    * @OA\Delete(
    *     path="/api/ressources/{ressourceId}/delete",
    *     summary="Delete a ressource",
    *     tags={"Ressources"},
    *     @OA\Parameter(
    *         name="ressourceId",
    *         in="path",
    *         description="Id of the ressource",
    *         required=true,
    *         @OA\Schema(
    *             type="integer",
    *             format="int64"
    *         )
    *     ),
    *     @OA\Response(
    *         response=200,
    *         description="Ressource deleted",
    *         @OA\JsonContent(
    *             @OA\Property(property="message", type="string", example="La ressource a bien été supprimée" ),
    *         )
    *     ),
    *     @OA\Response(
    *         response=400,
    *         description="The ressource doesn't exist",
    *         @OA\JsonContent(
    *             @OA\Property(property="message", type="string", example="La ressource n'existe pas" ),
    *         )
    *     ),
    * )
    */
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

    public function getRessourcesTypes(Request $request, $projectId)
    {
        $project = Project::find($projectId);

        if (!$project) {
            return response()->json([
                'message' => 'Le projet n\'existe pas'
            ], 400);
        }

        $ressources = $project->ressources()->get();

        $ressourcesTypes = $ressources->pluck('type')->unique();
        $ressourcesTypes = $ressourcesTypes->filter(function ($value, $key) {
            return $value != 'video' && $value != 'transcription' && $value != 'subtitle';
        });

        return response()->json([
            $ressourcesTypes
        ], 200);
    }
}
