<?php

namespace App\Http\Controllers;

use App\Models\Team;
use Illuminate\Http\Request;

class TeamController extends Controller
{
    /**
     * @OA\Get(
     *     path="/api/teams",
     *     tags={"Team"},
     *     summary="Get teams",
     *     description="Get teams",
     *     operationId="GetTeams",
     *     @OA\Parameter(
     *         name="maxPerPage",
     *         in="query",
     *         description="Max number of teams per page",
     *         required=false,
     *         @OA\Schema(
     *             type="integer",
     *             default=10
     *         )
     *     ),
     *     @OA\Parameter(
     *         name="sort",
     *         in="query",
     *         description="Sort teams by updated_at",
     *         required=false,
     *         @OA\Schema(
     *             type="string",
     *             default="asc"
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Teams retrieved",
     *         @OA\JsonContent(
     *             @OA\Property(property="current_page", type="integer", example="1"),
     *             @OA\Property(property="data", type="array", @OA\Items(
     *                 @OA\Property(property="id", type="integer", example="1"),
     *                 @OA\Property(property="project_id", type="integer", example="1"),
     *                 @OA\Property(property="created_at", type="string", example="2021-05-05T14:48:00.000000Z"),
     *                 @OA\Property(property="updated_at", type="string", example="2021-05-05T14:48:00.000000Z"),
     *                 @OA\Property(property="users", type="array", @OA\Items(
     *                     @OA\Property(property="id", type="integer", example="1"),
     *                     @OA\Property(property="name", type="string", example="John Doe"),
     *                     @OA\Property(property="email", type="string", example="johndoe@gmail.com"),
     *                     @OA\Property(property="email_verified_at", type="string", example="2021-05-05T14:48:00.000000Z"),
     *                 )),
     *             )),
     *             @OA\Property(property="first_page_url", type="string", example="http://localhost:8000/api/teams?page=1"),
     *             @OA\Property(property="from", type="integer", example="1"),
     *             @OA\Property(property="last_page", type="integer", example="1"),
     *             @OA\Property(property="last_page_url", type="string", example="http://localhost:8000/api/teams?page=1"),
     *             @OA\Property(property="links", type="array", @OA\Items(
     *                 @OA\Property(property="url", type="string", example="http://localhost:8000/api/teams?page=1"),
     *                 @OA\Property(property="label", type="string", example="1"),
     *                 @OA\Property(property="active", type="boolean", example="true"),
     *             )),
     *             @OA\Property(property="next_page_url", type="string", example="null"),
     *             @OA\Property(property="path", type="string", example="http://localhost:8000/api/teams"),
     *             @OA\Property(property="per_page", type="integer", example="10"),
     *             @OA\Property(property="prev_page_url", type="string", example="null"),
     *             @OA\Property(property="to", type="integer", example="1"),
     *             @OA\Property(property="total", type="integer", example="1"),
     *         ),
     *     ),
     *     @OA\Response(
     *         response=400,
     *         description="Bad request",
     *         @OA\JsonContent(
     *             @OA\Property(property="error", type="string", example="Invalid sort parameter. Only 'asc' or 'desc' allowed."),
     *         ),
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="No teams found",
     *         @OA\JsonContent(
     *             @OA\Property(property="error", type="string", example="No teams found."),
     *         ),
     *     ),
     * )
     */
    public function index(Request $request)
    {
        // Validate the request parameters
        $validated = $request->validate([
            'maxPerPage' => 'integer',
            'sort' => 'string|in:asc,desc',
        ]);

        $maxPerPage = $request->input('maxPerPage', 10); // Default to 10 if not specified

        // Sort by updated_at (optional)
        $sort = $request->input('sort', 'asc'); // Default to asc if not specified
        // Validate if the sort parameter is 'asc' or 'desc'
        if ($sort !== 'asc' && $sort !== 'desc') {
            return response()->json(['error' => 'Invalid sort parameter. Only "asc" or "desc" allowed.'], 400);
        }

        // Retrieve teams with users
        $teams = Team::with('users')->orderBy('updated_at', $sort)->paginate($maxPerPage);

        if ($teams->isEmpty()) {
            return response()->json(['error' => 'No teams found.'], 404);
        }

        return $teams;
    }

    /**
     * @OA\Get(
     *     path="/api/teams/{projectId}",
     *     tags={"Team"},
     *     summary="Get team",
     *     description="Get team",
     *     operationId="GetTeam",
     *     @OA\Parameter(
     *         name="projectId",
     *         in="path",
     *         description="Project ID",
     *         required=true,
     *         @OA\Schema(
     *             type="integer",
     *             default=1
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Team retrieved",
     *         @OA\JsonContent(
     *             @OA\Property(property="id", type="integer", example="1"),
     *             @OA\Property(property="project_id", type="integer", example="1"),
     *             @OA\Property(property="created_at", type="string", example="2021-05-05T14:48:00.000000Z"),
     *             @OA\Property(property="updated_at", type="string", example="2021-05-05T14:48:00.000000Z"),
     *             @OA\Property(property="users", type="array", @OA\Items(
     *                 @OA\Property(property="id", type="integer", example="1"),
     *                 @OA\Property(property="name", type="string", example="John Doe"),
     *                 @OA\Property(property="email", type="string", example="johndoe@gmail.com"),
     *                @OA\Property(property="email_verified_at", type="string", example="2021-05-05T14:48:00.000000Z"),
     *            )),
     *        ),
     *   ),
     *  @OA\Response(
     *     response=400,
     *    description="Bad request",
     *    @OA\JsonContent(
     *      @OA\Property(property="error", type="string", example="Team not found."),
     *   ),
     * ),
     * )
     */
    public function show($projectId)
    {
        $team = Team::where('project_id', $projectId)->with('users')->first();

        if ($team === null) {
            return response()->json(['error' => 'Team not found.'], 400);
        }

        return $team;
    }


