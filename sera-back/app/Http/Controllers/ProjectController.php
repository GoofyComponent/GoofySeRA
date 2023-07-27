<?php

namespace App\Http\Controllers;

use App\Models\Team;
use App\Models\Project;
use Illuminate\Support\Js;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use App\Helpers\ColorHelper;

class ProjectController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {

        $request->validate([
            'maxPerPage' => 'integer',
            'sort' => 'string|in:asc,desc',
        ]);

        $maxPerPage = $request->input('maxPerPage', 10);
        $sort = $request->input('sort', 'asc');

        if ($sort !== 'asc' && $sort !== 'desc') {
            throw new \Exception('Invalid sort parameter. Only "asc" or "desc" allowed.');
        }

        $query = Project::with('Team.users');

        $query->orderBy('updated_at', $sort);

        $projects = $query->paginate($maxPerPage);

        if ($projects === null) {
            throw new \Exception('No projects found.');
        }

        foreach ($projects as $project) {
            $project->colors = json_decode($project->colors, true);
        }

        return $projects;
    }

    /**
     * Store a newly created resource in storage.
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

        $project->colors = json_decode($project->colors, true);

        return $project;
    }

    /**
     * Update the specified resource in storage.
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
