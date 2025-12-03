<?php

use App\Http\Controllers\AdminController;
use App\Http\Controllers\ContactController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\PortfolioController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ReactionController;
use App\Http\Controllers\CommentController;

// Web Controllers (Inertia/redirect responses)
use App\Http\Controllers\Web\PostController;
use App\Http\Controllers\Web\ProjectController;
use App\Http\Controllers\Web\UserController;
use App\Http\Controllers\Web\ContactSubmissionController;
use App\Http\Controllers\Web\SkillController;
use App\Http\Controllers\Web\ExperienceController;
use App\Http\Controllers\Web\EducationController;
use App\Http\Controllers\Web\TestimonialController;

use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Public Home route - Shows Ali's portfolio (user ID 1) - no auth required
Route::get('/', [HomeController::class, 'index'])->name('home');

Route::get('/welcome', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
})->name('welcome');

// Admin dashboard
Route::get('/dashboard', [DashboardController::class, 'index'])->middleware(['auth', 'verified'])->name('dashboard');

// User portfolio
Route::get('/portfolio', [PortfolioController::class, 'index'])->middleware(['auth', 'verified'])->name('portfolio');
Route::get('/portfolio/show', [PortfolioController::class, 'show'])->middleware(['auth', 'verified'])->name('portfolio.show');

// Public Project Routes
Route::get('/projects', [ProjectController::class, 'index'])->name('projects.index');
Route::get('/projects/{slug}', [ProjectController::class, 'show'])->name('projects.show');

// Public Blog Routes
Route::get('/blog', [PostController::class, 'index'])->name('posts.index');
Route::get('/blog/{post:slug}', [PostController::class, 'show'])->name('posts.show');

// Public Contact Route
Route::get('/contact', [ContactController::class, 'index'])->name('contact.index');
Route::post('/contact', [ContactController::class, 'store'])->name('contact.store');

// Reaction Routes (requires authentication)
Route::middleware('auth')->group(function () {
    Route::post('/reactions', [ReactionController::class, 'store'])->name('reactions.add');
    Route::delete('/reactions', [ReactionController::class, 'destroy'])->name('reactions.remove');
    Route::get('/reactions', [ReactionController::class, 'index'])->name('reactions.index');
});

// Comment Routes (requires authentication for create/update/delete)
Route::middleware('auth')->group(function () {
    Route::post('/comments', [CommentController::class, 'store'])->name('comments.store');
    Route::put('/comments/{comment}', [CommentController::class, 'update'])->name('comments.update');
    Route::delete('/comments/{comment}', [CommentController::class, 'destroy'])->name('comments.destroy');
    
    // Admin only comment moderation
    Route::middleware('admin')->group(function () {
        Route::post('/comments/{comment}/approve', [CommentController::class, 'approve'])->name('comments.approve');
        Route::post('/comments/{comment}/reject', [CommentController::class, 'reject'])->name('comments.reject');
    });
});

// Admin Routes
Route::middleware(['auth', 'admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/', [AdminController::class, 'index'])->name('dashboard');
    
    // Admin Contact Routes
    Route::get('/contact/edit', [ContactController::class, 'edit'])->name('contact.edit');
    Route::put('/contact', [ContactController::class, 'update'])->name('contact.update');
    
    // Admin Project Routes
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
    
    // Admin User Routes
    Route::get('/users', [UserController::class, 'index'])->name('users.index');
    Route::get('/users/{user}', [UserController::class, 'show'])->name('users.show');
    Route::get('/users/{user}/edit', [UserController::class, 'edit'])->name('users.edit');
    Route::put('/users/{user}', [UserController::class, 'update'])->name('users.update');
    Route::delete('/users/{user}', [UserController::class, 'destroy'])->name('users.destroy');
    Route::post('/users/{user}/toggle-admin', [UserController::class, 'toggleAdmin'])->name('users.toggle-admin');
    Route::post('/users/{user}/toggle-ban', [UserController::class, 'toggleBan'])->name('users.toggle-ban');
    
    // Admin Portfolio Management Routes
    Route::resource('skills', SkillController::class);
    Route::resource('experiences', ExperienceController::class);
    Route::resource('educations', EducationController::class);
    Route::resource('testimonials', TestimonialController::class);
    
    // Admin Contact Submissions Routes
    Route::get('contact-submissions', [ContactSubmissionController::class, 'index'])->name('contact-submissions.index');
    Route::get('contact-submissions/{submission}', [ContactSubmissionController::class, 'show'])->name('contact-submissions.show');
    Route::delete('contact-submissions/{submission}', [ContactSubmissionController::class, 'destroy'])->name('contact-submissions.destroy');
    Route::post('contact-submissions/{submission}/mark-read', [ContactSubmissionController::class, 'markAsRead'])->name('contact-submissions.mark-read');
    Route::post('contact-submissions/{submission}/mark-unread', [ContactSubmissionController::class, 'markAsUnread'])->name('contact-submissions.mark-unread');
    Route::post('contact-submissions/bulk-delete', [ContactSubmissionController::class, 'bulkDestroy'])->name('contact-submissions.bulk-delete');
    Route::post('contact-submissions/bulk-mark-read', [ContactSubmissionController::class, 'bulkMarkAsRead'])->name('contact-submissions.bulk-mark-read');
    Route::post('contact-submissions/bulk-mark-unread', [ContactSubmissionController::class, 'bulkMarkAsUnread'])->name('contact-submissions.bulk-mark-unread');
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
