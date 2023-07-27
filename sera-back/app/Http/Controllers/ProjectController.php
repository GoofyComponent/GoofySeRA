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

        //Get the limit parameter from the query string
        $limit = $request->input('limit', null);

        //If limit is specified, return a limited number of results
        if ($limit) {
            $projects = Project::limit($limit)->get();
            return $projects;
        }

        $maxPerPage = $request->input('maxPerPage', 10); // Default to 10 if not specified
        $projects = Project::with('Team.users')->paginate($maxPerPage);
        // $projects = Project::all()->load('Team.users');

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
        // color need to be an HEX color
        $validated = $request->validate([
            'project_request_id' => 'required|integer|exists:project_requests,id',
            'title' => 'required|string',
            'description' => 'required|string',
            'color' => 'string|regex:/^#[a-f0-9]{6}$/i',
        ]);

        $project = new Project();
        $project->project_request_id = $validated['project_request_id'];
        $project->title = $validated['title'];
        $project->description = $validated['description'];
        if ($request->has('color')) {
            $project->color = ColorHelper::convertToTailwindGradient(ColorHelper::generateRandomGradientColor($validated['color']));
        }else{
            $project->color = ColorHelper::convertToTailwindGradient(ColorHelper::generateRandomGradientColor());
        }
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
    public function update(Request $request, $id): JsonResponse
    {
        $validated = $request->validate([
            'title' => 'string',
            'description' => 'string',
            'start_date' => 'date',
            'end_date' => 'date',
            'status' => 'string|in:ongoing,completed,cancelled',
            // color is an hex color or the string 'random'
            'color' => 'string',
        ]);

        $project = Project::find($id);

        if ($project === null) {
            throw new \Exception('Project not found.');
        }

        $project->fill($validated);

        // if color is set to random, generate a random color else it need to be an hex color (regex)
        if ($request->has('color')) {
            if ($validated['color'] === 'random') {
                $project->color = ColorHelper::convertToTailwindGradient(ColorHelper::generateRandomGradientColor());
            } else {
                $project->color = ColorHelper::convertToTailwindGradient(ColorHelper::generateRandomGradientColor($validated['color']));
            }
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