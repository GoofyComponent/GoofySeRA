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


    /**** Project Request ****/

    Route::resource('projects-requests', 'App\Http\Controllers\ProjectRequestController');

    /*****************************/

    /************ USER ************/

    Route::get('users/get/reservations', 'App\Http\Controllers\UserController@getReservations')->name('users.reservations');
    Route::post('users/password', 'App\Http\Controllers\UserController@changePassword')->name('users.password');
    Route::post('users/{id}/image', 'App\Http\Controllers\UserController@uploadImage')->name('users.image');
    Route::resource('users', 'App\Http\Controllers\UserController')->except(['store']);
    Route::post('users', 'App\Http\Controllers\Auth\RegisteredUserController@store')->name('users.store');
    Route::get('roles', 'App\Http\Controllers\UserController@getRoles')->name('users.roles');

    /*****************************/

    /************ Project ************/

    Route::resource('projects', 'App\Http\Controllers\ProjectController');
    Route::post('projects/init', 'App\Http\Controllers\StepController@InitProject')->name('projects.init');
    Route::get('projects/{id}/steps', 'App\Http\Controllers\StepController@getSteps')->name('projects.stepsGet');
    Route::post('projects/steps/update-date', 'App\Http\Controllers\StepController@updateDateToAStep')->name('projects.stepsUpdateDate');
    Route::post('projects/{project_id}/planification-to-captation', 'App\Http\Controllers\StepController@planificationToCaptation')->name('projects.planificationToCaptation');
    Route::post('projects/{project_id}/add-link', 'App\Http\Controllers\ProjectController@addLinkToCaptation')->name('projects.addLink');
    Route::post('projects/{project_id}/captation-to-postproduction', 'App\Http\Controllers\StepController@captationToPostProd')->name('projects.captationToPostproduction');

        /****TEAM ****/

            Route::post('projects/{projectId}/teams/add', 'App\Http\Controllers\TeamController@update')->name('teams.add');
            Route::post('projects/{projectId}/teams/remove', 'App\Http\Controllers\TeamController@remove')->name('teams.remove');
            Route::get('projects/{projectId}/teams', 'App\Http\Controllers\TeamController@show')->name('teams.show');
            Route::get('teams', 'App\Http\Controllers\TeamController@index')->name('teams.index');

        /*************/

        /***** Room *****/

        Route::post('projects/{projectId}/room/reserve', 'App\Http\Controllers\RoomController@reserve')->name('rooms.reserve');
        Route::post('projects/room/unreserve', 'App\Http\Controllers\RoomController@unreserve')->name('rooms.unreserve');
        Route::get('rooms/available', 'App\Http\Controllers\RoomController@getAvailableRooms')->name('rooms.available');
        Route::get('projects/{projectId}/rooms', 'App\Http\Controllers\RoomController@showByProject')->name('rooms.showByProject');
        Route::resource('rooms', 'App\Http\Controllers\RoomController');

        /****************/


        /***** Video Review *****/

        Route::get('projects/{projectId}/video-reviews', 'App\Http\Controllers\VideoReviewController@getReviewsByProjectId')->name('video-reviews.getReviewsByProjectId');

        /************************/

    Route::resource('rooms', 'App\Http\Controllers\RoomController');

    /*********************************/
    Route::resource('ressources', 'App\Http\Controllers\SharedRessourceController');

});
