<?php

namespace App\Http\Controllers;

use App\Models\Ressource;
use App\Models\VideoReview;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class VideoReviewController extends Controller
{

    /**
    * @OA\Get(
    *     path="/api/projects/{projectId}/videos",
    *     summary="Get all video reviews of a project",
    *     tags={"Video Review"},
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
    *         name="version",
    *         in="query",
    *         description="Version of the video review",
    *         required=false,
    *         @OA\Schema(
    *             type="integer",
    *             format="int64"
    *         )
    *     ),
    *     @OA\Response(
    *         response=200,
    *         description="Video reviews found"
    *     ),
    *     @OA\Response(
    *         response=404,
    *         description="No video reviews found"
    *     ),
    * )
    */
    function getReviewsByProjectId(Request $request, $id)
    {
        $request->validate([
            'version' => 'string',
        ]);

        // take VideoReview with ressource loaded sorted by version
        $videos = VideoReview::where('project_id', $id)->with('ressource')->orderBy('version', 'asc');
        if ($request->version) {
            $videos = $videos->where('version', $request->version)->first();
        }else{
            $videos = $videos->get();
        }

        if (!$videos) {
            return response()->json([
                'message' => 'No reviews found',
            ], 404);
        }

        return response()->json($videos);
    }

    /**
    * @OA\Post(
    *     path="/api/projects/{projectId}/videos",
    *     summary="Create a video review",
    *     tags={"Video Review"},
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
    *         description="Video review object that needs to be added to the project",
    *         required=true,
    *         @OA\JsonContent(
    *             @OA\Property(property="provider", type="string", example="html5"),
    *             @OA\Property(property="type", type="string", example="video"),
    *             @OA\Property(property="resolution", type="string", example="1080"),
    *             @OA\Property(property="url", type="string", example="/test.mkv"),
    *             @OA\Property(property="name", type="string", example="test"),
    *             @OA\Property(property="description", type="string", example="test"),
    *         ),
    *     ),
    *     @OA\Response(
    *         response=201,
    *         description="Video review created"
    *     ),
    *     @OA\Response(
    *         response=404,
    *         description="Project not found"
    *     ),
    * )
    */
    function store(Request $request, $projectId)
    {
        $request->validate([
            'provider' => 'required|string',
            'type' => 'required|string',
            'resolution' => 'required|string',
            'url' => 'required|string',
            'name' => 'required|string',
            'description' => 'required|string',
        ]);

        $videoReview = VideoReview::where('project_id', $projectId)->orderBy('version', 'desc')->first();

        if (!$videoReview) {
            $videoReview = new VideoReview();
            $videoReview->project_id = $projectId;
            $videoReview->version = 1;
        }else{
            $version = $videoReview->version;
            $videoReview = new VideoReview();
            $videoReview->project_id = $projectId;
            $videoReview->version = $version + 1;
        }

        $videoReview->provider = $request->provider;
        $videoReview->type = $request->type;
        $videoReview->resolution = $request->resolution;

        // New ressource
        $ressource = new Ressource();
        $ressource->project_id = $projectId;
        $ressource->url = $request->url;
        $ressource->name = $request->name;
        $ressource->description = $request->description;
        $ressource->type = 'video';
        $ressource->save();

        $videoReview->ressource_id = $ressource->id;
        $videoReview->save();

        return response()->json([
            'message' => 'Video review created',
            'videoReview' => $videoReview,
        ], 201);
    }

    /**
    * @OA\Delete(
    *     path="/api/videos/{version}",
    *     summary="Delete a video review",
    *     tags={"Video Review"},
    *     @OA\Parameter(
    *         name="version",
    *         in="path",
    *         description="Version of the video review",
    *         required=true,
    *         @OA\Schema(
    *             type="integer",
    *             format="int64"
    *         )
    *     ),
    *     @OA\Response(
    *         response=200,
    *         description="Video review deleted"
    *     ),
    *     @OA\Response(
    *         response=404,
    *         description="Video review not found"
    *     ),
    * )
    */
    function destroy($version)
    {
        $videoReview = VideoReview::where('version', $version)->first();

        if (!$videoReview) {
            return response()->json([
                'message' => 'Video version not found',
            ], 404);
        }

        $ressource = Ressource::find($videoReview->ressource_id);

        // on get l'url de la ressource
        $url = $ressource->url;

        // on supprime le fichier de minio grace à filesystem s3
        try{
            Storage::disk('s3')->delete($url);
        }catch(\Exception $e){
            return response()->json([
                'message' => 'Error while deleting file',
            ], 500);
        }

        $ressource->delete();
        $videoReview->delete();

        return response()->json([
            'message' => 'Video review deleted',
        ], 200);
    }
}
