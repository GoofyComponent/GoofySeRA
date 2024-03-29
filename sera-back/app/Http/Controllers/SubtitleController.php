<?php

namespace App\Http\Controllers;

use App\Models\Project;
use App\Models\Subtitle;
use App\Models\Ressource;
use Illuminate\Http\Request;
use \Done\Subtitles\Subtitles;
use Illuminate\Support\Facades\Storage;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Validator;



class SubtitleController extends Controller
{
    /**
    * @OA\Post(
    *     path="/api/projects/{projectId}/subtitles",
    *     summary="Upload a subtitle",
    *     tags={"Subtitles"},
    *     description="Upload a subtitle",
    *     operationId="uploadSubtitle",
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
    *         description="Subtitle object that needs to be added to the store",
    *         required=true,
    *         @OA\MediaType(
    *             mediaType="multipart/form-data",
    *             @OA\Schema(
    *                 @OA\Property(
    *                     property="srt",
    *                     description="SRT file to upload",
    *                     type="file",
    *                     format="file",
    *                 ),
    *                 @OA\Property(
    *                     property="vtt",
    *                     description="VTT file to upload",
    *                     type="file",
    *                     format="file",
    *                 ),
    *                 @OA\Property(
    *                     property="lang",
    *                     description="Language of the subtitle",
    *                     type="string",
    *                 ),
    *                 example={"srt": "file.srt", "vtt": "file.vtt", "lang": "fr"},
    *             )
    *         )
    *     ),
    *     @OA\Response(
    *         response=200,
    *         description="Subtitle successfully uploaded",
    *         @OA\JsonContent(
    *             @OA\Property(
    *                 property="message",
    *                 type="string",
    *                 example="Subtitle successfully uploaded"
    *             )
    *         )
    *     ),
    *     @OA\Response(
    *         response=400,
    *         description="Bad request",
    *         @OA\JsonContent(
    *             @OA\Property(
    *                 property="message",
    *                 type="string",
    *                 example="You must provide a srt or vtt file"
    *             ),
    *         )
    *     ),
    *     @OA\Response(
    *         response=404,
    *         description="Project not found",
    *         @OA\JsonContent(
    *             @OA\Property(
    *                 property="message",
    *                 type="string",
    *                 example="Project not found"
    *             ),
    *         )
    *     ),
    *     @OA\Response(
    *         response=500,
    *         description="Error while storing the file",
    *         @OA\JsonContent(
    *             @OA\Property(
    *                 property="message",
    *                 type="string",
    *                 example="Error while storing the file"
    *             ),
    *         )
    *     ),
    * )
    */
    public function store(Request $request, $projectId){

        // on appelle getIsoList du usercontroller
        $countries = new UserController();
        $countries = $countries->getIsoList()->getOriginalContent();

        $validator = Validator::make($request->all(), [
            'srt' => 'file',
            'vtt' => 'file',
            'lang' => 'required|string|in:' . implode(',', $countries),
        ]);

        $validator->setCustomMessages([
            'lang.in' => 'Le tableau complet des langues est : '.implode(', ', $countries),
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => $validator->errors()->first()
            ], 400);
        }
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

        if($request->file('srt')){
            if ($request->file('srt')->getClientOriginalExtension() != 'srt') {
                return response()->json([
                    'message' => 'The file must be a srt file. The extension is ' . $request->file('srt')->getClientOriginalExtension()
                ], 400);
            }
            $subtitleName = 'subtitle_' . $projectId . '_' . $request->lang . '.srt';
            $path = $request->file('srt')->storeAs(
                'ressources/' . $projectId . '/subtitles',
                $subtitleName,
                's3'
            );

            if (!$path) {
                return response()->json([
                    'message' => 'Error while storing the file'
                ], 500);
            }

            $subtitleSRT = Subtitle::where('project_id', $projectId)->where('lang', $request->lang)->where('file_type', 'srt')->first();

            if (!$subtitleSRT) {
                $ressource = new Ressource();
                $ressource->name = $subtitleName;
                $ressource->type = 'subtitle';
                $ressource->url = $path;
                $ressource->project_id = $projectId;
                $ressource->save();

                $subtitleSRT = new Subtitle();
                $subtitleSRT->lang = $request->lang;
                $subtitleSRT->file_type = 'srt';
                $subtitleSRT->ressource_id = $ressource->id;
                $subtitleSRT->project_id = $projectId;
                $subtitleSRT->save();
            }

        }
        if($request->file('vtt')){
            if ($request->file('vtt')->getClientOriginalExtension() != 'vtt') {
                return response()->json([
                    'message' => 'The file must be a vtt file. The extension is ' . $request->file('vtt')->getClientOriginalExtension()
                ], 400);
            }
            $subtitleName = 'subtitle_' . $projectId . '_' . $request->lang . '.vtt';
            $path = $request->file('vtt')->storeAs(
                'ressources/' . $projectId . '/subtitles',
                $subtitleName,
                's3'
            );

            if (!$path) {
                return response()->json([
                    'message' => 'Error while storing the file'
                ], 500);
            }

            $subtitleVTT = Subtitle::where('project_id', $projectId)->where('lang', $request->lang)->where('file_type', 'vtt')->first();

            if (!$subtitleVTT) {
                $ressource = new Ressource();
                $ressource->name = $subtitleName;
                $ressource->type = 'subtitle';
                $ressource->url = $path;
                $ressource->project_id = $projectId;
                $ressource->save();

                $subtitleVTT = new Subtitle();
                $subtitleVTT->lang = $request->lang;
                $subtitleVTT->file_type = 'vtt';
                $subtitleVTT->ressource_id = $ressource->id;
                $subtitleVTT->project_id = $projectId;
                $subtitleVTT->save();
            }
        }

