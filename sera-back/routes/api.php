<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware(['auth:sanctum'])->get('me', 'App\Http\Controllers\UserController@getAuthenticatedUser')->name('me');

// Route to echo all headers and cookies
Route::get('headers', function (Request $request) {
    return response()->json([
        'headers' => $request->headers->all(),
        'cookies' => $request->cookies->all(),
    ]);
});

Route::group(['middleware' => ['App\Http\Middleware\CheckRoleAccess']], function () {

    Route::resource('projects-requests', 'App\Http\Controllers\ProjectRequestController');

    Route::resource('users', 'App\Http\Controllers\UserController')->except(['store']);
    Route::post('users', 'App\Http\Controllers\Auth\RegisteredUserController@store')->name('users.store');

    Route::get('roles', 'App\Http\Controllers\UserController@getRoles')->name('users.roles');

    Route::resource('projects', 'App\Http\Controllers\ProjectController');
    Route::put('projects/{projectRequestId}/steps/0-1', 'App\Http\Controllers\StepController@StepZeroToOne')->name('projects.steps0-1');




    Route::post('teams/{projectId}/add', 'App\Http\Controllers\TeamController@update')->name('teams.add');
    Route::post('teams/{projectId}/remove/{userId}', 'App\Http\Controllers\TeamController@remove')->name('teams.remove');
    Route::resource('teams', 'App\Http\Controllers\TeamController')->except(['update','store','destroy']);


    Route::resource('rooms', 'App\Http\Controllers\RoomController');
});
