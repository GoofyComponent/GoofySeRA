<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\ProjectRequest;
use SebastianBergmann\CodeCoverage\Report\Xml\Project;

class StepController extends Controller
{

    public function StepZeroToOne(Request $request, $projectRequestId)
    {

        $validatedData = $request->validate([
            'title' => 'required|string',
            'description' => 'required|string',
        ]);


        $projectRequest = ProjectRequest::find($projectRequestId);

        if ($projectRequest === null) {
            return response()->json(['error' => 'Project request not found.'], 404);
        }

        if ($projectRequest->status !== 'pending') {
            return response()->json(['error' => 'Project request already processed.'], 400);
        }

        $projectRequest->status = 'accepted';

        $projectController = new ProjectController();
        $project = $projectController->store(new Request([
            'project_request_id' => $projectRequest->id,
            'title' => $validatedData['title'],
            'description' => $validatedData['description'],
            'status' => 'ongoing',
        ]));

        $projectRequest->save();

        return response()->json($project, 201);
    }
}