        if (isset($subtitleSRT) && !isset($subtitleVTT)){
            $srt = Subtitles::loadFromFile($request->file('srt')->getRealPath(), 'srt');
            $vtt = $srt->content('vtt');

            $subtitleName = 'subtitle_' . $projectId . '_' . $request->lang . '.vtt';
            $isUpload = Storage::disk('s3')->put('ressources/' . $projectId . '/subtitles/' . $subtitleName, $vtt);
            if (!$isUpload) {
                return response()->json([
                    'message' => 'Error while storing the file'
                ], 500);
            }

            $subtitleVTT = Subtitle::where('project_id', $projectId)->where('lang', $request->lang)->where('file_type', 'vtt')->first();
            if (!$subtitleVTT) {
                $ressource = new Ressource();
                $ressource->name = $subtitleName;
                $ressource->type = 'subtitle';
                $ressource->url = $path;
                $ressource->project_id = $projectId;
                $ressource->save();

                $subtitleVTT = new Subtitle();
                $subtitleVTT->lang = $request->lang;
                $subtitleVTT->file_type = 'vtt';
                $subtitleVTT->ressource_id = $ressource->id;
                $subtitleVTT->project_id = $projectId;
                $subtitleVTT->save();
            }
        }
        if (!isset($subtitleSRT) && isset($subtitleVTT)){
            $vtt = Subtitles::loadFromFile($request->file('vtt')->getRealPath(), 'vtt');
            $srt = $vtt->content('srt');

            $subtitleName = 'subtitle_' . $projectId . '_' . $request->lang . '.srt';
            $isUpload = Storage::disk('s3')->put('ressources/' . $projectId . '/subtitles/' . $subtitleName, $srt);
            if (!$isUpload) {
                return response()->json([
                    'message' => 'Error while storing the file'
                ], 500);
            }

            $subtitleSRT = Subtitle::where('project_id', $projectId)->where('lang', $request->lang)->where('file_type', 'srt')->first();
            if (!$subtitleSRT) {
                $ressource = new Ressource();
                $ressource->name = $subtitleName;
                $ressource->type = 'subtitle';
                $ressource->url = $path;
                $ressource->project_id = $projectId;
                $ressource->save();

                $subtitleSRT = new Subtitle();
                $subtitleSRT->lang = $request->lang;
                $subtitleSRT->file_type = 'srt';
                $subtitleSRT->ressource_id = $ressource->id;
                $subtitleSRT->project_id = $projectId;
                $subtitleSRT->save();
            }
        }

