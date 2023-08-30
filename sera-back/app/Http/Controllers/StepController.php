<?php

namespace App\Http\Controllers;

use Carbon\Carbon;
use App\Models\Project;
use Illuminate\Http\Request;
use App\Models\ProjectRequest;

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

        // get the user connected
        $user = $request->user();

        // if the user is not project_manager or cursus_director return 403
        if (!in_array($user->role, ['project_manager', 'cursus_director'])) {
            return response()->json(['error' => 'Unauthorized.'], 403);
        }


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

        $project = json_decode($project->getContent());

        $teamController = new TeamController();

        $teamController->update(new Request([
            'user_id' => $projectRequest->user_id,
        ]), $project->id);

        $projectRequest->save();

        return response()->json($project, 201);
    }

    /**
     * @OA\Get(
     *  path="/api/projects/{id}/steps",
     * tags={"Step"},
     * summary="Get project steps",
     * description="Get project steps",
     * operationId="GetSteps",
     * @OA\Parameter(
     *     description="Project id",
     *     in="path",
     *     name="id",
     *     required=true,
     *     @OA\Schema(
     *         type="integer",
     *         format="int64"
     *     )
     * ),
     * @OA\Parameter(
     *     description="Status of the steps",
     *     in="query",
     *     name="status",
     *     required=false,
     *     @OA\Schema(
     *         type="string",
     *         enum={"ongoing", "done", "not_started"}
     *     )
     * ),
     * @OA\Parameter(
     *     description="Select a specific step",
     *     in="query",
     *     name="step",
     *     required=false,
     *     @OA\Schema(
     *         type="string",
     *         enum={"Planning", "Capture", "Post-Production", "Transcription", "Subtitling", "Editorial"}
     *     )
     * ),
     * @OA\Response(
     *     response=200,
     *     description="Project steps",
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
    public function getSteps($id ,Request $request)
    {
        $validatedData = $request->validate([
            'status' => 'string',
            'step' => 'string|in:' . implode(',', array_keys(config('steps'))),
        ]);

        $project = Project::find($id);

        if ($project === null) {
            return response()->json(['error' => 'Project not found.'], 404);
        }

        $steps = json_decode($project->steps);

        if (isset($validatedData['step'])) {
            if (!isset($steps->{$validatedData['step']})) {
                return response()->json(['error' => 'Step not found.'], 400);
            }
            $steps = [$validatedData['step'] => $steps->{$validatedData['step']}];
        }

        if (isset($validatedData['status'])) {
            $steps = array_filter((array)$steps, function ($step) use ($validatedData) {
                return $step->status === $validatedData['status'];
            });
        }

        // Reformat steps into an array with the step name as a property
        $stepsWithKeys = [];
        foreach ($steps as $key => $step) {
            $step->name = $key;
            $stepsWithKeys[] = $step;
        }

        return response()->json($stepsWithKeys, 200);
    }

    /**
     * @OA\Post(
     *     path="/api/projects/steps/update-date'",
     *     tags={"Step"},
     *     summary="Update date to a step",
     *     description="Update date to a step",
     *     operationId="UpdateDateToAStep",
     *
     *     @OA\RequestBody(
     *         required=true,
     *         description="Update date to a step",
     *         @OA\JsonContent(
     *             required={"project_id", "step", "start_date", "end_date"},
     *             @OA\Property(property="project_id", type="integer", example="1"),
     *             @OA\Property(property="step", type="string", example="Capture"),
     *             @OA\Property(property="start_date", type="string", example="2021-05-05"),
     *             @OA\Property(property="end_date", type="string", example="2021-05-05"),
     *         ),
     *     ),
     *
     *     @OA\Response(
     *         response=200,
     *         description="Project",
     *         @OA\JsonContent(
     *             @OA\Property(property="id", type="integer", example="1"),
     *             @OA\Property(property="title", type="string", example="Project title"),
     *             @OA\Property(property="description", type="string", example="Project description"),
     *             @OA\Property(property="status", type="string", example="ongoing"),
     *             @OA\Property(property="created_at", type="string", example="2021-05-05T14:48:00.000000Z"),
     *             @OA\Property(property="updated_at", type="string", example="2021-05-05T14:48:00.000000Z"),
     *             @OA\Property(property="project_request_id", type="integer", example="1"),
     *         ),
     *     ),
     *
     *     @OA\Response(
     *         response=404,
     *         description="Project not found",
     *         @OA\JsonContent(
     *             @OA\Property(property="error", type="string", example="Project not found."),
     *         ),
     *     ),
     * )
     *
     */
    public function updateDateToAStep(Request $request){

        $validatedData = $request->validate([
            'project_id' => 'required|integer',
            'step' => 'required|string|in:' . implode(',', array_keys(config('steps'))),
            'start_date' => 'date',
            'end_date' => 'date',
        ]);

        $project = Project::find($validatedData['project_id']);

        if ($project === null) {
            return response()->json(['error' => 'Project not found.'], 404);
        }

        $steps = json_decode($project->steps);

        if($validatedData['start_date'] !== null){
            $startDate = Carbon::parse($validatedData['start_date']);
            $steps->{$validatedData['step']}->start_date = $startDate->toDateString();
        }

        if($validatedData['end_date'] !== null){
            $endDate = Carbon::parse($validatedData['end_date']);
            $steps->{$validatedData['step']}->end_date = $endDate->toDateString();
        }

        $project->steps = json_encode($steps);
        $project->save();

        return response()->json($project, 200);
    }

    /**
    *   @OA\Post(
    *     path="/api/projects/{project_id}/planification-to-captation",
    *     tags={"Step"},
    *     summary="Planification to captation",
    *     description="Planification to captation",
    *     operationId="PlanificationToCaptation",
    *     @OA\Parameter(
    *         description="Project id",
    *         in="path",
    *         name="project_id",
    *         required=true,
    *         @OA\Schema(
    *             type="integer",
    *             format="int64"
    *         )
    *     ),
    *     @OA\Response(
    *         response=200,
    *         description="Project",
    *         @OA\JsonContent(
    *             @OA\Property(property="id", type="integer", example="1"),
    *             @OA\Property(property="title", type="string", example="Project title"),
    *             @OA\Property(property="description", type="string", example="Project description"),
    *             @OA\Property(property="status", type="string", example="ongoing"),
    *             @OA\Property(property="created_at", type="string", example="2021-05-05T14:48:00.000000Z"),
    *             @OA\Property(property="updated_at", type="string", example="2021-05-05T14:48:00.000000Z"),
    *             @OA\Property(property="project_request_id", type="integer", example="1"),
    *         ),
    *     ))
    */
    public function planificationToCaptation(Request $request, $project_id){

        $project = Project::find($project_id);

        if ($project === null) {
            return response()->json(['error' => 'Project not found.'], 404);
        }

        $steps = json_decode($project->steps);

        if(!isset($steps->Planning) || $steps->Planning->status !== 'ongoing'){
            return response()->json(['error' => 'Planning is not ongoing.'], 400);
        }

        // Il faut que chaque step ait une date de début et de fin
        foreach ($steps as $step => $value) {
            if($value->start_date === null || $value->end_date === null){
                return response()->json(['error' => 'Step ' . $step . ' has no start date or end date.'], 400);
            }
        }

        // on regarde si le projet à une équipe
        if(!$project->team){
            return response()->json(['error' => 'Project has no team.'], 400);
        }

        $controller = new UserController();
        $roles = $controller->getRoles($request)->getData();
        // dans role on enlève le role cursus_director
        $roles = array_diff($roles, ['cursus_director']);

        $rolesFromTeam = $project->team->users->map(function ($user) {
            return $user->role;
        })->unique()->values()->toArray();

        foreach ($roles as $role) {
            if(!in_array($role, $rolesFromTeam)){
                return response()->json(['error' => 'Role ' . $role . ' is not in the team.'], 400);
            }
        }

        // on regarde si le projet à une salle
        if(!$project->reservations){
            return response()->json(['error' => 'Project has no room reservation.'], 400);
        }

        // on mets la step planning en done
        $steps->Planning->status = 'done';

        // on mets la step captation en ongoing
        $steps->Capture->status = 'ongoing';

        $project->steps = json_encode($steps);
        $project->save();

        return response()->json($project, 200);

    }

    /**
    *  @OA\Post(
    *     path="/api/projects/{project_id}/captation-to-postproduction",
    *     tags={"Step"},
    *     summary="Captation to postproduction",
    *     description="Captation to postproduction",
    *     operationId="CaptationToPostproduction",
    *     @OA\Parameter(
    *         description="Project id",
    *         in="path",
    *         name="project_id",
    *         required=true,
    *         @OA\Schema(
    *             type="integer",
    *             format="int64"
    *         )
    *     ),
    *     @OA\Response(
    *         response=200,
    *         description="Project",
    *         @OA\JsonContent(
    *             @OA\Property(property="id", type="integer", example="1"),
    *             @OA\Property(property="title", type="string", example="Project title"),
    *             @OA\Property(property="description", type="string", example="Project description"),
    *             @OA\Property(property="status", type="string", example="ongoing"),
    *             @OA\Property(property="created_at", type="string", example="2021-05-05T14:48:00.000000Z"),
    *             @OA\Property(property="updated_at", type="string", example="2021-05-05T14:48:00.000000Z"),
    *             @OA\Property(property="project_request_id", type="integer", example="1"),
    *         ),
    *     ))
    */
    public function captationToPostProd(Request $request, $project_id){

        $project = Project::find($project_id);

        if ($project === null) {
            return response()->json(['error' => 'Project not found.'], 404);
        }

        $steps = json_decode($project->steps);

        if(!isset($steps->Capture) || $steps->Capture->status !== 'ongoing'){
            return response()->json(['error' => 'Capture is not ongoing.'], 400);
        }

        // Il faut que Capture ait un link non null
        if($steps->Capture->link === null){
            return response()->json(['error' => 'Capture has no link.'], 400);
        }

        // Sinon on passe son status à done et on mets Post-Production en ongoing
        $steps->Capture->status = 'done';
        $steps->{'Post-Production'}->status = 'ongoing';

        $project->steps = json_encode($steps);
        $project->save();

        return $project->steps;
    }

}