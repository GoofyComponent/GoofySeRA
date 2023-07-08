<?php

namespace App\Http\Controllers;

use App\Models\Team;
use Illuminate\Http\Request;

class TeamController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $teams = Team::all();

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
        $team = Team::where('project_id', $projectId)->first();

        if ($team === null) {
            throw new \Exception('Team not found.');
        }

        return $team;
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request,$projectId)
    {
        $roles = array_keys(config('roles'));
        // for each role validate with an array for request validation
        // a role is like that : "cursus_director" => [0,3,7]

        foreach ($roles as $role) {
            $validated = $request->validate([
                $role => 'array',
            ]);
        }

        $team = Team::where('project_id', $projectId)->first();

        if ($team === null) {
            throw new \Exception('Team not found.');
        }

        foreach ($roles as $role) {
            if (!isset($validated[$role])) {
                continue;
            }
            $team->$role = $validated[$role];
        }

        $team->save();

        return response()->json($team, 201);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($projectId)
    {
        $team = Team::where('project_id', $projectId)->first();

        if ($team === null) {
            throw new \Exception('Team not found.');
        }

        $team->delete();

        return response()->json(null, 204);
    }
}
