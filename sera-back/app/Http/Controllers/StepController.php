<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\ProjectRequest;
use SebastianBergmann\CodeCoverage\Report\Xml\Project;

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
            'status' => 'ongoing',
        ]));

        $projectRequest->save();

        return response()->json($project, 201);
    }
}
