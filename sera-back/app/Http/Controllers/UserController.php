<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Validation\Rules;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;


class UserController extends Controller
{
    /**
     * @OA\Get(
     *     path="/api/users",
     *     summary="Get a list of users",
     *     tags={"Users"},
     *     @OA\Parameter(
     *         name="role",
     *         in="query",
     *         description="Filter by role",
     *         required=false,
     *         @OA\Schema(
     *             type="string",
     *         )
     *     ),
     *     @OA\Parameter(
     *         name="maxPerPage",
     *         in="query",
     *         description="Maximum number of users per page",
     *         required=false,
     *         @OA\Schema(
     *             type="integer",
     *         )
     *     ),
     *     @OA\Parameter(
     *         name="sort",
     *         in="query",
     *         description="Sort by updated_at (asc or desc)",
     *         required=false,
     *         @OA\Schema(
     *             type="string",
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="List of users",
     *     ),
     *     @OA\Response(
     *         response=400,
     *         description="Invalid role or sort parameter",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(
     *                 property="error",
     *                 type="string",
     *             )
     *         )
     *     )
     * )
     */
    public function index(Request $request)
    {
        // Validate the request parameters
        $validated = $request->validate([
            'maxPerPage' => 'integer',
            'sort' => 'string|in:asc,desc',
        ]);

        $usersQuery = User::query();

        // Search by role (optional)
        if ($request->filled('role')) {
            $role = $request->input('role');
            if (!in_array($role, array_keys(config('roles')))) {
                return response()->json(['error' => 'Invalid role'], 400);
            }
            $usersQuery->where('role', $role);
        }

        // Exclude the authenticated user
        $usersQuery->whereNotIn('id', [$request->user()->id]);

        // Sort by updated_at (optional)
        $sort = $request->input('sort', 'asc'); // Default to asc if not specified
        // Validate if the sort parameter is 'asc' or 'desc'
        if ($sort !== 'asc' && $sort !== 'desc') {
            return response()->json(['error' => 'Invalid sort parameter. Only "asc" or "desc" allowed.'], 400);
        }
        $usersQuery->orderBy('updated_at', $sort);

        // Pagination
        $maxPerPage = $validated['maxPerPage'] ?? 10; // Default to 10 if not specified
        $users = $usersQuery->paginate($maxPerPage);

        // For each user, add a link to the avatar image if it's not null
        $users->getCollection()->transform(function ($user) {
            if ($user->avatar_filename !== null) {
                $user->avatar_url = asset('storage/images/' . $user->avatar_filename);
            }
            return $user;
        });

        return response()->json($users);
    }

    /**
     * @OA\Get(
     *     path="/api/users/{id}",
     *     summary="Get a user by id",
     *     tags={"Users"},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         description="The id of the user",
     *         required=true,
     *         @OA\Schema(
     *             type="integer",
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="The user",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(
     *                 property="id",
     *                 type="integer",
     *             ),
     *             @OA\Property(
     *                 property="firstname",
     *                 type="string",
     *             ),
     *             @OA\Property(
     *                 property="lastname",
     *                 type="string",
     *             ),
     *             @OA\Property(
     *                 property="email",
     *                 type="string",
     *             ),
     *             @OA\Property(
     *                 property="role",
     *                 type="string",
     *             ),
     *             @OA\Property(
     *                 property="avatar_filename",
     *                 type="string",
     *                 nullable=true,
     *             ),
     *             @OA\Property(
     *                 property="avatar_url",
     *                 type="string",
     *                 nullable=true,
     *             ),
     *             @OA\Property(
     *                 property="created_at",
     *                 type="string",
     *                 format="date-time",
     *             ),
     *             @OA\Property(
     *                 property="updated_at",
     *                 type="string",
     *                 format="date-time",
     *             ),
     *         ),
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="User not found",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(
     *                 property="error",
     *                 type="string",
     *             ),
     *         ),
     *     ),
     * )
     */
    public function show($id)
    {
        $user = User::find($id);

        if ($user === null) {
            return response()->json(['error' => 'User not found.'], 404);
        }

        if ($user->avatar_filename !== null) {
            $user->avatar_url = asset('storage/images/' . $user->avatar_filename);
        }

        return response()->json($user);
    }

