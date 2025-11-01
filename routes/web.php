<?php

use App\Http\Controllers\ContactController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ProjectController;
use App\Http\Controllers\PostController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

// Public Project Routes
Route::get('/projects', [ProjectController::class, 'index'])->name('projects.index');
Route::get('/projects/{slug}', [ProjectController::class, 'show'])->name('projects.show');

// Public Blog Routes
Route::get('/blog', [PostController::class, 'index'])->name('posts.index');
Route::get('/blog/{post:slug}', [PostController::class, 'show'])->name('posts.show');

// Public Contact Route
Route::get('/contact', [ContactController::class, 'index'])->name('contact.index');

// Admin Project Routes
Route::middleware(['auth', 'admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/projects', [ProjectController::class, 'adminIndex'])->name('projects.index');
    Route::get('/projects/create', [ProjectController::class, 'create'])->name('projects.create');
    Route::post('/projects', [ProjectController::class, 'store'])->name('projects.store');
    Route::get('/projects/{project}', [ProjectController::class, 'adminShow'])->name('projects.show');
    Route::get('/projects/{project}/edit', [ProjectController::class, 'edit'])->name('projects.edit');
    Route::put('/projects/{project}', [ProjectController::class, 'update'])->name('projects.update');
    Route::delete('/projects/{project}', [ProjectController::class, 'destroy'])->name('projects.destroy');
    
    // Admin Blog Routes
    Route::get('/blog', [PostController::class, 'adminIndex'])->name('posts.index');
    Route::get('/blog/create', [PostController::class, 'create'])->name('posts.create');
    Route::post('/blog', [PostController::class, 'store'])->name('posts.store');
    Route::get('/blog/{post}/edit', [PostController::class, 'edit'])->name('posts.edit');
    Route::put('/blog/{post}', [PostController::class, 'update'])->name('posts.update');
    Route::delete('/blog/{post}', [PostController::class, 'destroy'])->name('posts.destroy');
    Route::post('/blog/{post}/toggle-featured', [PostController::class, 'toggleFeatured'])->name('posts.toggle-featured');
    Route::post('/blog/{post}/publish', [PostController::class, 'publish'])->name('posts.publish');
    Route::post('/blog/{post}/unpublish', [PostController::class, 'unpublish'])->name('posts.unpublish');

    // Admin Contact Routes
    Route::get('/contact/edit', [ContactController::class, 'edit'])->name('contact.edit');
    Route::put('/contact', [ContactController::class, 'update'])->name('contact.update');
});

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'updateBasic'])->name('profile.update');
    Route::put('/profile', [ProfileController::class, 'update'])->name('profile.update.full');
    Route::patch('/profile/avatar', [ProfileController::class, 'updateAvatar'])->name('profile.update.avatar');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
    Route::delete('/profile/avatar', [ProfileController::class, 'removeAvatar'])->name('profile.avatar.remove');
});

require __DIR__.'/auth.php';
