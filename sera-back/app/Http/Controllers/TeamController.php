<?php

namespace App\Http\Controllers;

use App\Models\Team;
use Illuminate\Http\Request;

class TeamController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $maxPerPage = $request->input('maxPerPage', 10); // Default to 10 if not specified

        $teams = Team::with('users')->paginate($maxPerPage);

        if ($teams === null) {
            throw new \Exception('No teams found.');
        }

        return $teams;
    }


    /**
     * Display the specified resource.
     */
    public function show($projectId)
    {
        $team = Team::where('project_id', $projectId)->with('users')->first();

        if ($team === null) {
            throw new \Exception('Team not found.');
        }

        return $team;
    }

    /**
     * Update the specified resource in storage.
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

        // we check if the user is already in the team
        if ($team->hasUser($validated['user_id'])) {
            return response()->json(['error' => 'User already in team.'], 400);
        }

        $team->addUser($validated['user_id'], $team->id);

        $team->refresh();

        return response()->json($team, 201);
    }

    public function remove($projectId, $userId)
    {
        $team = Team::where('project_id', $projectId)->first();

        if ($team === null) {
            throw new \Exception('Team not found.');
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
