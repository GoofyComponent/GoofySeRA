<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\ProjectRequest;
use App\Models\Project;

class StepController extends Controller
{

    /**
     * @OA\Post(
     *   path="/api/projects/init",
     *   tags={"Step"},
     *   summary="Init project",
     *   description="Init project",
     *   operationId="InitProject",
     *   @OA\RequestBody(
     *     required=true,
     *     description="Init project",
     *     @OA\JsonContent(
     *       required={"title","description","project_request_id"},
     *       @OA\Property(property="title", type="string", example="Project title"),
     *       @OA\Property(property="description", type="string", example="Project description"),
     *       @OA\Property(property="project_request_id", type="integer", example="1"),
     *     ),
     *   ),
     *   @OA\Response(
     *     response=201,
     *     description="Project created",
     *     @OA\JsonContent(
     *       @OA\Property(property="id", type="integer", example="1"),
     *       @OA\Property(property="title", type="string", example="Project title"),
     *       @OA\Property(property="description", type="string", example="Project description"),
     *       @OA\Property(property="status", type="string", example="ongoing"),
     *       @OA\Property(property="created_at", type="string", example="2021-05-05T14:48:00.000000Z"),
     *       @OA\Property(property="updated_at", type="string", example="2021-05-05T14:48:00.000000Z"),
     *       @OA\Property(property="project_request_id", type="integer", example="1"),
     *     ),
     *   ),
     *   @OA\Response(
     *     response=400,
     *     description="Bad request",
     *     @OA\JsonContent(
     *       @OA\Property(property="error", type="string", example="Project request already processed."),
     *     ),
     *   ),
     *   @OA\Response(
     *     response=404,
     *     description="Project request not found",
     *     @OA\JsonContent(
     *       @OA\Property(property="error", type="string", example="Project request not found."),
     *     ),
     *   ),
     * ),
     */
    public function InitProject(Request $request)
    {

        $validatedData = $request->validate([
            'title' => 'required|string',
            'description' => 'required|string',
            'project_request_id' => 'required|integer',
        ]);


        $projectRequest = ProjectRequest::find($validatedData['project_request_id']);

        if ($projectRequest === null) {
            return response()->json(['error' => 'Project request not found.'], 404);
        }

        if ($projectRequest->status !== 'pending') {
            return response()->json(['error' => 'Project request already processed.'], 400);
        }

        if($projectRequest->status === 'refused'){
            return response()->json(['error' => 'Project request is refused. You can not create a project.'], 400);
        }

        $projectRequest->status = 'accepted';

        $projectController = new ProjectController();

        $project = $projectController->store(new Request([
            'project_request_id' => $projectRequest->id,
            'title' => $validatedData['title'],
            'description' => $validatedData['description'],
        ]));


        $projectRequest->save();

        return response()->json($project, 201);
    }

    /**
     * @OA\Get(
     *  path="/api/projects/show/steps",
     * tags={"Step"},
     * summary="Get project steps",
     * description="Get project steps",
     * operationId="GetSteps",
     * @OA\Parameter(
     *     description="Project id",
     *     in="query",
     *     name="project_id",
     *     required=true,
     *     @OA\Schema(
     *         type="integer",
     *         format="int64"
     *     )
     * ),
     * @OA\Parameter(
     *     description="Step",
     *     in="query",
     *     name="step",
     *     required=false,
     *     @OA\Schema(
     *         type="string",
     *     )
     * ),
     * @OA\Response(
     *     response=200,
     *     description="Project steps",
     *     @OA\JsonContent(
     *         @OA\Property(property="id", type="integer", example="1"),
     *         @OA\Property(property="title", type="string", example="Project title"),
     *         @OA\Property(property="description", type="string", example="Project description"),
     *         @OA\Property(property="status", type="string", example="ongoing"),
     *         @OA\Property(property="created_at", type="string", example="2021-05-05T14:48:00.000000Z"),
     *         @OA\Property(property="updated_at", type="string", example="2021-05-05T14:48:00.000000Z"),
     *         @OA\Property(property="project_request_id", type="integer", example="1"),
     *     ),
     * ),
     * @OA\Response(
     *     response=404,
     *     description="Project not found",
     *     @OA\JsonContent(
     *         @OA\Property(property="error", type="string", example="Project not found."),
     *     ),
     * ),
     * @OA\Response(
     *    response=400,
     *   description="Bad request",
     *  @OA\JsonContent(
     *      @OA\Property(property="error", type="string", example="Step not found."),
     *   ),
     * ),
     * )
     */
    public function getSteps(Request $request)
    {

        $validatedData = $request->validate([
            'project_id' => 'required|integer',
            'step' => 'string',
        ]);

        $stepParam = $validatedData['step'] ?? 'current';

        $project = Project::find($validatedData['project_id']);

        if ($project === null) {
            return response()->json(['error' => 'Project not found.'], 404);
        }

        $steps = json_decode($project->steps);

        // if stepParam is current, return all steps with status ongoing
        if ($stepParam === 'current') {
            $currentSteps = [];
            foreach ($steps as $step => $value) {
                if ($value->status === 'ongoing') {
                    $currentSteps[$step] = $value;
                }
            }
            return response()->json($currentSteps, 200);
        }
        if($steps->$stepParam === null){
            return response()->json(['error' => 'Step not found.'], 400);
        }

        return response()->json($steps->$stepParam, 200);
    }
}
