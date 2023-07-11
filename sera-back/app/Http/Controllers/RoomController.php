<?php

namespace App\Http\Controllers;

use App\Models\Room;
use Illuminate\Http\Request;

class RoomController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $maxPerPage = $request->input('maxPerPage', 10); // Default to 10 if not specified

        $rooms = Room::paginate($maxPerPage);

        if ($rooms === null) {
            return response()->json(['error' => 'No rooms found.'], 400);
        }

        return $rooms;
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string',
        ]);

        $room = new Room();
        $room->name = $validated['name'];
        $room->save();

        return $room;
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $room = Room::find($id);

        if ($room === null) {
            return response()->json(['error' => 'Room not found.'], 400);
        }

        return $room;
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'name' => 'required|string',
        ]);

        $room = Room::find($id);

        if ($room === null) {
            return response()->json(['error' => 'Room not found.'], 400);
        }

        $room->name = $validated['name'];
        $room->save();

        return $room;
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $room = Room::find($id);

        if ($room === null) {
            return response()->json(['error' => 'Room not found.'], 400);
        }

        $room->delete();

        return response()->json(['success' => 'Room deleted.'], 200);
    }
}
