<?php

namespace App\Http\Controllers;

use App\Models\Project;
use App\Models\Ressource;
use Illuminate\Http\Request;
use App\Models\Transcription;
use Illuminate\Support\Facades\Storage;

class TranscriptionController extends Controller
{
    /**
    *  @OA\Get(
    *      path="/api/projects/{projectId}/transcriptions",
    *      operationId="getTranscriptionsByProjectId",
    *      tags={"Transcriptions"},
    *      summary="Get transcriptions by project id",
    *      description="Returns transcriptions by project id",
    *      @OA\Parameter(
    *          name="projectId",
    *          description="Project id",
    *          required=true,
    *          in="path",
    *          @OA\Schema(
    *              type="integer"
    *          )
    *      ),
    *      @OA\Parameter(
    *          name="version",
    *          description="Transcription version",
    *          required=false,
    *          in="query",
    *          @OA\Schema(
    *              type="integer"
    *          )
    *      ),
    *      @OA\Response(
    *          response=200,
    *          description="successful operation",
    *          @OA\JsonContent(
    *              @OA\Property(
    *                  property="data",
    *                  type="array",
    *                  @OA\Items(
    *                      @OA\Property(
    *                          property="id",
    *                          type="integer"
    *                      ),
    *                      @OA\Property(
    *                          property="ressource_id",
    *                          type="integer"
    *                      ),
    *                      @OA\Property(
    *                          property="project_id",
    *                          type="integer"
    *                      ),
    *                      @OA\Property(
    *                          property="version",
    *                          type="integer"
    *                      ),
    *                      @OA\Property(
    *                          property="created_at",
    *                          type="string"
    *                      ),
    *                      @OA\Property(
    *                          property="updated_at",
    *                          type="string"
    *                      )
    *                  )
    *              )
    *          )
    *      ),
    *      @OA\Response(
    *          response=404,
    *          description="Project not found"
    *      ),
    *      @OA\Response(
    *          response=400,
    *          description="Bad request"
    *      )
    *  )
    */
    public function index(Request $request,$projectId)
    {
        $request->validate([
            'version' => 'integer'
        ]);

        $project = Project::find($projectId);

        if (!$project) {
            return response()->json([
                'message' => 'Project not found'
            ], 404);
        }

        if ($request->has('version')) {
            $transcriptions = $project->transcriptions()->where('version', $request->version)->get();
        } else {
            $transcriptions = $project->transcriptions()->get();
        }

        return response()->json([
            'data' => $transcriptions
        ], 200);
    }

    /**
    *  @OA\Post(
    *      path="/api/projects/{projectId}/transcriptions",
    *      operationId="storeTranscription",
    *      tags={"Transcriptions"},
    *      summary="Store a transcription",
    *      description="Store a transcription",
    *      @OA\Parameter(
    *          name="projectId",
    *          description="Project id",
    *          required=true,
    *          in="path",
    *          @OA\Schema(
    *              type="integer"
    *          )
    *      ),
    *      @OA\RequestBody(
    *          required=true,
    *          @OA\MediaType(
    *              mediaType="multipart/form-data",
    *              @OA\Schema(
    *                  @OA\Property(
    *                      property="file",
    *                      description="File",
    *                      type="file",
    *                      format="file"
    *                  )
    *              )
    *          )
    *      ),
    *      @OA\Response(
    *          response=201,
    *          description="successful operation",
    *          @OA\JsonContent(
    *              @OA\Property(
    *                  property="data",
    *                  type="object",
    *                  @OA\Property(
    *                      property="id",
    *                      type="integer"
    *                  ),
    *                  @OA\Property(
    *                      property="ressource_id",
    *                      type="integer"
    *                  ),
    *                  @OA\Property(
    *                      property="project_id",
    *                      type="integer"
    *                  ),
    *                  @OA\Property(
    *                      property="version",
    *                      type="integer"
    *                  ),
    *                  @OA\Property(
    *                      property="created_at",
    *                      type="string"
    *                  ),
    *                  @OA\Property(
    *                      property="updated_at",
    *                      type="string"
    *                  )
    *              )
    *          )
    *      ),
    *      @OA\Response(
    *          response=404,
    *          description="Project not found"
    *      ),
    *      @OA\Response(
    *          response=400,
    *          description="Bad request"
    *      )
    *  )
    */
    public function store(Request $request, $projectId){

        $request->validate([
            'file' => 'required|file',
        ]);

        // le file doit être de type srt
        if ($request->file('file')->getClientOriginalExtension() != 'srt') {
            return response()->json([
                'message' => 'The file must be a srt file. The extension is ' . $request->file('file')->getClientOriginalExtension()
            ], 400);
        }

        $project = Project::find($projectId);

        if (!$project) {
            return response()->json([
                'message' => 'Project not found'
            ], 404);
        }

        // on cherche la dernière version de la transcription. Si elle n'existe pas, on crée la version 1
        $lastVersion = $project->transcriptions()->max('version');

        if (!$lastVersion) {
            $lastVersion = 0;
        }

        $transcriptionName = 'transcription_' . $projectId . '_version_' . ($lastVersion + 1) . '.srt';
        // on stocke le fichier dans le s3
        $path = $request->file('file')->storeAs(
            'ressources/' . $projectId . '/transcriptions',
            $transcriptionName,
            's3'
        );

        if (!$path) {
            return response()->json([
                'message' => 'Error while storing the file'
            ], 500);
        }

        $ressource = new Ressource();
        $ressource->name = $transcriptionName;
        $ressource->type = 'transcription';
        $ressource->url = $path;
        $ressource->project_id = $projectId;
        $ressource->save();

        $transcription = $project->transcriptions()->create([
            'version' => $lastVersion + 1,
            'ressource_id' => $ressource->id,
            'project_id' => $projectId
        ]);

        return response()->json([
            'data' => $transcription
        ], 201);
    }

    /**
    * @OA\Delete(
    *      path="/api/projects/{projectId}/transcriptions",
    *      operationId="deleteTranscription",
    *      tags={"Transcriptions"},
    *      summary="Delete a transcription",
    *      description="Delete a transcription",
    *      @OA\Parameter(
    *          name="projectId",
    *          description="Project id",
    *          required=true,
    *          in="path",
    *          @OA\Schema(
    *              type="integer"
    *          )
    *      ),
    *      @OA\Parameter(
    *          name="version",
    *          description="Transcription version",
    *          required=true,
    *          in="query",
    *          @OA\Schema(
    *              type="integer"
    *          )
    *      ),
    *      @OA\Response(
    *          response=200,
    *          description="successful operation",
    *          @OA\JsonContent(
    *              @OA\Property(
    *                  property="message",
    *                  type="string"
    *              )
    *          )
    *      ),
    *      @OA\Response(
    *          response=404,
    *          description="Project not found"
    *      ),
    *      @OA\Response(
    *          response=400,
    *          description="Bad request"
    *      )
    *  )
    */
    public function destroy(Request $request, $projectId){

        $request->validate([
            'version' => 'required|integer'
        ]);

        $project = Project::find($projectId);
        if (!$project) {
            return response()->json([
                'message' => 'Project not found'
            ], 404);
        }

        $transcription = $project->transcriptions()->where('version', $request->version)->first();


        // $transcription->ressource_id is not set, return error
        if (!$transcription) {
            return response()->json([
                'message' => 'Transcription not found.'
            ], 404);
        }

        $ressource = Ressource::find($transcription->ressource_id);

        Storage::disk('s3')->delete($ressource->url);

        $ressource->delete();

        $transcription->delete();

        return response()->json([
            'message' => 'Transcription deleted'
        ], 200);
    }
}
