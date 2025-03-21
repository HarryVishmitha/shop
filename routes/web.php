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
    Route::get('/profile', [AdminController::class, 'profile'])->name('profile');
    Route::post('/api/update-profile', [AdminController::class, 'updateProfile'])->name('updateProfile');
    Route::get('/users', [AdminController::class, 'users'])->name('users');
    Route::get('/edit-user/{userId}', [AdminController::class, 'editUser'])->name('editUser');
    Route::post('/api/edit-profile/{userID}', [AdminController::class, 'updateUser'])->name('updateUser');
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
