<?php

use App\Http\Middleware\ApiCheck;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    return ['Laravel' => app()->version()];
});

Route::get('/courses', 'App\Http\Controllers\CourseController@index')->name('courses.index')->middleware(ApiCheck::class);
Route::get('/courses/{course}', 'App\Http\Controllers\CourseController@show')->name('courses.show')->middleware(ApiCheck::class);


// Route::get('/test', 'App\Http\Controllers\UserController@test')->name('test');

require __DIR__.'/auth.php';
