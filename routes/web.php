<?php

use App\Http\Controllers\AdminController;
use App\Http\Controllers\ApisPublic;
use App\Http\Controllers\Authredirection;
use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\Home;
use App\Http\Middleware\CheckRole;
use App\Models\Notification;
use App\Http\Controllers\NotificationsController;

Route::get('/', function () {
    return Inertia::render('Home', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
})->name('home');

Route::get('/temp', function () {
    return view('emails.custom-verify');
})->name('temp');

Route::middleware(['auth', CheckRole::class . ':user'])->prefix('user')->as('user.')->group(function () {
    Route::get('/dashboard', function () {
        return Inertia::render('Dashboard');
    })->name('dashboard');
});

Route::get('/auth/redirection', [Authredirection::class, 'index'])->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware(['auth', 'verified', CheckRole::class . ':admin'])->prefix('admin')->as('admin.')->group(function () {
    Route::get('/dashboard', [AdminController::class, 'index'])->name('dashboard');
    Route::get('/api/notifications', [NotificationsController::class, 'index'])->name('notifications');
    Route::post('/api/notifications/{id}/read', [NotificationsController::class, 'markAsRead'])->name('markAsRead');
    Route::get('/profile', [AdminController::class, 'profile'])->name('profile');
    Route::post('/api/update-profile', [AdminController::class, 'updateProfile'])->name('updateProfile');
    Route::get('/users', [AdminController::class, 'users'])->name('users');
    Route::get('/edit-user/{userId}', [AdminController::class, 'editUser'])->name('editUser');
    Route::post('/api/edit-profile/{userID}', [AdminController::class, 'updateUser'])->name('updateUser');
    Route::patch('/api/users/{id}/assign-working-group', [AdminController::class, 'assignWorkingGroup'])->name('assignWorkingGroup');
    Route::patch('/api/users/{id}/update-status', [AdminController::class, 'updateStatus'])->name('updateStatus');
    Route::delete('/api/users/{id}', [AdminController::class, 'deleteUser'])->name('deleteUser');
    Route::get('/roles', [AdminController::class, 'roles'])->name('roles');
    Route::post('/api/roles', [AdminController::class, 'storeRole'])->name('storeRole');
    Route::patch('/api/roles/{id}', [AdminController::class, 'updateRole'])->name('updateRole');
    Route::delete('/api/roles/{id}', [AdminController::class, 'deleteRole'])->name('deleteRole');
    Route::get('/assign-role', [AdminController::class, 'assignRole'])->name('assignRole');
    Route::patch('/api/assign-role', [AdminController::class, 'updateUserRole'])->name('storeAssignRole');

    // Add more admin routes here
});

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
})->middleware('verified');

Route::group(['prefix'=>'api', 'as' => 'api.'], function () {
    Route::get('/random-image', [ApisPublic::class, 'randomImage'])->name('random-image');
});

require __DIR__.'/auth.php';