    /**
     * @OA\Put(
     *     path="/api/users/{id}",
     *     summary="Update a user",
     *     tags={"Users"},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         description="The id of the user",
     *         required=true,
     *         @OA\Schema(
     *             type="integer",
     *         )
     *     ),
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             @OA\Property(
     *                 property="email",
     *                 type="string",
     *             ),
     *             @OA\Property(
     *                 property="password",
     *                 type="string",
     *             ),
     *             @OA\Property(
     *                 property="firstname",
     *                 type="string",
     *             ),
     *             @OA\Property(
     *                 property="lastname",
     *                 type="string",
     *             ),
     *             @OA\Property(
     *                 property="role",
     *                 type="string",
     *             ),
     *         ),
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="The updated user",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(
     *                 property="id",
     *                 type="integer",
     *             ),
     *             @OA\Property(
     *                 property="firstname",
     *                 type="string",
     *             ),
     *             @OA\Property(
     *                 property="lastname",
     *                 type="string",
     *             ),
     *             @OA\Property(
     *                 property="email",
     *                 type="string",
     *             ),
     *             @OA\Property(
     *                 property="role",
     *                 type="string",
     *             ),
     *             @OA\Property(
     *                 property="avatar_filename",
     *                 type="string",
     *                 nullable=true,
     *             ),
     *             @OA\Property(
     *                 property="avatar_url",
     *                 type="string",
     *                 nullable=true,
     *             ),
     *             @OA\Property(
     *                 property="created_at",
     *                 type="string",
     *                 format="date-time",
     *             ),
     *             @OA\Property(
     *                 property="updated_at",
     *                 type="string",
     *                 format="date-time",
     *             ),
     *         ),
     *     ),
     *     @OA\Response(
     *         response=400,
     *         description="Invalid email, password, firstname, lastname or role",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(
     *                 property="error",
     *                 type="string",
     *             ),
     *         ),
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="User not found",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(
     *                 property="error",
     *                 type="string",
     *             ),
     *         ),
     *     ),
     * )
     */
    public function update(Request $request, $id)
    {
        $request->validate([
            'email' => ['string', 'email', 'max:255', 'unique:' . User::class],
            'password' => ['confirmed', Rules\Password::defaults()],
            'firstname' => 'string|max:255',
            'lastname' => 'string|max:255',
            'role' => 'string|in:' . implode(',', array_keys(config('roles'))),
        ]);

        $user = User::find($id);

        if ($user === null) {
            return response()->json(['error' => 'User not found.'], 404);
        }

        $user->fill($request->all());
        if ($request->filled('password')) {
            $user->password = Hash::make($request->password);
        }
        $user->save();

        return response()->json($user, 200);
    }

    /**
     * @OA\Delete(
     *     path="/api/users/{id}",
     *     summary="Delete a user",
     *     tags={"Users"},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         description="The id of the user",
     *         required=true,
     *         @OA\Schema(
     *             type="integer",
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="User deleted",
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="User not found",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(
     *                 property="error",
     *                 type="string",
     *             ),
     *         ),
     *     ),
     * )
     */

    public function destroy($id)
    {
        $user = User::find($id);

        if ($user === null) {
            return response()->json(['error' => 'User not found.'], 404);
        }

        $user->delete();

        return response()->json(['message' => 'User deleted.']);
    }

    /**
     * @OA\Get(
     *     path="/api/roles",
     *     summary="Get a list of roles",
     *     tags={"Users"},
     *     @OA\Response(
     *         response=200,
     *         description="List of roles",
     *         @OA\JsonContent(
     *             type="array",
     *             @OA\Items(
     *                 type="string",
     *             )
     *         )
     *     )
     * )
     */
    public function getRoles(Request $request)
    {
        return response()->json(array_keys(config('roles')));
    }

