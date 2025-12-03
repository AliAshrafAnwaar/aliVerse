<?php



// API Controllers (JSON responses)
use App\Http\Controllers\Api\PostController;
use App\Http\Controllers\Api\ProjectController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\ContactSubmissionController;
use App\Http\Controllers\Api\SkillController;
use App\Http\Controllers\Api\ExperienceController;
use App\Http\Controllers\Api\EducationController;
use App\Http\Controllers\Api\TestimonialController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| These routes return JSON responses for AJAX/fetch requests.
| Use these when you need data refresh without page reload.
|
*/

// Public API endpoints
Route::prefix('v1')->group(function () {
    
    // Blog Posts
    Route::prefix('posts')->group(function () {
        Route::get('/', [PostController::class, 'index']);
        Route::get('/{post}', [PostController::class, 'show']);
    });
    
    // Projects
    Route::prefix('projects')->group(function () {
        Route::get('/', [ProjectController::class, 'index']);
        Route::get('/{slug}', [ProjectController::class, 'show']);
    });
    
    // Skills (public read)
    Route::get('/skills', [SkillController::class, 'index']);
    Route::get('/skills/{skill}', [SkillController::class, 'show']);
    
    // Experiences (public read)
    Route::get('/experiences', [ExperienceController::class, 'index']);
    Route::get('/experiences/{experience}', [ExperienceController::class, 'show']);
    
    // Education (public read)
    Route::get('/educations', [EducationController::class, 'index']);
    Route::get('/educations/{education}', [EducationController::class, 'show']);
    
    // Testimonials (public read)
    Route::get('/testimonials', [TestimonialController::class, 'index']);
    Route::get('/testimonials/{testimonial}', [TestimonialController::class, 'show']);
    
    // Contact submission (public create)
    Route::post('/contact', [ContactSubmissionController::class, 'store']);
});

// Protected API endpoints (require authentication)
Route::prefix('v1')->middleware('auth:sanctum')->group(function () {
    
    // Blog Posts (CRUD)
    Route::prefix('posts')->group(function () {
        Route::post('/', [PostController::class, 'store']);
        Route::put('/{post}', [PostController::class, 'update']);
        Route::delete('/{post}', [PostController::class, 'destroy']);
        Route::post('/{post}/toggle-featured', [PostController::class, 'toggleFeatured']);
        Route::post('/{post}/publish', [PostController::class, 'publish']);
        Route::post('/{post}/unpublish', [PostController::class, 'unpublish']);
    });
    
    // Projects (CRUD)
    Route::prefix('projects')->group(function () {
        Route::post('/', [ProjectController::class, 'store']);
        Route::put('/{project}', [ProjectController::class, 'update']);
        Route::delete('/{project}', [ProjectController::class, 'destroy']);
    });
    
    // Users (Admin)
    Route::prefix('users')->group(function () {
        Route::get('/', [UserController::class, 'index']);
        Route::get('/{user}', [UserController::class, 'show']);
        Route::put('/{user}', [UserController::class, 'update']);
        Route::delete('/{user}', [UserController::class, 'destroy']);
        Route::post('/{user}/toggle-admin', [UserController::class, 'toggleAdmin']);
        Route::post('/{user}/toggle-ban', [UserController::class, 'toggleBan']);
    });
    
    // Skills (CRUD)
    Route::prefix('skills')->group(function () {
        Route::post('/', [SkillController::class, 'store']);
        Route::put('/{skill}', [SkillController::class, 'update']);
        Route::delete('/{skill}', [SkillController::class, 'destroy']);
    });
    
    // Experiences (CRUD)
    Route::prefix('experiences')->group(function () {
        Route::post('/', [ExperienceController::class, 'store']);
        Route::put('/{experience}', [ExperienceController::class, 'update']);
        Route::delete('/{experience}', [ExperienceController::class, 'destroy']);
    });
    
    // Education (CRUD)
    Route::prefix('educations')->group(function () {
        Route::post('/', [EducationController::class, 'store']);
        Route::put('/{education}', [EducationController::class, 'update']);
        Route::delete('/{education}', [EducationController::class, 'destroy']);
    });
    
    // Testimonials (CRUD)
    Route::prefix('testimonials')->group(function () {
        Route::post('/', [TestimonialController::class, 'store']);
        Route::put('/{testimonial}', [TestimonialController::class, 'update']);
        Route::delete('/{testimonial}', [TestimonialController::class, 'destroy']);
    });
    
    // Contact Submissions (Admin)
    Route::prefix('contact-submissions')->group(function () {
        Route::get('/', [ContactSubmissionController::class, 'index']);
        Route::get('/{submission}', [ContactSubmissionController::class, 'show']);
        Route::delete('/{submission}', [ContactSubmissionController::class, 'destroy']);
        Route::post('/{submission}/mark-read', [ContactSubmissionController::class, 'markAsRead']);
        Route::post('/{submission}/mark-unread', [ContactSubmissionController::class, 'markAsUnread']);
        Route::post('/bulk-delete', [ContactSubmissionController::class, 'bulkDestroy']);
        Route::post('/bulk-mark-read', [ContactSubmissionController::class, 'bulkMarkAsRead']);
        Route::post('/bulk-mark-unread', [ContactSubmissionController::class, 'bulkMarkAsUnread']);
    });
});