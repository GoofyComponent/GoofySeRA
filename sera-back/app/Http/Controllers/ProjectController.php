<?php

namespace App\Http\Controllers;

use Carbon\Carbon;
use App\Models\Team;
use App\Models\Project;
use Illuminate\Support\Js;
use App\Helpers\ColorHelper;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class ProjectController extends Controller
{
    /**
     * @OA\Get(
     *     path="/api/projects",
     *     summary="Get all projects",
     *     description="Get all projects",
     *     operationId="getProjects",
     *     tags={"Projects"},
     *     @OA\Parameter(
     *         description="Number of items per page",
     *         in="query",
     *         name="maxPerPage",
     *         required=false,
     *         @OA\Schema(
     *             type="integer",
     *             default=10
     *         )
     *     ),
     *     @OA\Parameter(
     *         description="Sort order",
     *         in="query",
     *         name="sort",
     *         required=false,
     *         @OA\Schema(
     *             type="string",
     *             default="asc"
     *         )
     *     ),
     *    @OA\Parameter(
     *       description="Filter by status",
     *       in="query",
     *       name="status",
     *       required=false,
     *       @OA\Schema(
     *          type="string",
     *      )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Successful operation",
     *     ),
     *     @OA\Response(
     *         response=401,
     *         description="Unauthenticated"
     *     ),
     *     @OA\Response(
     *         response=403,
     *         description="Forbidden"
     *     )
     * )
     */
    public function index(Request $request)
    {

        $request->validate([
            'maxPerPage' => 'integer',
            'sort' => 'string|in:asc,desc',
            'status' => 'string|in:ongoing,completed,cancelled',
        ]);

        $maxPerPage = $request->input('maxPerPage', 10);
        $sort = $request->input('sort', 'asc');

        if ($sort !== 'asc' && $sort !== 'desc') {
            throw new \Exception('Invalid sort parameter. Only "asc" or "desc" allowed.');
        }


        $query = Project::with('Team.users');

        $query->orderBy('updated_at', $sort);

        // Filter by status
        if ($request->has('status')) {
            $query->where('status', $request->input('status'));
        }

        $projects = $query->paginate($maxPerPage);

        if ($projects === null) {
            throw new \Exception('No projects found.');
        }



        foreach ($projects as $project) {
            $project->colors = json_decode($project->colors, true);

            // We get steps. Each step has start_date and end_date
            // Set project start_date and end_date properties with the oldest and the newest date
            $steps = json_decode($project->steps);
            $project->start_date = null;
            $project->end_date = null;

            foreach ($steps as $step) {
                $start_date = Carbon::parse($step->start_date);
                $end_date = Carbon::parse($step->end_date);

                if ($project->start_date === null || $start_date->lt($project->start_date)) {
                    $project->start_date = $start_date;
                }
                if ($project->end_date === null || $end_date->gt($project->end_date)) {
                    $project->end_date = $end_date;
                }
            }

        }

        return $projects;
    }

    /**
     * @OA\Post(
     *   path="/api/projects",
     *   summary="Create a project",
     *   description="Create a project",
     *   operationId="createProject",
     *   tags={"Projects"},
     *   @OA\RequestBody(
     *     @OA\MediaType(
     *       mediaType="application/json",
     *       @OA\Schema(
     *         @OA\Property(
     *           property="project_request_id",
     *           type="integer",
     *         ),
     *         @OA\Property(
     *           property="title",
     *           type="string",
     *         ),
     *         @OA\Property(
     *           property="description",
     *           type="string",
     *         ),
     *         required={"project_request_id", "title", "description"}
     *       )
     *     )
     *   ),
     *   @OA\Response(
     *     response=201,
     *     description="Successful operation",
     *     @OA\JsonContent(
     *       @OA\Property(
     *         property="id",
     *         type="integer",
     *       ),
     *       @OA\Property(
     *         property="project_request_id",
     *         type="integer",
     *       ),
     *       @OA\Property(
     *         property="title",
     *         type="string",
     *       ),
     *       @OA\Property(
     *         property="description",
     *         type="string",
     *       ),
     *       @OA\Property(
     *         property="colors",
     *         type="string",
     *       ),
     *       @OA\Property(
     *         property="created_at",
     *         type="string",
     *       ),
     *       @OA\Property(
     *         property="updated_at",
     *         type="string",
     *       ),
     *     ),
     *   ),
     *   @OA\Response(
     *     response=400,
     *     description="Bad request"
     *   ),
     *   @OA\Response(
     *     response=401,
     *     description="Unauthenticated"
     *   ),
     *   @OA\Response(
     *     response=403,
     *     description="Forbidden"
     *   )
     * )
     */
    public function store(Request $request)
    {
        // color need to be an HEX color
        $validated = $request->validate([
            'project_request_id' => 'required|integer|exists:project_requests,id',
            'title' => 'required|string',
            'description' => 'required|string',
        ]);

        $project = new Project();
        $project->project_request_id = $validated['project_request_id'];
        $project->title = $validated['title'];
        $project->description = $validated['description'];
        $project->colors = json_encode(ColorHelper::prettyHexadecimal(150));
        $project->steps = json_encode(config('steps'));
        $project->save();

        $team = new Team();
        $team->project_id = $project->id;
        $team->save();

        return response()->json($project, 201);
    }

    /**
     * @OA\Get(
     *     path="/api/projects/{id}",
     *     summary="Get a project",
     *     description="Get a project",
     *     operationId="getProject",
     *     tags={"Projects"},
     *     @OA\Parameter(
     *         description="ID of project to return",
     *         in="path",
     *         name="id",
     *         required=true,
     *         @OA\Schema(
     *             type="integer"
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Successful operation",
     *         @OA\JsonContent(
     *             @OA\Property(
     *                 property="id",
     *                 type="integer"
     *             ),
     *             @OA\Property(
     *                 property="project_request_id",
     *                 type="integer"
     *             ),
     *             @OA\Property(
     *                 property="title",
     *                 type="string"
     *             ),
     *             @OA\Property(
     *                 property="description",
     *                 type="string"
     *             ),
     *             @OA\Property(
     *                 property="colors",
     *                 type="string"
     *             ),
     *             @OA\Property(
     *                 property="created_at",
     *                 type="string"
     *             ),
     *             @OA\Property(
     *                 property="updated_at",
     *                 type="string"
     *             ),
     *         ),
     *     ),
     *     @OA\Response(
     *         response=400,
     *         description="Bad request"
     *     ),
     *     @OA\Response(
     *         response=401,
     *         description="Unauthenticated"
     *     ),
     *     @OA\Response(
     *         response=403,
     *         description="Forbidden"
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="Not found"
     *     )
     * )
     */
    public function show($id)
    {
        $project = Project::where('id', $id)->with('Team.users')->first();
        if ($project === null) {
            throw new \Exception('Project not found.');
        }

        $project->colors = json_decode($project->colors, true);
        // We get steps. Each step has start_date and end_date
        // Set project start_date and end_date properties with the oldest and the newest date
        $steps = json_decode($project->steps);
        $project->start_date = null;
        $project->end_date = null;

        foreach ($steps as $step) {
            $start_date = Carbon::parse($step->start_date);
            $end_date = Carbon::parse($step->end_date);

            if ($project->start_date === null || $start_date->lt($project->start_date)) {
                $project->start_date = $start_date;
            }
            if ($project->end_date === null || $end_date->gt($project->end_date)) {
                $project->end_date = $end_date;
            }
        }

        $project->reservations = $project->reservations()->get();

        return $project;
    }

    /** @OA\Put(
     *     path="/api/projects/{id}",
     *     summary="Update a project",
     *     description="Update a project",
     *     operationId="updateProject",
     *     tags={"Projects"},
     *     @OA\Parameter(
     *         description="ID of project to update",
     *         in="path",
     *         name="id",
     *         required=true,
     *         @OA\Schema(
     *             type="integer"
     *         )
     *     ),
     *     @OA\RequestBody(
     *       @OA\MediaType(
     *         mediaType="application/json",
     *         @OA\Schema(
     *           @OA\Property(
     *             property="title",
     *             type="string",
     *           ),
     *           @OA\Property(
     *             property="description",
     *             type="string",
     *           ),
     *           @OA\Property(
     *             property="start_date",
     *             type="date",
     *           ),
     *           @OA\Property(
     *             property="end_date",
     *             type="date",
     *           ),
     *           @OA\Property(
     *             property="status",
     *             type="string",
     *             enum={"ongoing", "completed", "cancelled"},
     *           ),
     *           @OA\Property(
     *             property="change_color",
     *             type="boolean",
     *           ),
     *           required={"title", "description", "start_date", "end_date", "status", "change_color"}
     *         )
     *       )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Successful operation",
     *         @OA\JsonContent(
     *             @OA\Property(
     *                 property="id",
     *                 type="integer"
     *             ),
     *             @OA\Property(
     *                 property="project_request_id",
     *                 type="integer"
     *             ),
     *             @OA\Property(
     *                 property="title",
     *                 type="string"
     *             ),
     *             @OA\Property(
     *                 property="description",
     *                 type="string"
     *             ),
     *             @OA\Property(
     *                 property="colors",
     *                 type="string"
     *             ),
     *            @OA\Property(
     *                property="created_at",
     *               type="string"
     *           ),
     *          @OA\Property(
     *             property="updated_at",
     *            type="string"
     *       ),
     *    ),
     * ),
     * @OA\Response(
     *   response=400,
     *  description="Bad request"
     * ),
     * @OA\Response(
     *  response=401,
     * description="Unauthenticated"
     * ),
     * @OA\Response(
     * response=403,
     * description="Forbidden"
     * ),
     * @OA\Response(
     * response=404,
     * description="Not found"
     * )
     * )
     */
    public function update(Request $request, $id): JsonResponse
    {
        $validated = $request->validate([
            'title' => 'string',
            'description' => 'string',
            'start_date' => 'date',
            'end_date' => 'date',
            'status' => 'string|in:ongoing,completed,cancelled',
            'change_color' => 'boolean',
        ]);

        $project = Project::find($id);

        if ($project === null) {
            throw new \Exception('Project not found.');
        }

        $project->fill($validated);

        if ($request->has('change_color') && $request->input('change_color')) {
            $project->colors = json_encode(ColorHelper::prettyHexadecimal(150));
        }

        $project->save();

        return response()->json($project);
    }


    /**
     * @OA\Delete(
     *     path="/api/projects/{id}",
     *     summary="Delete a project",
     *     description="Delete a project",
     *     operationId="deleteProject",
     *     tags={"Projects"},
     *     @OA\Parameter(
     *         description="ID of project to delete",
     *         in="path",
     *         name="id",
     *         required=true,
     *         @OA\Schema(
     *             type="integer"
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Successful operation",
     *         @OA\JsonContent(
     *             @OA\Property(
     *                 property="message",
     *                 type="string"
     *             )
     *         )
     *     ),
     *     @OA\Response(
     *         response=400,
     *         description="Bad request"
     *     ),
     *     @OA\Response(
     *         response=401,
     *         description="Unauthenticated"
     *     ),
     *     @OA\Response(
     *         response=403,
     *         description="Forbidden"
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="Not found"
     *     )
     * )
     */
    public function destroy($id)
    {
        $project = Project::find($id);

        if ($project === null) {
            throw new \Exception('Project not found.');
        }

        $project->delete();

        return response()->json(['message' => 'Project deleted.']);
    }
}
