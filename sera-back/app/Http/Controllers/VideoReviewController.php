<?php

namespace App\Http\Controllers;

use App\Models\Ressource;
use App\Models\VideoReview;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class VideoReviewController extends Controller
{

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

    function destroy($version)
    {
        $videoReview = VideoReview::where('version', $version)->first();

        if (!$videoReview) {
            return response()->json([
                'message' => 'Video review not found',
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
    }
}
