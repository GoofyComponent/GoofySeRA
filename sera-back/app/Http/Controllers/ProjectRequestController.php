<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\ProjectRequest;

class ProjectRequestController extends Controller
{
    /**
     * @OA\Get(
     *     path="/api/projects-requests",
     *     summary="Get all project requests",
     *     tags={"Project Requests"},
     *     @OA\Parameter(
     *         name="status",
     *         in="query",
     *         description="Filter by status",
     *         required=false,
     *         @OA\Schema(
     *             type="string",
     *             enum={"pending", "accepted", "rejected"}
     *         )
     *     ),
     *     @OA\Parameter(
     *         name="priority",
     *         in="query",
     *         description="Filter by priority",
     *         required=false,
     *         @OA\Schema(
     *             type="string",
     *             enum={"high", "low", "medium"}
     *         )
     *     ),
     *     @OA\Parameter(
     *         name="sort",
     *         in="query",
     *         description="Sort by updated_at",
     *         required=false,
     *         @OA\Schema(
     *             type="string",
     *             enum={"asc", "desc"}
     *         )
     *     ),
     *     @OA\Parameter(
     *         name="maxPerPage",
     *         in="query",
     *         description="Max number of project requests per page",
     *         required=false,
     *         @OA\Schema(
     *             type="integer",
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="List of project requests",
     *     ),
     *     @OA\Response(
     *         response=400,
     *         description="Invalid status parameter",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(
     *                 property="error",
     *                 type="string",
     *                 example="Invalid status"
     *             )
     *         )
     *     ),
     *     @OA\Response(
     *         response=500,
     *         description="Failed to retrieve project requests",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(
     *                 property="error",
     *                 type="string",
     *                 example="Failed to retrieve project requests"
     *             )
     *         )
     *     )
     * )
     */
    public function index(Request $request)
    {
        try {
            $projectRequestsQuery = ProjectRequest::query();
            $statusArrayConfig = ['pending', 'accepted', 'rejected'];
            // Search by status (optional)
            if (request()->filled('status')) {
                $status = request()->input('status');
                if (!in_array($status, $statusArrayConfig)) {
                    return response()->json(['error' => 'Invalid status'], 400);
                }
                $projectRequestsQuery->where('status', $status);
            }

            // Search by priority (optional)
            if (request()->filled('priority')) {
                $priority = request()->input('priority');
                $projectRequestsQuery->where('priority', $priority);
            }

            // Sort by updated_at (optional)
            $sort = $request->input('sort', 'asc'); // Default to asc if not specified
            // Validate if the sort parameter is 'asc' or 'desc'
            if ($sort !== 'asc' && $sort !== 'desc') {
                return response()->json(['error' => 'Invalid sort parameter. Only "asc" or "desc" allowed.'], 400);
            }
            $projectRequestsQuery->orderBy('updated_at', $sort);

            $projectRequestsQuery->with('user');

            $maxPerPage = $request->input('maxPerPage', 10); // Default to 10 if not specified

            $projectRequests = $projectRequestsQuery->paginate($maxPerPage);

            return $projectRequests;
        } catch (\Exception $exception) {
            return response()->json(['error' => 'Failed to retrieve project requests'], 500);
        }
    }


