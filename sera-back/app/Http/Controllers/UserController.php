<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;


class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        try {
            return User::where('id', '!=', auth()->user()->id)->get();
        } catch (\Exception $e) {
            return response()->json(['error' => 'Users not found.'], 404);
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
}