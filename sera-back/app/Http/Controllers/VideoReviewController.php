<?php

namespace App\Http\Controllers;

use App\Models\Project;
use App\Models\Ressource;
use App\Models\VideoReview;
use Illuminate\Http\Request;
use App\Models\CommentReview;
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
        $videos = VideoReview::where('project_id', $id)->with('ressource','comments')->orderBy('version', 'desc');
        if ($request->version) {
            $videos = $videos->where('version', $request->version)->get();
        }else{
            $videos = $videos->get();
        }

        if (!$videos) {
            return response()->json([
                'message' => 'No reviews found',
            ], 404);
        }

        $formattedVideos = [];

        foreach ($videos as $video) {
            $formattedVideo = [];
            $formattedVideo['version'] = $video->version;
            $formattedVideo['video'] = [];
            $formattedVideo['video']['type'] = $video->ressource->type;
            $formattedVideo['video']['title'] = $video->ressource->name;
            $formattedVideo['video']['sources'] = [];
            $formattedVideo['video']['sources'][0] = [];
            $formattedVideo['video']['sources'][0]['size'] = $video->resolution;
            $formattedVideo['video']['sources'][0]['provider'] = $video->provider;
            $formattedVideo['video']['sources'][0]['src'] = $video->ressource->url;
            $formattedVideo['video']['sources'][0]['type'] = $video->type;
            $formattedVideo['comments'] = [];

            foreach ($video->comments as $comment) {
                $formattedComment = [];
                $formattedComment['author'] = [];
                $formattedComment['author']['nickname'] = $comment->user->lastname . ' ' . $comment->user->firstname;
                $formattedComment['author']['avatar'] = $comment->user->avatar_filename;
                $formattedComment['author']['job'] = ucwords(str_replace('_', ' ', $comment->user->role));
                $formattedComment['message'] = $comment->message;
                $formattedComment['timestamp'] = $comment->created_at;
                $formattedVideo['comments'][] = $formattedComment;
            }

            $formattedVideos[] = $formattedVideo;
        }

        return response()->json($formattedVideos, 200);
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

    /**
    * @OA\Post(
    *     path="/api/projects/{projectId}/videos/{version}",
    *     summary="Add a comment to a video review",
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
    *         in="path",
    *         description="Version of the video review",
    *         required=true,
    *         @OA\Schema(
    *             type="integer",
    *             format="int64"
    *         )
    *     ),
    *     @OA\RequestBody(
    *         description="Comment object that needs to be added to the video review",
    *         required=true,
    *         @OA\JsonContent(
    *             @OA\Property(property="message", type="string", example="test"),
    *         ),
    *     ),
    *     @OA\Response(
    *         response=201,
    *         description="Comment created"
    *     ),
    *     @OA\Response(
    *         response=404,
    *         description="Video review not found"
    *     ),
    * )
    */
    function addAComment(Request $request, $projectId, $version)
    {
        $request->validate([
            'message' => 'required|string',
        ]);

        $videoReview = VideoReview::where('project_id', $projectId)->where('version', $version)->first();

        if (!$videoReview) {
            return response()->json([
                'message' => 'Video review not found',
            ], 404);
        }

        $comment = new CommentReview();
        $comment->user_id = $request->user()->id;
        $comment->video_review_id = $videoReview->id;
        $comment->message = $request->message;
        $comment->save();

        return response()->json([
            'message' => 'Comment created',
            'comment' => $comment,
        ], 201);
    }

    /**
    * @OA\Get(
    *     path="/api/projects/{projectId}/videos/getuploadurl",
    *     summary="Get a temporary upload url for a video review",
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
    *     @OA\Response(
    *         response=200,
    *         description="Temporary upload url found"
    *     ),
    *     @OA\Response(
    *         response=401,
    *         description="User not connected"
    *     ),
    *     @OA\Response(
    *         response=404,
    *         description="Project not found"
    *     ),
    * )
    */
    function getTemporaryUploadUrl($projectId){
        // On regarde que ça soit un User connecté
        if(!auth()->user()){
            return response()->json([
                'message' => 'User not connected',
            ], 401);
        }

        // On regarde que le projet existe
        $project = Project::find($projectId);
        if(!$project){
            return response()->json([
                'message' => 'Project not found',
            ], 404);
        }

        // on get la dernière version de la video review
        $video = VideoReview::where('project_id', $projectId)->orderBy('version', 'desc')->first();

        if(!$video){
            $version = 1;
        }else{
            $version = $video->version + 1;
        }

        if (env('IS_LOCAL')) {
            $config = config('filesystems.disks.s3');
            $config['url'] = 'http://localhost:9000';
            $config['endpoint'] = 'http://localhost:9000';
            config(['filesystems.disks.s3' => $config]);
        }

        ['url' => $url, 'headers' => $headers] = Storage::disk('s3')->temporaryUploadUrl(
            'ressources/project_'.$projectId.'/video/version_'.$version.'/'.now()->timestamp.'.mp4',
            now()->addHours(24), [
            'Content-Type' => 'video/mp4',
            'Cache-Control' => 'max-age=3600',
        ]);

        return response()->json([
            'url' => $url,
            'headers' => $headers,
            'path' => 'ressources/project_'.$projectId.'/video/version_'.$version.'/'.now()->timestamp.'.mp4',
        ], 200);
    }
}
