<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Project;

class CourseController extends Controller
{
    /**
    * @OA\Get(
    *      path="/courses",
    *      operationId="getCourseList",
    *      tags={"Courses"},
    *      summary="Get list of courses",
    *      description="Returns list of courses",
    *      @OA\Response(
    *          response=200,
    *          description="successful operation",
    *       ),
    *       @OA\Response(
    *          response=401,
    *          description="Unauthorized",
    *       ),
    *     )
    */
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

    /**
    * @OA\Get(
    *      path="/courses/{id}",
    *      operationId="getCourseById",
    *      tags={"Courses"},
    *      summary="Get course information",
    *      description="Returns course data",
    *      @OA\Parameter(
    *          name="id",
    *          description="Course id",
    *          required=true,
    *          in="path",
    *          @OA\Schema(
    *              type="integer",
    *              format="int64"
    *          )
    *      ),
    *      @OA\Response(
    *          response=200,
    *          description="successful operation",
    *       ),
    *       @OA\Response(
    *          response=401,
    *          description="Unauthorized",
    *       ),
    *       @OA\Response(
    *          response=404,
    *          description="Not found",
    *       ),
    *     )
    */
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
