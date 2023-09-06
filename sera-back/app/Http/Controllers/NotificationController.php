<?php

namespace App\Http\Controllers;

use App\Models\Notification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class NotificationController extends Controller
{
    public function index()
    {
        $user = Auth::user();
        $notifications = Notification::where('user_id', $user->id)->get();

        return response()->json($notifications, 201);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string',
            'description' => 'required|string',
            'is_urgent' => 'required|boolean',
        ]);

        $notification = new Notification();
        $notification->title = $$validated['title'];
        $notification->description = $validated['description'];
        $notification->is_read = false;
        $notification->is_deleted = false;
        $notification->user_id = Auth::user()->id;
        $notification->is_urgent = $validated['is_urgent'];
        $notification->save();

        return response()->json($notification, 201);
    }

    public function show($id)
    {
        $notification = Notification::find($id);
        return response()->json($notification);
    }

    public function update(Request $request)
    {
        $validated = $request->validate([
            'title' => 'string',
            'description' => 'string',
            'is_urgent' => 'boolean',
            'is_read' => 'boolean'
        ]);

        $notification = Notification::find($request->id);

        if ($notification == null) {
            return response()->json(['error' => 'Notification not found.'], 404);
        }

        if ($request->filled('title')) {
            $notification->title = $validated['title'];
        }
        if ($request->filled('description')) {
            $notification->description = $validated['description'];
        }
        if ($request->filled('is_urgent')) {
            $notification->is_urgent = $validated['is_urgent'];
        }

        $notification->save();
        return response()->json($notification, 201);
    }

    public function destroy($id)
    {
        $notification = Notification::find($id);

        if ($notification == null) {
            return response()->json(['error' => 'Notification not found.'], 404);
        }

        $notification->delete();

        return response()->json('Notification deleted successfully', 201);
    }
}
