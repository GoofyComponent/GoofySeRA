<?php

namespace App\Http\Controllers;

use App\Models\Knowledge;
use Illuminate\Http\Request;

use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class KnowledgeController extends Controller
{
    public function index()
    {
        $knowledges = Knowledge::get();

        return response()->json($knowledges, 201);
    }

    public function store(Request $request)
    {
        $acceptedTypes = config('knowledge-type');

        $validated = $request->validate([
            'name' => 'required|string',
            'infos' => 'required|string',
            'type' => 'required|string|in:'.implode(',', $acceptedTypes),
            'image' => 'image|mimes:jpeg,png,jpg,gif,svg|max:2048',
        ]);

        $knowledge = new Knowledge();
        $knowledge->name = $validated['name'];
        $knowledge->infos = $validated['infos'];
        $knowledge->type = $validated['type'];

        if ($request->image != null) {
            $timestamp = time();
            $path = $request->image->storeAs(
                'knowledges',
                $timestamp . '.' . $request->image->extension(),
                's3'
            );
            if (!$path) {
                return response()->json([
                    'message' => 'Erreur lors de l\'upload du fichier'
                ], 400);
            }
            $knowledge->imageURL = $path;
        }

        $knowledge->save();

        return response()->json($knowledge, 201);
    }

    public function show($id)
    {
        $knowledge = Knowledge::find($id);

        if ($knowledge == null) {
            return response()->json(['error' => 'Knowledge not found.'], 404);
        }

        return response()->json($knowledge, 201);
    }

    public function update(Request $request, $id)
    {
        $knowledge = Knowledge::find($id);

        if ($knowledge == null) {
            return response()->json(['error' => 'Knowledge not found.'], 404);
        }

        $acceptedTypes = config('knowledge-type');

        $validated = $request->validate([
            'name' => 'string',
            'infos' => 'string',
            'type' => 'string|in:'.implode(',', $acceptedTypes),
            'image' => 'image|mimes:jpeg,png,jpg,gif,svg|max:2048',
        ]);

        if ($request->filled('name')){
            $knowledge->name = $validated['name'];
        }
        if ($request->filled('infos')){
            $knowledge->infos = $validated['infos'];
        }
        if ($request->filled('type')){
            $knowledge->type = $validated['type'];
        }
        if ($request->image != null) {
            $previousPath = $knowledge->imageURL;
            if ($previousPath != null){
                Storage::disk('s3')->delete($previousPath);
            }
            $timestamp = time();

            $path = $request->image->storeAs(
                'knowledges',
                $timestamp . '.' . $request->image->extension(),
                's3'
            );
            if (!$path) {
                return response()->json([
                    'message' => 'Erreur lors de l\'upload du fichier'
                ], 400);
            }
            $knowledge->imageURL = $path;
        }

        $knowledge->save();
        return response()->json($knowledge, 201);
    }

    public function destroy($id)
    {
        $knowledge = Knowledge::find($id);

        if ($knowledge == null) {
            return response()->json(['error' => 'Knowledge not found.'], 404);
        }

        $previousPath = $knowledge->getImageRealPath();
        dd($previousPath);
        if ($previousPath != null){
            Storage::disk('s3')->delete($previousPath);
        }

        $knowledge->delete();

        return response()->json($knowledge, 201);
    }
}
