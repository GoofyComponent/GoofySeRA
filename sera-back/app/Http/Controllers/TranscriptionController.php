<?php

namespace App\Http\Controllers;

use App\Models\Project;
use App\Models\Ressource;
use Illuminate\Http\Request;
use App\Models\Transcription;
use Illuminate\Support\Facades\Storage;
use \Done\Subtitles\Subtitles;


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
    *      @OA\Parameter(
    *          name="file_type",
    *          description="Transcription file type",
    *          required=false,
    *          in="query",
    *          @OA\Schema(
    *              type="string",
    *              enum={"srt", "vtt"}
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
            'version' => 'integer',
            'file_type' => 'string|in:srt,vtt',
            'final' => 'boolean'
        ]);

        $project = Project::find($projectId);

        if (!$project) {
            return response()->json([
                'message' => 'Project not found'
            ], 404);
        }

        $transcriptions = $project->transcriptions()->with('ressource');

        if ($request->has('final') && $request->final == true) {
            $transcriptions = $transcriptions->where('is_valid', true);

            return response()->json([
                'data' => $transcriptions->get()
            ], 200);
        }

        if ($request->has('version')) {
            $transcriptions = $transcriptions->where('version', $request->version);
        }

        if ($request->has('file_type')) {
            $transcriptions = $transcriptions->where('file_type', $request->file_type);
        }

        //for each transcription, load the ressource
        $transcriptions = $transcriptions->with('ressource')->get();

        $tranformTranscriptions = [];
        // should be tried by version
        // 1 => $trans1
        // 2 => $trans2
        // ect

        foreach ($transcriptions as $transcription) {
            $tranformTranscriptions[$transcription->version][$transcription->file_type] = $transcription;
        }

        return response()->json([
            'data' => $tranformTranscriptions
        ], 200);
    }

    /**
    * @OA\Post(
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
    *                      property="srt",
    *                      description="Srt file",
    *                      type="file",
    *                      format="file"
    *                  ),
    *                  @OA\Property(
    *                      property="vtt",
    *                      description="Vtt file",
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
    public function store(Request $request, $projectId){

        $request->validate([
            'srt' => 'file',
            'vtt' => 'file'
        ]);

        if (!$request->has('srt') && !$request->has('vtt')) {
            return response()->json([
                'message' => 'You must provide a srt or vtt file'
            ], 400);
        }

        $project = Project::find($projectId);

        if (!$project) {
            return response()->json([
                'message' => 'Project not found'
            ], 404);
        }

        $lastVersion = $project->transcriptions()->max('version');

        if (!$lastVersion) {
            $lastVersion = 0;
        }
        // si le fichier est un fichier srt
        if($request->file('srt')){
            if ($request->file('srt')->getClientOriginalExtension() != 'srt') {
                return response()->json([
                    'message' => 'The file must be a srt file. The extension is ' . $request->file('srt')->getClientOriginalExtension()
                ], 400);
            }

            $transcriptionName = 'transcription_' . $projectId . '_version_' . ($lastVersion + 1) . '.srt';

            $path = $request->file('srt')->storeAs(
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


            $transcriptionSRT = $project->transcriptions()->create([
                'version' => $lastVersion + 1,
                'ressource_id' => $ressource->id,
                'project_id' => $projectId,
                'file_type' => 'srt'
            ]);

        }


        // si le fichier est un fichier vtt
        if($request->file('vtt')){

            if ($request->file('vtt')->getClientOriginalExtension() != 'vtt') {
                return response()->json([
                    'message' => 'The file must be a vtt file. The extension is ' . $request->file('vtt')->getClientOriginalExtension()
                ], 400);
            }

            $transcriptionName = 'transcription_' . $projectId . '_version_' . ($lastVersion + 1) . '.vtt';

            $path = $request->file('vtt')->storeAs(
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


            $transcriptionVTT = $project->transcriptions()->create([
                'version' => $lastVersion + 1,
                'ressource_id' => $ressource->id,
                'project_id' => $projectId,
                'file_type' => 'vtt'
            ]);

        }


        // en fonction de transcriptionsSRT ou transcriptionsVTT, on va créer un fichier vtt ou srt
        if (isset($transcriptionSRT) && !isset($transcriptionVTT)) {
            $srt = Subtitles::loadFromFile($request->file('srt')->getRealPath(), 'srt');
            $vtt = $srt->content('vtt');

            $transcriptionName = 'transcription_' . $projectId . '_version_' . ($lastVersion + 1) . '.vtt';
            $isUpload = Storage::disk('s3')->put('ressources/' . $projectId . '/transcriptions/' . $transcriptionName, $vtt);

            if (!$isUpload) {
                return response()->json([
                    'message' => 'Error while storing the file'
                ], 500);
            }
            $newRessource = new Ressource();
            $newRessource->name = $transcriptionName;
            $newRessource->type = 'transcription';
            $newRessource->url ='ressources/' . $projectId . '/transcriptions/' . $transcriptionName;
            $newRessource->project_id = $projectId;
            $newRessource->save();

            $transcriptionVTT = $project->transcriptions()->create([
                'version' => $lastVersion + 1,
                'ressource_id' => $newRessource->id,
                'project_id' => $projectId,
                'file_type' => 'vtt'
            ]);
        }

        if (!isset($transcriptionSRT) && isset($transcriptionVTT)) {
            $vtt = Subtitles::loadFromFile($request->file('vtt')->getRealPath(), 'vtt');
            $srt = $vtt->content('srt');

            $transcriptionName = 'transcription_' . $projectId . '_version_' . ($lastVersion + 1) . '.srt';
            $isUpload = Storage::disk('s3')->put('ressources/' . $projectId . '/transcriptions/' . $transcriptionName, $srt);

            if (!$isUpload) {
                return response()->json([
                    'message' => 'Error while storing the file'
                ], 500);
            }

            $newRessource = new Ressource();
            $newRessource->name = $transcriptionName;
            $newRessource->type = 'transcription';
            $newRessource->url = 'ressources/' . $projectId . '/transcriptions/' . $transcriptionName;
            $newRessource->project_id = $projectId;
            $newRessource->save();

            $transcriptionSRT = $project->transcriptions()->create([
                'version' => $lastVersion + 1,
                'ressource_id' => $newRessource->id,
                'project_id' => $projectId,
                'file_type' => 'srt'
            ]);
        }


        return response()->json([
            'data' => [
                'srt' => $transcriptionSRT ?? null,
                'vtt' => $transcriptionVTT ?? null
            ]
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

        $transcriptions = $project->transcriptions()->where('version', $request->version)->get();


        // $transcription->ressource_id is not set, return error
        if (!$transcriptions) {
            return response()->json([
                'message' => 'Transcription not found.'
            ], 404);
        }

        foreach ($transcriptions as $transcription) {
            $ressource = Ressource::find($transcription->ressource_id);

            Storage::disk('s3')->delete($ressource->url);

            $ressource->delete();

            $transcription->delete();
        }

        return response()->json([
            'message' => 'Transcription deleted'
        ], 200);
    }
}