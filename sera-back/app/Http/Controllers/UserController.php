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
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        try {
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

            // Pagination
            $maxPerPage = $request->input('maxPerPage', 10); // Default to 10 if not specified
            $users = $usersQuery->paginate($maxPerPage);

            return response()->json($users);
        } catch (\Exception $exception) {
            return response()->json(['error' => 'Failed to retrieve users'], 500);
        }
    }



    /**
     * Display the specified resource.
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
     * Update the specified resource in storage.
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
     * Remove the specified resource from storage.
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

    public function getRoles(Request $request)
    {
        return response()->json(array_keys(config('roles')));
    }

    public function getAuthenticatedUser(Request $request)
    {

        // if (!$request->user()) {
        //     return response()->json(['error' => 'Unauthorized'], 401);
        // }

        return response()->json(Auth::user());
    }

    public function uploadImage(Request $request,$id)
    {
        $request->validate([
            'image' => 'required|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
        ]);

        // Recuperation de l'utilisateur
        $user = User::find($id);

        // Recuperation du fichier
        $file = $request->file('image');

        // Enregistrement du fichier dans le dossier storage/app/public/images
        $filename = $user->id .'.' . time() . '.' . $file->getClientOriginalExtension();
        $file->storeAs('public/images', $filename);

        // Enregistrement du nom du fichier dans la base de donnees
        $user->avatar_filename = $filename;

        // sauvegarde de l'utilisateur
        $user->update(['avatar_filename' => $filename]);

        // Retour de la reponse avec le user
        return response()->json($user, 200);
    }
}
