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
    Route::get('projects/{project_id}/get-rushs', 'App\Http\Controllers\ProjectController@getCaptionUrl')->name('projects.getCaptionUrl');
    Route::post('projects/{project_id}/add-rushs', 'App\Http\Controllers\ProjectController@addLinkToCaptation')->name('projects.addLink');
    Route::post('projects/{project_id}/captation-to-postproduction', 'App\Http\Controllers\StepController@captationToPostProd')->name('projects.captationToPostproduction');
    Route::post('projects/{project_id}/validate/postproduction', 'App\Http\Controllers\StepController@validatePostProd')->name('projects.validatePostProd');

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
        Route::get('projects/{projectId}/videos/validated', 'App\Http\Controllers\VideoReviewController@getVideoValidated')->name('video-reviews.getVideoValidated');
        Route::get('projects/{projectId}/videos/getuploadurl', 'App\Http\Controllers\VideoReviewController@getTemporaryUploadUrl')->name('video-reviews.getTemporaryUploadUrl');
        Route::get('projects/{projectId}/videos', 'App\Http\Controllers\VideoReviewController@getReviewsByProjectId')->name('video-reviews.getReviewsByProjectId');
        Route::post('projects/{projectId}/videos', 'App\Http\Controllers\VideoReviewController@store')->name('video-reviews.store');
        Route::post('projects/{projectId}/videos/{version}', 'App\Http\Controllers\VideoReviewController@addAComment')->name('video-reviews.addAComment');
        Route::delete('videos/{version}', 'App\Http\Controllers\VideoReviewController@destroy')->name('video-reviews.destroy');

        /************************/

        /***** Ressource *****/

        Route::get('projects/{projectId}/ressources', 'App\Http\Controllers\SharedRessourceController@index')->name('ressources.index');
        Route::get('ressources/{ressourceId}', 'App\Http\Controllers\SharedRessourceController@show')->name('ressources.show');
        Route::post('projects/{projectId}/ressources', 'App\Http\Controllers\SharedRessourceController@store')->name('ressources.store');
        Route::post('ressources/{ressourceId}/update', 'App\Http\Controllers\SharedRessourceController@update')->name('ressources.update');
        Route::delete('ressources/{ressourceId}', 'App\Http\Controllers\SharedRessourceController@destroy')->name('ressources.destroy');
        Route::get('ressources/{projectId}/types', 'App\Http\Controllers\SharedRessourceController@getRessourcesTypes')->name('ressources.getTypes');

        /************************/

        /***** Notification *****/

        Route::resource('notifications', 'App\Http\Controllers\NotificationController');

        /************************/

        /***** Transcription *****/
        Route::get('projects/{projectId}/transcriptions', 'App\Http\Controllers\TranscriptionController@index')->name('transcriptions.index');
        Route::post('projects/{projectId}/transcriptions', 'App\Http\Controllers\TranscriptionController@store')->name('transcriptions.store');
        Route::delete('projects/{projectId}/transcriptions', 'App\Http\Controllers\TranscriptionController@destroy')->name('transcriptions.destroy');
        /************************/

    Route::resource('rooms', 'App\Http\Controllers\RoomController');

    /*********************************/



});