    /**
     * @OA\Get(
     *    path="/api/me",
     *    summary="Get the authenticated user",
     *    tags={"Users"},
     *    @OA\Response(
     *      response=200,
     *      description="The authenticated user",
     *      @OA\JsonContent(
     *          type="object",
     *          @OA\Property(
     *              property="id",
     *              type="integer",
     *          ),
     *          @OA\Property(
     *              property="firstname",
     *              type="string",
     *          ),
     *          @OA\Property(
     *              property="lastname",
     *              type="string",
     *          ),
     *          @OA\Property(
     *              property="email",
     *              type="string",
     *          ),
     *          @OA\Property(
     *              property="role",
     *              type="string",
     *          ),
     *          @OA\Property(
     *              property="avatar_filename",
     *              type="string",
     *              nullable=true,
     *          ),
     *          @OA\Property(
     *              property="avatar_url",
     *              type="string",
     *              nullable=true,
     *          ),
     *          @OA\Property(
     *              property="created_at",
     *              type="string",
     *              format="date-time",
     *          ),
     *          @OA\Property(
     *              property="updated_at",
     *              type="string",
     *              format="date-time",
     *          ),
     *      ),
     *    ),
     *    @OA\Response(
     *      response=401,
     *      description="Unauthenticated",
     *      @OA\JsonContent(
     *          type="object",
     *          @OA\Property(
     *              property="error",
     *              type="string",
     *          ),
     *      ),
     *    ),
     * )
     */
    public function getAuthenticatedUser(Request $request)
    {
        $user = Auth::user();
        if ($user->avatar_filename !== null) {
            $user->avatar_url = asset('storage/images/' . $user->avatar_filename);
        }
        return response()->json($user);
    }

    /**
     * @OA\Post(
     *     path="/api/users/{id}/image",
     *     summary="Upload an image for a user",
     *     tags={"Users"},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         description="The id of the user",
     *         required=true,
     *         @OA\Schema(
     *             type="integer",
     *         )
     *     ),
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\MediaType(
     *             mediaType="multipart/form-data",
     *             @OA\Schema(
     *                 @OA\Property(
     *                     property="image",
     *                     type="string",
     *                     format="binary",
     *                 ),
     *             )
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="The updated user",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(
     *                 property="id",
     *                 type="integer",
     *             ),
     *             @OA\Property(
     *                 property="firstname",
     *                 type="string",
     *             ),
     *             @OA\Property(
     *                 property="lastname",
     *                 type="string",
     *             ),
     *             @OA\Property(
     *                 property="email",
     *                 type="string",
     *             ),
     *             @OA\Property(
     *                 property="role",
     *                 type="string",
     *             ),
     *             @OA\Property(
     *                 property="avatar_filename",
     *                 type="string",
     *                 nullable=true,
     *             ),
     *             @OA\Property(
     *                 property="avatar_url",
     *                 type="string",
     *                 nullable=true,
     *             ),
     *             @OA\Property(
     *                 property="created_at",
     *                 type="string",
     *                 format="date-time",
     *             ),
     *             @OA\Property(
     *                 property="updated_at",
     *                 type="string",
     *                 format="date-time",
     *             ),
     *         ),
     *     ),
     *     @OA\Response(
     *         response=400,
     *         description="Invalid image",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(
     *                 property="error",
     *                 type="string",
     *             ),
     *         ),
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="User not found",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(
     *                 property="error",
     *                 type="string",
     *             ),
     *         ),
     *     ),
     * )
     */
    public function uploadImage(Request $request, $id)
    {
        $request->validate([
            'image' => 'required|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
        ]);

        // Recuperation de l'utilisateur
        $user = User::find($id);

        // Recuperation du fichier
        $file = $request->file('image');

        // Enregistrement du fichier dans le dossier storage/app/public/images
        $filename = $user->id . '.' . time() . '.' . $file->getClientOriginalExtension();
        $file->storeAs('public/images', $filename);

        // Enregistrement du nom du fichier dans la base de donnees
        $user->avatar_filename = $filename;

        // sauvegarde de l'utilisateur
        $user->update(['avatar_filename' => $filename]);

        // Retour de la reponse avec le user
        return response()->json($user, 200);
    }
}
