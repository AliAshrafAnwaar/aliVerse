<?php

use App\Http\Controllers\PostController;
use Illuminate\Support\Facades\Route;

// API Routes for Blog Posts
Route::prefix('blog')->group(function () {
    // Public endpoints
    Route::get('/', [PostController::class, 'apiIndex']);
    Route::get('/{post}', [PostController::class, 'apiShow']);
    
    // Protected endpoints (require authentication)
    Route::middleware('auth:sanctum')->group(function () {
        Route::post('/', [PostController::class, 'store']);
        Route::put('/{post}', [PostController::class, 'update']);
        Route::delete('/{post}', [PostController::class, 'destroy']);
        Route::post('/{post}/toggle-featured', [PostController::class, 'toggleFeatured']);
        Route::post('/{post}/publish', [PostController::class, 'publish']);
        Route::post('/{post}/unpublish', [PostController::class, 'unpublish']);
    });
});