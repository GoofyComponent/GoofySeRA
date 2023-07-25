<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\ProjectRequest;

class ProjectRequestController extends Controller
{
    /**
     * Display a listing of the resource.
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

            $projectRequestsQuery->with('user');

            $maxPerPage = $request->input('maxPerPage', 10); // Default to 10 if not specified

            $projectRequests = $projectRequestsQuery->paginate($maxPerPage);

            return $projectRequests;
        } catch (\Exception $exception) {
            return response()->json(['error' => 'Failed to retrieve project requests'], 500);
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
     * Display the specified resource.
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
     * Update the specified resource in storage.
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
