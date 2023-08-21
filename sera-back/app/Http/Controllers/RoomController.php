<?php

namespace App\Http\Controllers;

use App\Models\Room;
use Illuminate\Http\Request;

class RoomController extends Controller
{
    /**
     * @OA\Get(
     *     path="/api/rooms",
     *     summary="Get all rooms",
     *     tags={"Rooms"},
     *     @OA\Parameter(
     *         description="Number of rooms per page",
     *         in="query",
     *         name="maxPerPage",
     *         required=false,
     *         @OA\Schema(
     *             type="integer",
     *             default=10
     *         )
     *     ),
     *     @OA\Parameter(
     *         description="Sort rooms by updated_at",
     *         in="query",
     *         name="sort",
     *         required=false,
     *         @OA\Schema(
     *             type="string",
     *             enum={"asc", "desc"},
     *             default="asc"
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="List of rooms",
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="No rooms found",
     *     ),
     *     @OA\Response(
     *         response=400,
     *         description="Invalid sort parameter. Only 'asc' or 'desc' allowed.",
     *     ),
     * )
     */
    public function index(Request $request)
    {
        // Validate the request parameters
        $validated = $request->validate([
            'maxPerPage' => 'integer',
            'sort' => 'string|in:asc,desc',
        ]);

        $maxPerPage = $request->input('maxPerPage', 10); // Default to 10 if not specified

        // Sort by updated_at (optional)
        $sort = $request->input('sort', 'asc'); // Default to asc if not specified
        // Validate if the sort parameter is 'asc' or 'desc'
        if ($sort !== 'asc' && $sort !== 'desc') {
            return response()->json(['error' => 'Invalid sort parameter. Only "asc" or "desc" allowed.'], 400);
        }

        // Retrieve rooms with reservations
        $rooms = Room::orderBy('updated_at', $sort)->paginate($maxPerPage)->load('reservations');

        if ($rooms->isEmpty()) {
            return response()->json(['error' => 'No rooms found.'], 404);
        }

        return $rooms;
    }


    /**
     * @OA\Post(
     *     path="/api/rooms",
     *     summary="Create a room",
     *     tags={"Rooms"},
     *     @OA\RequestBody(
     *         required=true,
     *         description="Room data",
     *         @OA\JsonContent(
     *             @OA\Property(property="name", type="string", example="Room 1"),
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Room created",
     *         @OA\JsonContent(
     *             @OA\Property(property="id", type="integer", example="1"),
     *             @OA\Property(property="name", type="string", example="Room 1"),
     *             @OA\Property(property="created_at", type="string", example="2021-05-20T14:00:00.000000Z"),
     *             @OA\Property(property="updated_at", type="string", example="2021-05-20T14:00:00.000000Z"),
     *         )
     *     ),
     *     @OA\Response(
     *         response=400,
     *         description="Invalid data",
     *         @OA\JsonContent(
     *             @OA\Property(property="name", type="string", example="The name field is required."),
     *         )
     *     )
     * )
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
     * @OA\Get(
     *     path="/api/rooms/{id}",
     *     summary="Get a room",
     *     tags={"Rooms"},
     *     @OA\Parameter(
     *         description="Room id",
     *         in="path",
     *         name="id",
     *         required=true,
     *         @OA\Schema(
     *             type="integer",
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Room",
     *         @OA\JsonContent(
     *             @OA\Property(property="id", type="integer", example="1"),
     *             @OA\Property(property="name", type="string", example="Room 1"),
     *             @OA\Property(property="created_at", type="string", example="2021-05-20T14:00:00.000000Z"),
     *             @OA\Property(property="updated_at", type="string", example="2021-05-20T14:00:00.000000Z"),
     *         )
     *     ),
     *     @OA\Response(
     *         response=400,
     *         description="Room not found",
     *         @OA\JsonContent(
     *             @OA\Property(property="error", type="string", example="Room not found."),
     *         )
     *     )
     * )
     */
    public function show($id)
    {
        $room = Room::find($id)->load('reservations');

        if ($room === null) {
            return response()->json(['error' => 'Room not found.'], 400);
        }

        return $room;
    }

