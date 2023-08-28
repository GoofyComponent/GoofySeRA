<?php

namespace App\Http\Controllers;

use Carbon\Carbon;
use App\Models\Room;
use App\Models\Project;

use Carbon\CarbonInterval;
use Illuminate\Http\Request;
use App\Models\RoomReservation;

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
            'name' => 'string',
            'inDescription' => 'boolean',
        ]);

        $maxPerPage = $request->input('maxPerPage', 10); // Default to 10 if not specified

        // Sort by updated_at (optional)
        $sort = $request->input('sort', 'asc'); // Default to asc if not specified
        // Validate if the sort parameter is 'asc' or 'desc'
        if ($sort !== 'asc' && $sort !== 'desc') {
            return response()->json(['error' => 'Invalid sort parameter. Only "asc" or "desc" allowed.'], 400);
        }

        // Get a query builder instance for the Room model
        $query = Room::query();

        // Filter by name (optional)
        if ($request->has('name')) {
            $query->where('name', 'like', '%' . $request->input('name') . '%');
            if ($request->has('inDescription')) {
                $query->orWhere('description', 'like', '%' . $request->input('name') . '%');
            }
        }

        // Retrieve rooms with reservations
        $rooms = $query->orderBy('updated_at', $sort)->paginate($maxPerPage)->load('reservations');

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
     *             @OA\Property(property="description", type="string", example="Room 1 description"),
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Room created",
     *         @OA\JsonContent(
     *             @OA\Property(property="id", type="integer", example="1"),
     *             @OA\Property(property="name", type="string", example="Room 1"),
     *             @OA\Property(property="description", type="string", example="Room 1 description"),
     *             @OA\Property(property="created_at", type="string", example="2021-05-20T14:00:00.000000Z"),
     *             @OA\Property(property="updated_at", type="string", example="2021-05-20T14:00:00.000000Z"),
     *         )
     *     ),
     *     @OA\Response(
     *         response=400,
     *         description="Invalid data",
     *         @OA\JsonContent(
     *             @OA\Property(property="name", type="string", example="The name field is required."),
     *             @OA\Property(property="description", type="string", example="The description field is required."),
     *         )
     *     )
     * )
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string',
            'description' => 'required|string',
        ]);

        $room = new Room();
        $room->name = $validated['name'];
        $room->description = $validated['description'];
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
     *             @OA\Property(property="description", type="string", example="Room 1 description"),
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Room updated",
     *         @OA\JsonContent(
     *             @OA\Property(property="id", type="integer", example="1"),
     *             @OA\Property(property="name", type="string", example="Room 1"),
     *             @OA\Property(property="description", type="string", example="Room 1 description"),
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
            'description' => 'required|string',
        ]);

        $room = Room::find($id);

        if ($room === null) {
            return response()->json(['error' => 'Room not found.'], 400);
        }

        $room->name = $validated['name'];
        $room->description = $validated['description'];
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
    *      path="/api/projects/{projectId}/room/reserve",
    *      summary="Reserve a room",
    *      tags={"Rooms"},
    *      @OA\Parameter(
    *          description="Project id",
    *          in="path",
    *          name="projectId",
    *          required=true,
    *          @OA\Schema(
    *              type="integer",
    *          )
    *      ),
    *      @OA\RequestBody(
    *          required=true,
    *          description="Reservation data",
    *          @OA\JsonContent(
    *              @OA\Property(property="room_id", type="integer", example="1"),
    *              @OA\Property(property="date", type="string", example="2021-05-20"),
    *              @OA\Property(property="start_time", type="string", example="14:00"),
    *              @OA\Property(property="end_time", type="string", example="15:00"),
    *              @OA\Property(property="title", type="string", example="Meeting"),
    *              @OA\Property(property="users_id", type="array", @OA\Items(type="integer"), example="[1, 2]"),
    *          ),
    *      ),
    *      @OA\Response(
    *          response=200,
    *          description="Reservation created",
    *          @OA\JsonContent(
    *              @OA\Property(property="id", type="integer", example="1"),
    *              @OA\Property(property="room_id", type="integer", example="1"),
    *              @OA\Property(property="date", type="string", example="2021-05-20"),
    *              @OA\Property(property="start_time", type="string", example="14:00"),
    *              @OA\Property(property="end_time", type="string", example="15:00"),
    *              @OA\Property(property="title", type="string", example="Meeting"),
    *              @OA\Property(property="project_id", type="integer", example="1"),
    *              @OA\Property(property="users_id", type="array", @OA\Items(type="integer"), example="[1, 2]"),
    *              @OA\Property(property="created_at", type="string", example="2021-05-20T14:00:00.000000Z"),
    *              @OA\Property(property="updated_at", type="string", example="2021-05-20T14:00:00.000000Z"),
    *          ),
    *      ),
    *      @OA\Response(
    *          response=400,
    *          description="Room already reserved",
    *          @OA\JsonContent(
    *              @OA\Property(property="error", type="string", example="Room already reserved. Need to be 30 minutes before the end of the reservation to be able to reserve again."),
    *          ),
    *      ),
    * )
    */
    public function reserve(Request $request, $project_id)
    {
        $validated = $request->validate([
            'room_id' => 'required|integer',
            'date' => 'required|date', // ex: 2021-05-20
            'start_time' => 'required|date_format:H:i', // ex: 14:00
            'end_time' => 'required|date_format:H:i', // ex: 15:00
            'title' => 'required|string',
            'users_id' => 'required|array',
        ]);

        $room = Room::find($validated['room_id']);

        if ($room === null) {
            return response()->json(['error' => 'Room not found.'], 400);
        }

        $reservation = $room->reserve(
            $validated['date'],
            $validated['start_time'],
            $validated['end_time'],
            $validated['title'],
            $project_id,
            $validated['users_id']
        );

        if ($reservation === false) {
            return response()->json(['error' => 'Room already reserved. Need to be 30 minutes before the end of the reservation to be able to reserve again.'], 400);
        }

        return $reservation;
    }

    /**
    * @OA\Post(
    *     path="/api/projects/teams/unreserve",
    *     summary="Unreserve a room",
    *     tags={"Rooms"},
    *     @OA\RequestBody(
    *         required=true,
    *         description="Reservation id",
    *         @OA\JsonContent(
    *             @OA\Property(property="reservation_id", type="integer", example="1"),
    *         ),
    *     ),
    *     @OA\Response(
    *         response=200,
    *         description="Reservation deleted",
    *         @OA\JsonContent(
    *             @OA\Property(property="success", type="string", example="Reservation deleted."),
    *         ),
    *     ),
    *     @OA\Response(
    *         response=400,
    *         description="Reservation not found",
    *         @OA\JsonContent(
    *             @OA\Property(property="error", type="string", example="Reservation not found."),
    *         ),
    *     ),
    * )
    */
    public function unreserve(Request $request)
    {
        $validated = $request->validate([
            'reservation_id' => 'required|integer',
        ]);

        $reservation = RoomReservation::find($validated['reservation_id']);

        if ($reservation === null) {
            return response()->json(['error' => 'Reservation not found.'], 400);
        }

        $reservation->delete();

        return response()->json(['success' => 'Reservation deleted.'], 200);
    }

    /**
    * @OA\Get(
    *     path="/api/projects/{projectId}/rooms/available",
    *     summary="Get available rooms",
    *     tags={"Rooms"},
    *     @OA\Parameter(
    *         description="Project id",
    *         in="path",
    *         name="projectId",
    *         required=true,
    *         @OA\Schema(
    *             type="integer",
    *         )
    *     ),
    *     @OA\Parameter(
    *         description="Duration in minutes",
    *         in="query",
    *         name="duration",
    *         required=true,
    *         @OA\Schema(
    *             type="integer",
    *         )
    *     ),
    *     @OA\Parameter(
    *         description="Date",
    *         in="query",
    *         name="date",
    *         required=true,
    *         @OA\Schema(
    *             type="string",
    *             format="date",
    *             example="2021-05-20"
    *         )
    *     ),
    *     @OA\Response(
    *         response=200,
    *         description="List of available rooms",
    *         @OA\JsonContent(
    *             @OA\Property(property="id", type="integer", example="1"),
    *             @OA\Property(property="name", type="string", example="Room 1"),
    *             @OA\Property(property="description", type="string", example="Room 1 description"),
    *             @OA\Property(property="created_at", type="string", example="2021-05-20T14:00:00.000000Z"),
    *             @OA\Property(property="updated_at", type="string", example="2021-05-20T14:00:00.000000Z"),
    *         )
    *     ),
    *     @OA\Response(
    *         response=400,
    *         description="Invalid date",
    *         @OA\JsonContent(
    *             @OA\Property(property="error", type="string", example="The date does not match the format Y-m-d."),
    *         )
    *     ),
    * )
    */
    public function getAvailableRooms(Request $request){

        $request->validate([
            'duration' => 'required|integer', // ex: 60
            'date' => 'required|date', // ex: 2021-05-20
        ]);

        // on va scinder ma recherche en 2 parties

        // 1. On va récupérer toutes les salles qui n'ont pas de réservation à la date donnée

        $roomsWhereNoReservation = Room::query()
        ->whereDoesntHave('reservations', function ($query) use ($request) {
            $query->where('date', $request->input('date'));
        })
        ->get();

        // 2. On va récupérer toutes les salles qui ont des réservations à la date donnée
        $roomsWhereReservation = Room::query()->whereHas('reservations', function ($query) use ($request) {
            $query->where('date', $request->input('date'));
        })->get();

        // on va ensuite vérifier que les salles qui ont des réservations peuvent être réservées sur la durée donnée

        $roomsAvailable = [];

        foreach ($roomsWhereReservation as $room) {
            // on utilisera pas la fonction canBeReserved car elle prends des horaires en paramètres et non une durée
            // Donc on va faire par intervalle de 30 minutes des vérifications de disponibilité dans la journée qui est de 9h à 19h
            $startTime = Carbon::parse('09:00');
            $endTime = Carbon::parse('19:00');

            $duration = CarbonInterval::minutes($request->input('duration'));

            while ($startTime->add($duration)->lessThanOrEqualTo($endTime)) {
                $isAvailable = true;
                foreach ($room->reservations as $reservation) {
                    $dateReserv = Carbon::parse($reservation['date']);
                    $startTimeReserv = Carbon::parse($reservation['start_time']);
                    $endTimeReserv = Carbon::parse($reservation['end_time']);

                    // si la réservation est le même jour on verifie que les horaires ne se chevauchent pas
                    if ($dateReserv->isSameDay($request->input('date'))) {
                        if ($startTimeReserv->between($startTime, $endTime)
                            || $endTimeReserv->between($startTime, $endTime)
                            || $startTime->between($startTimeReserv, $endTimeReserv)
                            || $endTime->between($startTimeReserv, $endTimeReserv)
                        ) {
                            $isAvailable = false;
                        }
                    }
                }
                if ($isAvailable) {
                    $roomsAvailable[] = $room;
                }
            }
        }


        // on va fusionner les 2 tableaux pour avoir un seul tableau avec toutes les salles disponibles à la date donnée et sur la durée donnée
        $roomsAvailable = array_merge($roomsWhereNoReservation->toArray(), $roomsAvailable);

        return response()->json($roomsAvailable);
    }


    /**
    *  @OA\Get(
    *     path="/api/projects/{project_id}/rooms",
    *     summary="Get rooms by project",
    *     tags={"Rooms"},
    *     @OA\Parameter(
    *         description="Project id",
    *         in="path",
    *         name="project_id",
    *         required=true,
    *         @OA\Schema(
    *             type="integer",
    *         )
    *     ),
    *     @OA\Parameter(
    *         description="Show reservations",
    *         in="query",
    *         name="reservation",
    *         required=false,
    *         @OA\Schema(
    *             type="boolean",
    *             default=false
    *         )
    *     ),
    *     @OA\Response(
    *         response=200,
    *         description="List of rooms",
    *         @OA\JsonContent(
    *             @OA\Property(property="id", type="integer", example="1"),
    *             @OA\Property(property="name", type="string", example="Room 1"),
    *             @OA\Property(property="description", type="string", example="Room 1 description"),
    *             @OA\Property(property="created_at", type="string", example="2021-05-20T14:00:00.000000Z"),
    *             @OA\Property(property="updated_at", type="string", example="2021-05-20T14:00:00.000000Z"),
    *         )
    *     ),
    *     @OA\Response(
    *         response=400,
    *         description="Project not found",
    *         @OA\JsonContent(
    *             @OA\Property(property="error", type="string", example="Project not found."),
    *         )
    *     ),
    * )
    */
    public function showByProject(Request $request, $project_id){

        $project = Project::find($project_id);

        if ($project === null) {
            return response()->json(['message' => 'Project not found.'], 404);
        }

        $reservations = $project->reservations()->get();
        $canReserve = $request->input('reservation');
        if($canReserve == 'true'){
            $canReserve = true;
        }else{
            $canReserve = false;
        }
        $rooms = [];
        foreach ($reservations as $reservation) {

            if ($reservation->project_id == $project_id) {
                if($canReserve === true){
                    $room = Room::find($reservation->room_id)->load('reservations');
                }else{
                    $room = Room::find($reservation->room_id);
                }
                $rooms[] = $room;
            }
        }

        return response()->json($rooms);
    }


}
