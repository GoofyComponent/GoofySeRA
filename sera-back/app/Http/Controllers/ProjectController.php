<?php

namespace App\Http\Controllers;

use App\Models\Team;
use App\Models\Project;
use Illuminate\Support\Js;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class ProjectController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $projects = Project::all()->load('Team.users');

        if ($projects === null) {
            throw new \Exception('No projects found.');
        }

        return $projects;
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'project_request_id' => 'required|integer|exists:project_requests,id',
            'title' => 'required|string',
            'description' => 'required|string',
        ]);

        $project = new Project();
        $project->project_request_id = $validated['project_request_id'];
        $project->title = $validated['title'];
        $project->description = $validated['description'];
        $project->save();

        $team = new Team();
        $team->project_id = $project->id;
        $team->save();

        return response()->json($project, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $project = Project::where('id', $id)->with('Team.users')->first();
        if ($project === null) {
            throw new \Exception('Project not found.');
        }

        return $project;
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id) : JsonResponse
    {
        $validated = $request->validate([
            'title' => 'string',
            'description' => 'string',
            'start_date' => 'date',
            'end_date' => 'date',
            'status' => 'string|in:pending,ongoing,finished',
        ]);

        $project = Project::find($id);

        if ($project === null) {
            throw new \Exception('Project not found.');
        }

        $project->fill($validated);
        $project->save();

        return response()->json($project);
    }

    /**
     * Remove the specified resource from storage.
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
