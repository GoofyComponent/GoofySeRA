<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\ProjectRequest;

class ProjectRequestController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        try {
            return ProjectRequest::all();
        } catch (\Exception $e) {
            return response()->json(['error' => 'Project requests not found.'], 404);
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'priority' => 'required|integer',
            'title' => 'required|string|max:100',
            'description' => 'required|string',
        ]);

        $user = $request->user();

        $projectRequest = new ProjectRequest();
        $projectRequest->user_id = $user->id;
        $projectRequest->priority = $validatedData['priority'];
        $projectRequest->title = $validatedData['title'];
        $projectRequest->description = $validatedData['description'];
        $projectRequest->save();

        return response()->json($projectRequest, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $projectRequest = ProjectRequest::find($id);

        if ($projectRequest === null) {
            return response()->json(['error' => 'Project request not found.'], 404);
        }

        return response()->json($projectRequest);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $projectRequest = ProjectRequest::find($id);

        if ($projectRequest === null) {
            return response()->json(['error' => 'Project request not found.'], 404);
        }

        $validatedData = $request->validate([
            'priority' => 'required|integer',
            'title' => 'required|string|max:100',
            'description' => 'required|string',
        ]);

        $projectRequest->priority = $validatedData['priority'];
        $projectRequest->title = $validatedData['title'];
        $projectRequest->description = $validatedData['description'];
        $projectRequest->save();

        return response()->json($projectRequest);
    }

    /**
     * Remove the specified resource from storage.
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
