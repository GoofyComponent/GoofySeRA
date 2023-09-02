<?php

namespace App\Http\Controllers\Auth;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Validation\Rules;
use App\Services\CreateMinioUser;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Auth\Events\Registered;
use Illuminate\Support\Facades\Crypt;


class RegisteredUserController extends Controller
{
    /**
     * Handle an incoming registration request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(Request $request): Response
    {
        $request->validate([
            'email' => ['required', 'string', 'email', 'max:255', 'unique:' . User::class],
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
            'firstname' => 'required|string|max:255',
            'lastname' => 'required|string|max:255',
            'role' => 'required|string|in:' . implode(',', array_keys(config('roles'))),
        ]);

        $s3_credentials = (new CreateMinioUser())->create();
        $s3_credentials['secretkey'] = Crypt::encrypt($s3_credentials['secretkey']);
        $s3_credentials['accesskey'] = Crypt::encrypt($s3_credentials['accesskey']);

        $user = User::create([
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'firstname' => $request->firstname,
            'lastname' => $request->lastname,
            'role' => $request->role,
            's3_credentials' => json_encode($s3_credentials),
        ]);

        event(new Registered($user));

        Auth::login($user);

        return response()->noContent();
    }
}
