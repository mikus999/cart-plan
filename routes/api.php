<?php

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

Route::group(['middleware' => 'auth:api'], function () {
    Route::post('logout', 'Auth\LoginController@logout');

    Route::get('/user', 'Auth\UserController@current');
    Route::get('user/permissions', 'Auth\UserController@getPermissions');
    Route::post('user/permissions', 'Auth\UserController@setPermissions');
    Route::post('user/roles', 'Auth\UserController@setRoles');

    Route::patch('settings/profile', 'Settings\ProfileController@update');
    Route::patch('settings/password', 'Settings\PasswordController@update');

    // TEAM routes
    Route::post('teams/jointeam', 'TeamController@addUserToTeam');
    Route::post('teams/leaveteam', 'TeamController@removeUserFromTeam');
    Route::get('teams/resetcode/{id}', 'TeamController@changeTeamCode');
    Route::get('teams/findteam/{code}', 'TeamController@findTeamByCode');
    Route::get('teams/users/{id}', 'TeamController@getTeamUsers');

    // SHIFT routes
    Route::post('schedules/joinshift', 'ShiftController@addUserToShift');
    Route::post('schedules/leaveshift', 'ShiftController@removeUserFromShift');

    // SCHEDULE routes
    Route::get('schedules/{teamid}', ['as' => 'schedules.index', 'uses' => 'ScheduleController@index']);
    Route::get('schedules/{id}/counts/{date}/{dayOfWeek}', 'ScheduleController@getShiftCounts');
    
    // LOCATION routes
    Route::post('teams/{teamid}/locations/{locid}/makedefault', 'LocationController@setDefault');

    // API Resource Routes
    Route::apiResource('teams', 'TeamController');
    Route::apiResource('teams.locations', 'LocationController');
    Route::apiResource('schedules', 'ScheduleController', ['except' => ['index']]);
    Route::apiResource('schedules.shifts', 'ShiftController');

});

Route::group(['middleware' => 'guest:api'], function () {
    Route::post('login', 'Auth\LoginController@login');
    Route::post('register', 'Auth\RegisterController@register');

    Route::post('password/email', 'Auth\ForgotPasswordController@sendResetLinkEmail');
    Route::post('password/reset', 'Auth\ResetPasswordController@reset');

    Route::post('email/verify/{user}', 'Auth\VerificationController@verify')->name('verification.verify');
    Route::post('email/resend', 'Auth\VerificationController@resend');

    Route::post('oauth/{driver}', 'Auth\OAuthController@redirectToProvider');
    Route::get('oauth/{driver}/callback', 'Auth\OAuthController@handleProviderCallback')->name('oauth.callback');
});
