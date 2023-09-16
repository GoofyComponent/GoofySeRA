<?php

namespace App\Http\Controllers;

use App\Models\User;
use Intervention\Image\ImageManager;

use Illuminate\Http\Request;
use Illuminate\Validation\Rules;
use App\Services\CreateMinioUser;

use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Facades\Storage;

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
     *     @OA\Parameter(
     *         name="name",
     *         in="query",
     *         description="Search by name (firstname or lastname)",
     *         required=false,
     *         @OA\Schema(
     *             type="string",
     *         )
     *     ),
     *
     *
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
            'name' => 'string',
            'role' => 'string|in:' . implode(',', array_keys(config('roles'))),
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

        // Search by name (optional)
        if ($request->filled('name')) {
            $name = $request->input('name');

            $usersQuery->where(function ($query) use ($name) {
                $query->whereRaw('CONCAT(firstname, " ", lastname) LIKE ?', ['%' . $name . '%'])
                    ->orWhereRaw('CONCAT(lastname, " ", firstname) LIKE ?', ['%' . $name . '%'])
                    ->orWhereRaw('email LIKE ?', ['%' . $name . '%']);
            });

        }

        $usersQuery->orderBy('updated_at', $sort);

        // Pagination
        $maxPerPage = $validated['maxPerPage'] ?? 10; // Default to 10 if not specified
        $users = $usersQuery->paginate($maxPerPage);


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
        // même si s3_credentials est caché, il est quand même retourné par la requête
        $user = Auth::user()->makeVisible('s3_credentials');
        $user->s3_credentials = json_decode($user->s3_credentials);
        // on enlève les hash des credentials dans accesskey et secretkey
        $user->s3_credentials->accesskey = Crypt::decrypt($user->s3_credentials->accesskey);
        $user->s3_credentials->secretkey = Crypt::decrypt($user->s3_credentials->secretkey);

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

        $filename = $user->id . '_' . time() . '.' . $request->file('image')->getClientOriginalExtension();

        $image = $request->file('image');
        $manager = new ImageManager(['driver' => 'imagick']);

        $image_resize = $manager->make($image->getRealPath())->resize(300, 300, function ($constraint) {
            $constraint->aspectRatio();
        });
        $image_resize->stream();

        Storage::disk('s3')->put("/avatar/".$filename, $image_resize);

        $user->avatar_filename = "/avatar/".$filename;

        $user->save();

        return response()->json($user, 200);
    }

    /**
     * @OA\Post(
     *     path="/api/users/password",
     *     summary="Change the password of a user",
     *     tags={"Users"},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             @OA\Property(
     *                 property="current_password",
     *                 type="string",
     *             ),
     *             @OA\Property(
     *                 property="new_password",
     *                 type="string",
     *             ),
     *             @OA\Property(
     *                 property="new_confirm_password",
     *                 type="string",
     *             ),
     *
     *         ),
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Password changed",
     *     ),
     *     @OA\Response(
     *         response=400,
     *         description="Invalid current_password, new_password, or new_confirm_password",
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
    public function changePassword(Request $request)
    {
        $request->validate([
            'current_password' => 'required|string',
            'new_password' => 'required|string',
            'new_confirm_password' => 'required|string',
            'user_id' =>'string'
        ]);

        if($request->user_id){
            $user = User::find($request->user_id);
        }else{
            $user = User::find($request->user()->id);
        }

        if ($user === null) {
            return response()->json(['error' => 'User not found.'], 404);
        }

        if ($request->new_password !== $request->new_confirm_password) {
            return response()->json(['error' => 'New password and new confirm password must match.'], 400);
        }

        if (!Hash::check($request->current_password, $user->password)) {
            return response()->json(['error' => 'Current password is incorrect.'], 400);
        }

        $user->password = Hash::make($request->new_password);

        $user->save();

        return response()->json(['message' => 'Password changed.']);
    }

    /**
    *   @OA\Get(
    *       path="/api/users/get/reservations",
    *       summary="Get the reservations of one user",
    *       tags={"Users"},
    *       @OA\Parameter(
    *           name="user_id",
    *           in="query",
    *           description="The id of the user",
    *           required=true,
    *           @OA\Schema(
    *               type="integer",
    *           )
    *       ),
    *       @OA\Response(
    *           response=200,
    *           description="The reservations of one user",
    *           @OA\JsonContent(
    *               type="array",
    *               @OA\Items(
    *                   type="object",
    *                   @OA\Property(
    *                       property="id",
    *                       type="integer",
    *                   ),
    *                   @OA\Property(
    *                       property="room_id",
    *                       type="integer",
    *                   ),
    *                   @OA\Property(
    *                       property="project_id",
    *                       type="integer",
    *                   ),
    *                   @OA\Property(
    *                       property="date",
    *                       type="string",
    *                       format="date",
    *                   ),
    *                   @OA\Property(
    *                       property="start_time",
    *                       type="string",
    *                       format="time",
    *                   ),
    *                   @OA\Property(
    *                       property="end_time",
    *                       type="string",
    *                       format="time",
    *                   ),
    *                   @OA\Property(
    *                       property="title",
    *                       type="string",
    *                   ),
    *                   @OA\Property(
    *                       property="users",
    *                       type="array",
    *                       @OA\Items(
    *                           type="object",
    *                           @OA\Property(
    *                               property="firstname",
    *                               type="string",
    *                           ),
    *                           @OA\Property(
    *                               property="lastname",
    *                               type="string",
    *                           ),
    *                           @OA\Property(
    *                               property="role",
    *                               type="string",
    *                           ),
    *                           @OA\Property(
    *                               property="id",
    *                               type="integer",
    *                           ),
    *                       ),
    *                   ),
    *                   @OA\Property(
    *                       property="created_at",
    *                       type="string",
    *                       format="date-time",
    *                   ),
    *                   @OA\Property(
    *                       property="updated_at",
    *                       type="string",
    *                       format="date-time",
    *                   ),
    *               ),
    *           ),
    *       ),
    *       @OA\Response(
    *           response=401,
    *           description="Unauthenticated",
    *           @OA\JsonContent(
    *               type="object",
    *               @OA\Property(
    *                   property="error",
    *                   type="string",
    *               ),
    *           ),
    *       ),
    *   )
    */
    public function getReservations(Request $request)
    {
        $request->validate([
            'user_id' => 'required|integer',
        ]);

        $user = User::find($request->user_id);

        if ($user === null) {
            return response()->json(['error' => 'User not found.'], 404);
        }

        $projects = $user->projects();

        $reservations = [];
        foreach ($projects as $project) {
            $reservations[] = $project->reservations()->get();
        }

        $reservations = collect($reservations)->flatten()->map(function ($reservation) {
            return [
                'date' => $reservation->date,
                'start_time' => $reservation->start_time,
                'end_time' => $reservation->end_time,
            ];
        });

        return response()->json($reservations);
    }

    /**
    *  @OA\Get(
    *       path="/api/iso",
    *       summary="Get the iso list",
    *       tags={"Users"},
    *       @OA\Response(
    *           response=200,
    *           description="The iso list",
    *           @OA\JsonContent(
    *               type="array",
    *               @OA\Items(
    *                   type="object",
    *                   @OA\Property(
    *                       property="code",
    *                       type="string",
    *                   ),
    *                   @OA\Property(
    *                       property="name",
    *                       type="string",
    *                   ),
    *               ),
    *           ),
    *       ),
    *   )
    */
    function getIsoList(){
        $languages = \ResourceBundle::getLocales('');
        return response()->json($languages);
    }

}