    /**
     * @OA\Post(
     *     path="/api/teams/{projectId}/add",
     *     tags={"Team"},
     *     summary="Add user to team",
     *     description="Add user to team",
     *     operationId="AddUserToTeam",
     *     @OA\Parameter(
     *         name="projectId",
     *         in="path",
     *         description="Project ID",
     *         required=true,
     *         @OA\Schema(
     *             type="integer",
     *             default=1
     *         )
     *     ),
     *     @OA\RequestBody(
     *         required=true,
     *         description="Add user to team",
     *         @OA\JsonContent(
     *             required={"user_id"},
     *             @OA\Property(property="user_id", type="integer", example="1"),
     *         ),
     *     ),
     *     @OA\Response(
     *         response=201,
     *         description="User added to team",
     *         @OA\JsonContent(
     *             @OA\Property(property="id", type="integer", example="1"),
     *             @OA\Property(property="project_id", type="integer", example="1"),
     *             @OA\Property(property="created_at", type="string", example="2021-05-05T14:48:00.000000Z"),
     *             @OA\Property(property="updated_at", type="string", example="2021-05-05T14:48:00.000000Z"),
     *             @OA\Property(property="users", type="array", @OA\Items(
     *                 @OA\Property(property="id", type="integer", example="1"),
     *                 @OA\Property(property="name", type="string", example="John Doe"),
     *                 @OA\Property(property="email", type="string", example="johndoe@gmail.com"),
     *                @OA\Property(property="email_verified_at", type="string", example="2021-05-05T14:48:00.000000Z"),
     *           )),
     *       ),
     *  ),
     * @OA\Response(
     *    response=400,
     *   description="Bad request",
     *  @OA\JsonContent(
     *   @OA\Property(property="error", type="string", example="User already in team."),
     * ),
     * ),
     * )
     */
    public function update(Request $request, $projectId)
    {
        $validated = $request->validate([
            'user_id' => 'required|integer|exists:users,id',
        ]);

        $team = Team::where('project_id', $projectId)->first();

        if ($team === null) {
            $team = new Team();
            $team->project_id = $projectId;
            $team->save();
        }

        if ($team->hasUser($validated['user_id'])) {
            return response()->json(['error' => 'User already in team.'], 400);
        }

        $team->addUser($validated['user_id'], $team->id);

        $team->refresh();

        return response()->json($team, 201);
    }

    /**
     * @OA\Post(
     *     path="/api/teams/{projectId}/remove/{userId}",
     *     tags={"Team"},
     *     summary="Remove user from team",
     *     description="Remove user from team",
     *     operationId="RemoveUserFromTeam",
     *     @OA\Parameter(
     *         name="projectId",
     *         in="path",
     *         description="Project ID",
     *         required=true,
     *         @OA\Schema(
     *             type="integer",
     *             default=1
     *         )
     *     ),
     *     @OA\Parameter(
     *         name="userId",
     *         in="path",
     *         description="User ID",
     *         required=true,
     *         @OA\Schema(
     *             type="integer",
     *             default=1
     *         )
     *     ),
     *     @OA\Response(
     *         response=201,
     *         description="User removed from team",
     *         @OA\JsonContent(
     *             @OA\Property(property="id", type="integer", example="1"),
     *             @OA\Property(property="project_id", type="integer", example="1"),
     *             @OA\Property(property="created_at", type="string", example="2021-05-05T14:48:00.000000Z"),
     *             @OA\Property(property="updated_at", type="string", example="2021-05-05T14:48:00.000000Z"),
     *             @OA\Property(property="users", type="array", @OA\Items(
     *                 @OA\Property(property="id", type="integer", example="1"),
     *                 @OA\Property(property="name", type="string", example="John Doe"),
     *                 @OA\Property(property="email", type="string", example="johndoe@gmail.com"),
     *                @OA\Property(property="email_verified_at", type="string", example="2021-05-05T14:48:00.000000Z"),
     *          )),
     *     ),
     * ),
     * @OA\Response(
     *   response=400,
     *   description="Bad request",
     * @OA\JsonContent(
     *      @OA\Property(property="error", type="string", example="User not in team."),
     * ),
     * ),
     * )
     */
    public function remove($projectId, $userId)
    {
        $team = Team::where('project_id', $projectId)->first();

        if ($team === null) {
            return response()->json(['error' => 'Team not found.'], 400);
        }

        // we check if the user is already in the team
        if (!$team->hasUser($userId)) {
            return response()->json(['error' => 'User not in team.'], 400);
        }

        $team->removeUser($userId);

        $team->refresh();

        return response()->json($team, 201);
    }
}
