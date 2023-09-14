<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Project;

class CourseController extends Controller
{
    public function index()
    {
        $projects = Project::where('status', 'published')
        ->select('id', 'title', 'description')
        ->paginate(15);

        return response()->json(
            $projects,
            200
        );
    }

    public function show($id)
    {
        $project = Project::with(['videoReviews' => function ($query) {
            $query->where('validated', true);
        }, 'videoReviews.ressource', 'subtitles.ressource', 'edito.knowledges'])->find($id);

        if (!$project) {
            return response()->json(['error' => 'Projet introuvable'], 404);
        }

        $json = [
            "Title" => $project->title,
            "Description" => $project->description,
            "Video" => null,
            "Subtitles" => [],
            "Edito" => null,
        ];

        if ($project->videoReviews) {
            $video = $project->videoReviews->first();
            $videoRessource = $video->ressource;
            $json["Video"] = [
                "Name" => $videoRessource->name,
                "Url" => $videoRessource->url,
                "Type" => $videoRessource->type,
                "Description" => $videoRessource->description,
            ];
        }

        foreach ($project->subtitles as $subtitle) {
            $subtitleRessource = $subtitle->ressource;
            $json["Subtitles"][$subtitle->lang] = $subtitleRessource->url;
        }

        if ($project->edito) {
            $edito = $project->edito;
            $editoJson = [
                "Title" => $edito->title,
                "Description" => $edito->description,
                "Knowledges" => $edito->knowledges->map(function ($knowledge) {
                    return [
                        "Name" => $knowledge->name,
                        "Infos" => $knowledge->infos,
                        "Image" => $knowledge->image,
                        "Type" => $knowledge->type,
                    ];
                }),
                "Images" => $edito->images,
            ];
            $json["Edito"] = $editoJson;
        }

        return response()->json($json, 200);
    }

}