    /**
     * @OA\Post(
     *    path="/api/projects-requests",
     *    summary="Create a project request",
     *    tags={"Project Requests"},
     *    @OA\RequestBody(
     *        required=true,
     *        description="Project request data",
     *        @OA\JsonContent(
     *            required={"priority", "title", "description", "needs", "status"},
     *            @OA\Property(property="priority", type="integer", example="1"),
     *            @OA\Property(property="title", type="string", example="Project title"),
     *            @OA\Property(property="description", type="string", example="Project description"),
     *            @OA\Property(property="needs", type="string", example="Project needs"),
     *            @OA\Property(property="status", type="string", example="pending")
     *        )
     *    ),
     *    @OA\Response(
     *        response=201,
     *        description="Project request created",
     *        @OA\JsonContent(
     *            @OA\Property(property="id", type="integer", example="1"),
     *            @OA\Property(property="priority", type="integer", example="1"),
     *            @OA\Property(property="title", type="string", example="Project title"),
     *            @OA\Property(property="description", type="string", example="Project description"),
     *            @OA\Property(property="needs", type="string", example="Project needs"),
     *            @OA\Property(property="status", type="string", example="pending"),
     *            @OA\Property(property="user_id", type="integer", example="1"),
     *            @OA\Property(property="created_at", type="string", format="date-time", example="2021-01-01 00:00:00"),
     *            @OA\Property(property="updated_at", type="string", format="date-time", example="2021-01-01 00:00:00")
     *        )
     *    ),
     *    @OA\Response(
     *        response=400,
     *        description="Invalid data",
     *        @OA\JsonContent(
     *            @OA\Property(property="priority", type="string", example="The priority field is required."),
     *            @OA\Property(property="title", type="string", example="The title field is required."),
     *            @OA\Property(property="description", type="string", example="The description field is required."),
     *            @OA\Property(property="needs", type="string", example="The needs field is required."),
     *            @OA\Property(property="status", type="string", example="The status field is required.")
     *        )
     *    )
     * )
     */
    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'priority' => 'required|integer',
            'title' => 'required|string|max:100',
            'description' => 'required|string',
            'needs' => 'required|string',
            'status' => 'required|string'
        ]);

        $user = $request->user();

        $projectRequest = new ProjectRequest();
        $projectRequest->user_id = $user->id;
        $projectRequest->priority = $validatedData['priority'];
        $projectRequest->title = $validatedData['title'];
        $projectRequest->description = $validatedData['description'];
        $projectRequest->needs = $validatedData['needs'];
        $projectRequest->status = $validatedData['status'];
        $projectRequest->save();

        return response()->json($projectRequest, 201);
    }

    /**
     * @OA\Get(
     *     path="/api/projects-requests/{id}",
     *     summary="Get a project request",
     *     tags={"Project Requests"},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         description="Project request id",
     *         required=true,
     *         @OA\Schema(
     *             type="integer",
     *             format="int64"
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Project request",
     *         @OA\JsonContent(
     *             @OA\Property(property="id", type="integer", example="1"),
     *             @OA\Property(property="priority", type="integer", example="1"),
     *             @OA\Property(property="title", type="string", example="Project title"),
     *             @OA\Property(property="description", type="string", example="Project description"),
     *             @OA\Property(property="needs", type="string", example="Project needs"),
     *             @OA\Property(property="status", type="string", example="pending"),
     *             @OA\Property(property="user_id", type="integer", example="1"),
     *             @OA\Property(property="created_at", type="string", format="date-time", example="2021-01-01 00:00:00"),
     *             @OA\Property(property="updated_at", type="string", format="date-time", example="2021-01-01 00:00:00")
     *         )
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="Project request not found",
     *         @OA\JsonContent(
     *             @OA\Property(property="error", type="string", example="Project request not found.")
     *         )
     *     )
     * )
     */
    public function show($id)
    {
        $projectRequest = ProjectRequest::find($id)->load('user');

        if ($projectRequest === null) {
            return response()->json(['error' => 'Project request not found.'], 404);
        }

        return response()->json($projectRequest);
    }

    /**
     * @OA\Put(
     *     path="/api/projects-requests/{id}",
     *     summary="Update a project request",
     *     tags={"Project Requests"},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         description="Project request id",
     *         required=true,
     *         @OA\Schema(
     *             type="integer",
     *             format="int64"
     *         )
     *     ),
     *     @OA\RequestBody(
     *         required=true,
     *         description="Project request data",
     *         @OA\JsonContent(
     *             required={"priority", "title", "description", "needs", "status"},
     *             @OA\Property(property="priority", type="integer", example="1"),
     *             @OA\Property(property="title", type="string", example="Project title"),
     *             @OA\Property(property="description", type="string", example="Project description"),
     *             @OA\Property(property="needs", type="string", example="Project needs"),
     *             @OA\Property(property="status", type="string", example="pending")
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Project request updated",
     *         @OA\JsonContent(
     *             @OA\Property(property="id", type="integer", example="1"),
     *             @OA\Property(property="priority", type="integer", example="1"),
     *             @OA\Property(property="title", type="string", example="Project title"),
     *             @OA\Property(property="description", type="string", example="Project description"),
     *             @OA\Property(property="needs", type="string", example="Project needs"),
     *             @OA\Property(property="status", type="string", example="pending"),
     *             @OA\Property(property="user_id", type="integer", example="1"),
     *             @OA\Property(property="created_at", type="string", format="date-time", example="2021-01-01 00:00:00"),
     *             @OA\Property(property="updated_at", type="string", format="date-time", example="2021-01-01 00:00:00")
     *         )
     *     ),
     *     @OA\Response(
     *         response=400,
     *         description="Invalid data",
     *         @OA\JsonContent(
     *             @OA\Property(property="priority", type="string", example="The priority field is required."),
     *             @OA\Property(property="title", type="string", example="The title field is required."),
     *             @OA\Property(property="description", type="string", example="The description field is required."),
     *             @OA\Property(property="needs", type="string", example="The needs field is required."),
     *             @OA\Property(property="status", type="string", example="The status field is required.")
     *         )
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="Project request not found",
     *         @OA\JsonContent(
     *             @OA\Property(property="error", type="string", example="Project request not found.")
     *         )
     *     )
     * )
     */

    public function update(Request $request, $id)
    {
        $projectRequest = ProjectRequest::find($id);

        if ($projectRequest === null) {
            return response()->json(['error' => 'Project request not found.'], 404);
        }

        $validatedData = $request->validate([
            'priority' => 'integer',
            'title' => 'string|max:100',
            'description' => 'string',
            'needs' => 'string',
            'status' => 'string|in:pending,accepted,rejected'
        ]);

        $projectRequest->fill($validatedData);
        $projectRequest->save();

        return response()->json($projectRequest);
    }

    /**
     * @OA\Delete(
     *   path="/api/projects-requests/{id}",
     *   summary="Delete a project request",
     *   tags={"Project Requests"},
     *   @OA\Parameter(
     *     name="id",
     *     in="path",
     *     description="Project request id",
     *     required=true,
     *     @OA\Schema(
     *       type="integer",
     *       format="int64"
     *     )
     *   ),
     *   @OA\Response(
     *     response=200,
     *     description="Project request deleted",
     *     @OA\JsonContent(
     *       @OA\Property(property="message", type="string", example="Project request deleted.")
     *     )
     *   ),
     *   @OA\Response(
     *     response=404,
     *     description="Project request not found",
     *     @OA\JsonContent(
     *       @OA\Property(property="error", type="string", example="Project request not found.")
     *     )
     *   )
     * )
     */
    public function destroy($id)
    {
        $projectRequest = ProjectRequest::find($id);

        if ($projectRequest === null) {
            return response()->json(['error' => 'Project request not found.'], 404);
        }

        $projectRequest->delete();

        return response()->json(['message' => 'Project request deleted.']);
    }
}