    /**
     * @OA\Put(
     *     path="/api/rooms/{id}",
     *     summary="Update a room",
     *     tags={"Rooms"},
     *     @OA\Parameter(
     *         description="Room id",
     *         in="path",
     *         name="id",
     *         required=true,
     *         @OA\Schema(
     *             type="integer",
     *         )
     *     ),
     *     @OA\RequestBody(
     *         required=true,
     *         description="Room data",
     *         @OA\JsonContent(
     *             @OA\Property(property="name", type="string", example="Room 1"),
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Room updated",
     *         @OA\JsonContent(
     *             @OA\Property(property="id", type="integer", example="1"),
     *             @OA\Property(property="name", type="string", example="Room 1"),
     *             @OA\Property(property="created_at", type="string", example="2021-05-20T14:00:00.000000Z"),
     *             @OA\Property(property="updated_at", type="string", example="2021-05-20T14:00:00.000000Z"),
     *         )
     *     ),
     *     @OA\Response(
     *         response=400,
     *         description="Room not found",
     *         @OA\JsonContent(
     *             @OA\Property(property="error", type="string", example="Room not found."),
     *         )
     *     )
     * )
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
     * @OA\Delete(
     *     path="/api/rooms/{id}",
     *     summary="Delete a room",
     *     tags={"Rooms"},
     *     @OA\Parameter(
     *         description="Room id",
     *         in="path",
     *         name="id",
     *         required=true,
     *         @OA\Schema(
     *             type="integer",
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Room deleted",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="string", example="Room deleted."),
     *         )
     *     ),
     *     @OA\Response(
     *         response=400,
     *         description="Room not found",
     *         @OA\JsonContent(
     *             @OA\Property(property="error", type="string", example="Room not found."),
     *         )
     *     )
     * )
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


    /**
     * @OA\Post(
     *     path="/api/rooms/{id}/reservations",
     *     summary="Reserve a room",
     *     tags={"Rooms"},
     *     @OA\Parameter(
     *         description="Room id",
     *         in="path",
     *         name="id",
     *         required=true,
     *         @OA\Schema(
     *             type="integer",
     *         )
     *     ),
     *     @OA\RequestBody(
     *         required=true,
     *         description="Reservation data",
     *         @OA\JsonContent(
     *             @OA\Property(property="project_id", type="integer", example="1"),
     *             @OA\Property(property="date", type="string", example="2021-05-20"),
     *             @OA\Property(property="start_time", type="string", example="14:00"),
     *             @OA\Property(property="end_time", type="string", example="15:00"),
     *             @OA\Property(property="title", type="string", example="Meeting"),
     *            @OA\Property(property="users_id", type="array", @OA\Items(type="integer"), example="[1, 2]"),
     *         ),
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Reservation created",
     *         @OA\JsonContent(
     *             @OA\Property(property="id", type="integer", example="1"),
     *             @OA\Property(property="project_id", type="integer", example="1"),
     *             @OA\Property(property="room_id", type="integer", example="1"),
     *             @OA\Property(property="date", type="string", example="2021-05-20"),
     *             @OA\Property(property="start_time", type="string", example="14:00"),
     *             @OA\Property(property="end_time", type="string", example="15:00"),
     *             @OA\Property(property="title", type="string", example="Meeting"),
     *            @OA\Property(property="users", type="array", @OA\Items(
     *                  @OA\Property(property="firstname", type="string", example="John"),
     *                  @OA\Property(property="lastname", type="string", example="Doe"),
     *                  @OA\Property(property="role", type="string", example="professor"),
     *                  @OA\Property(property="id", type="integer", example="1"),
     *              ), example="[{'firstname': 'John', 'lastname': 'Doe', 'role': 'professor', 'id': 1}]"),
     *             @OA\Property(property="created_at", type="string", example="2021-05-20T14:00:00.000000Z"),
     *             @OA\Property(property="updated_at", type="string", example="2021-05-20T14:00:00.000000Z"),
     *         ),
     *     ),
     *     @OA\Response(
     *         response=400,
     *         description="Room already reserved",
     *         @OA\JsonContent(
     *             @OA\Property(property="error", type="string", example="Room already reserved. Need to be 30 minutes before the end of the reservation to be able to reserve again."),
     *         ),
     *     ),
     * )
     */

    public function reserve(Request $request, $id)
    {
        $validated = $request->validate([
            'project_id' => 'required|integer',
            'date' => 'required|date', // ex: 2021-05-20
            'start_time' => 'required|date_format:H:i', // ex: 14:00
            'end_time' => 'required|date_format:H:i', // ex: 15:00
            'title' => 'required|string',
            'users_id' => 'required|array',
        ]);

        $room = Room::find($id);

        if ($room === null) {
            return response()->json(['error' => 'Room not found.'], 400);
        }

        $reservation = $room->reserve(
            $validated['date'],
            $validated['start_time'],
            $validated['end_time'],
            $validated['title'],
            $validated['project_id'],
            $validated['users_id']
        );

        if ($reservation === false) {
            return response()->json(['error' => 'Room already reserved. Need to be 30 minutes before the end of the reservation to be able to reserve again.'], 400);
        }

        return $reservation;
    }
}