        return response()->json([
            'message' => 'Subtitle successfully uploaded',
            'subtitleSRT' => $subtitleSRT,
            'subtitleVTT' => $subtitleVTT,
        ], 200);
    }

    /**
    * @OA\Get(
    *     path="/api/projects/{projectId}/subtitles",
    *     summary="Get subtitles",
    *     tags={"Subtitles"},
    *     description="Get subtitles",
    *     operationId="getSubtitles",
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
    *         name="lang",
    *         in="query",
    *         description="Language of the subtitle",
    *         required=false,
    *         @OA\Schema(
    *             type="string",
    *         )
    *     ),
    *     @OA\Response(
    *         response=200,
    *         description="Subtitles successfully retrieved",
    *         @OA\JsonContent(
    *             @OA\Property(
    *                 property="subtitles",
    *                 type="array",
    *                 @OA\Items(
    *                     @OA\Property(
    *                         property="lang",
    *                         type="string",
    *                         example="fr"
    *                     ),
    *                     @OA\Property(
    *                         property="srt",
    *                         type="object",
    *                         @OA\Property(
    *                             property="id",
    *                             type="integer",
    *                             example=1
    *                         ),
    *                         @OA\Property(
    *                             property="lang",
    *                             type="string",
    *                             example="fr"
    *                         ),
    *                         @OA\Property(
    *                             property="file_type",
    *                             type="string",
    *                             example="srt"
    *                         ),
    *                         @OA\Property(
    *                             property="ressource_id",
    *                             type="integer",
    *                             example=1
    *                         ),
    *                         @OA\Property(
    *                             property="project_id",
    *                             type="integer",
    *                             example=1
    *                         ),
    *                         @OA\Property(
    *                             property="created_at",
    *                             type="string",
    *                             example="2021-05-04T09:00:00.000000Z"
    *                         ),
    *                         @OA\Property(
    *                             property="updated_at",
    *                             type="string",
    *                             example="2021-05-04T09:00:00.000000Z"
    *                         ),

    *                     ),
    *                  ),
    *             ),
    *         )
    *     ),
    *     @OA\Response(
    *         response=400,
    *         description="Bad request",
    *         @OA\JsonContent(
    *             @OA\Property(
    *                 property="message",
    *                 type="string",
    *                 example="The given data was invalid."
    *             ),
    *             @OA\Property(
    *                 property="errors",
    *                 type="object",
    *                 @OA\Property(
    *                     property="lang",
    *                     type="array",
    *                     @OA\Items(
    *                         type="string",
    *                         example="The lang field is required."
    *                     ),
    *                 ),
    *             ),
    *         )
    *     ),
    *     @OA\Response(
    *         response=404,
    *         description="Project not found",
    *         @OA\JsonContent(
    *             @OA\Property(
    *                 property="message",
    *                 type="string",
    *                 example="Project not found"
    *             ),
    *         )
    *     ),
    * )
    */
    public function index(Request $request, $projectId){
        $countries = new UserController();
        $countries = $countries->getIsoList()->getOriginalContent();
        $validator = Validator::make($request->all(), [
            'lang' => 'string|in:'.implode(',', $countries),
        ]);

        $validator->setCustomMessages([
            'lang.in' => 'Le tableau complet des langues est : '.implode(', ', $countries),
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => $validator->errors()->first()
            ], 400);
        }

        $project = Project::find($projectId);
        if (!$project) {
            return response()->json([
                'message' => 'Project not found'
            ], 404);
        }

        $subtitles = Subtitle::where('project_id', $projectId);

        if ($request->has('lang')) {
            $subtitles = $subtitles->where('lang', $request->lang);
        }

        $subtitles = $subtitles->with('ressource')->get();

        // on les tries par version dans le truc qu'on renvoie
        $transformedSubtitles = [];
        foreach ($subtitles as $subtitle) {
            $transformedSubtitles[$subtitle->lang][$subtitle->file_type] = $subtitle;
        }

        return response()->json([
            'subtitles' => $transformedSubtitles,
        ], 200);
    }


    /**
    * @OA\Delete(
    *     path="/api/projects/{projectId}/subtitles",
    *     summary="Delete subtitles",
    *     tags={"Subtitles"},
    *     description="Delete subtitles",
    *     operationId="deleteSubtitles",
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
    *         name="lang",
    *         in="query",
    *         description="Language of the subtitle",
    *         required=true,
    *         @OA\Schema(
    *             type="string",
    *         )
    *     ),
    *     @OA\Response(
    *         response=200,
    *         description="Subtitles successfully deleted",
    *         @OA\JsonContent(
    *             @OA\Property(
    *                 property="message",
    *                 type="string",
    *                 example="Subtitles successfully deleted"
    *             )
    *         )
    *     ),
    *     @OA\Response(
    *         response=400,
    *         description="Bad request",
    *         @OA\JsonContent(
    *             @OA\Property(
    *                 property="message",
    *                 type="string",
    *                 example="The given data was invalid."
    *             ),
    *             @OA\Property(
    *                 property="errors",
    *                 type="object",
    *                 @OA\Property(
    *                     property="lang",
    *                     type="array",
    *                     @OA\Items(
    *                         type="string",
    *                         example="The lang field is required."
    *                     ),
    *                 ),
    *             ),
    *         )
    *     ),
    *     @OA\Response(
    *         response=404,
    *         description="Project not found",
    *         @OA\JsonContent(
    *             @OA\Property(
    *                 property="message",
    *                 type="string",
    *                 example="Project not found"
    *             ),
    *         )
    *     ),
    * )
    */
    public function destroy(Request $request, $projectId){
        $countries = new UserController();
        $countries = $countries->getIsoList()->getOriginalContent();

        $validator = Validator::make($request->all(), [
            'lang' => 'required|string|in:'.implode(',', $countries),
        ]);

        $validator->setCustomMessages([
            'lang.in' => 'Le tableau complet des langues est : '.implode(', ', $countries),
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => $validator->errors()->first()
            ], 400);
        }

        $project = Project::find($projectId);
        if (!$project) {
            return response()->json([
                'message' => 'Project not found'
            ], 404);
        }

        // on récupère les sous-titres du projet par langue
        $subtitles = Subtitle::where('project_id', $projectId)->where('lang', $request->lang)->get();
        if ($subtitles->isEmpty()) {
            return response()->json([
                'message' => 'There is no subtitles for this language'
            ], 404);
        }

        // on supprime les ressources associées
        foreach ($subtitles as $subtitle) {
            $subtitle->ressource->delete();
        }

        return response()->json([
            'message' => 'Subtitles successfully deleted',
        ], 200);
    }
}
