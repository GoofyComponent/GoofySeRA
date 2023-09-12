<?php

namespace App\Http\Controllers;

use App\Models\Notification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class NotificationController extends Controller
{
    /**
    * @OA\Get(
    *     path="/api/notifications",
    *     summary="Get all notifications",
    *     tags={"Notifications"},
    *     @OA\Response(
    *         response=200,
    *         description="Success",
    *         @OA\JsonContent(
    *             type="array",
    *             @OA\Items(
    *                 @OA\Property(property="id", type="integer"),
    *                 @OA\Property(property="title", type="string"),
    *                 @OA\Property(property="description", type="string"),
    *                 @OA\Property(property="is_read", type="boolean"),
    *                 @OA\Property(property="is_deleted", type="boolean"),
    *                 @OA\Property(property="user_id", type="integer"),
    *                 @OA\Property(property="is_urgent", type="boolean"),
    *                 @OA\Property(property="created_at", type="string"),
    *                 @OA\Property(property="updated_at", type="string"),
    *             )
    *         )
    *     ),
    *     @OA\Response(
    *         response=401,
    *         description="Unauthorized"
    *     )
    * )
    */
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
            'user_id' => 'required|integer'
        ]);

        $user = \App\Models\User::find($validated['user_id']);

        if ($user == null) {
            return response()->json(['error' => 'User not found.'], 404);
        }

        $notification = new Notification();
        $notification->title = $$validated['title'];
        $notification->description = $validated['description'];
        $notification->is_read = false;
        $notification->is_deleted = false;
        $notification->user_id = $validated['user_id'];
        $notification->is_urgent = $validated['is_urgent'];
        $notification->save();

        return response()->json($notification, 201);
    }

    /**
    *   @OA\Get(
    *       path="/api/notifications/{id}",
    *       summary="Get notification by id",
    *       tags={"Notifications"},
    *       @OA\Parameter(
    *           name="id",
    *           in="path",
    *           description="Notification id",
    *           required=true,
    *           @OA\Schema(
    *               type="integer"
    *           )
    *       ),
    *       @OA\Response(
    *           response=200,
    *           description="Success",
    *           @OA\JsonContent(
    *               type="object",
    *               @OA\Property(property="id", type="integer"),
    *               @OA\Property(property="title", type="string"),
    *               @OA\Property(property="description", type="string"),
    *               @OA\Property(property="is_read", type="boolean"),
    *               @OA\Property(property="is_deleted", type="boolean"),
    *               @OA\Property(property="user_id", type="integer"),
    *               @OA\Property(property="is_urgent", type="boolean"),
    *               @OA\Property(property="created_at", type="string"),
    *               @OA\Property(property="updated_at", type="string"),
    *           )
    *       ),
    *       @OA\Response(
    *           response=401,
    *           description="Unauthorized"
    *       ),
    *       @OA\Response(
    *           response=404,
    *           description="Notification not found"
    *       )
    *   )
    */
    public function show($id)
    {
        $notification = Notification::find($id);
        return response()->json($notification);
    }

    /**
    * @OA\Put(
    *    path="/api/notifications",
    *    summary="Update notification",
    *    tags={"Notifications"},
    *    @OA\RequestBody(
    *        required=true,
    *        @OA\JsonContent(
    *            required={"id"},
    *            @OA\Property(property="id", type="integer"),
    *            @OA\Property(property="title", type="string"),
    *            @OA\Property(property="description", type="string"),
    *            @OA\Property(property="is_urgent", type="boolean"),
    *            @OA\Property(property="is_read", type="boolean"),
    *        )
    *    ),
    *    @OA\Response(
    *        response=200,
    *        description="Success",
    *        @OA\JsonContent(
    *            type="object",
    *            @OA\Property(property="id", type="integer"),
    *            @OA\Property(property="title", type="string"),
    *            @OA\Property(property="description", type="string"),
    *            @OA\Property(property="is_read", type="boolean"),
    *            @OA\Property(property="is_deleted", type="boolean"),
    *            @OA\Property(property="user_id", type="integer"),
    *            @OA\Property(property="is_urgent", type="boolean"),
    *            @OA\Property(property="created_at", type="string"),
    *            @OA\Property(property="updated_at", type="string"),
    *        )
    *    ),
    *    @OA\Response(
    *        response=401,
    *        description="Unauthorized"
    *    ),
    *    @OA\Response(
    *        response=404,
    *        description="Notification not found"
    *    )
    * )
    */
    public function update(Request $request,$id)
    {
        $validated = $request->validate([
            'title' => 'string',
            'description' => 'string',
            'is_urgent' => 'boolean',
            'is_read' => 'boolean'
        ]);

        $notification = Notification::find($id);

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

    /**
    * @OA\Delete(
    *     path="/api/notifications/{id}",
    *     summary="Delete notification by id",
    *     tags={"Notifications"},
    *     @OA\Parameter(
    *         name="id",
    *         in="path",
    *         description="Notification id",
    *         required=true,
    *         @OA\Schema(
    *             type="integer"
    *         )
    *     ),
    *     @OA\Response(
    *         response=200,
    *         description="Success",
    *         @OA\JsonContent(
    *             type="object",
    *             @OA\Property(property="id", type="integer"),
    *             @OA\Property(property="title", type="string"),
    *             @OA\Property(property="description", type="string"),
    *             @OA\Property(property="is_read", type="boolean"),
    *             @OA\Property(property="is_deleted", type="boolean"),
    *             @OA\Property(property="user_id", type="integer"),
    *             @OA\Property(property="is_urgent", type="boolean"),
    *             @OA\Property(property="created_at", type="string"),
    *             @OA\Property(property="updated_at", type="string"),
    *         )
    *     ),
    *     @OA\Response(
    *         response=401,
    *         description="Unauthorized"
    *     ),
    *     @OA\Response(
    *         response=404,
    *         description="Notification not found"
    *     )
    * )
    */
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
