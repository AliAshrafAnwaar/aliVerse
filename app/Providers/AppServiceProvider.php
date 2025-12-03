<?php

namespace App\Providers;

use App\Models\Post;
use App\Models\Project;
use App\Models\User;
use App\Models\ContactSubmission;
use App\Models\Comment;
use App\Policies\PostPolicy;
use App\Policies\ProjectPolicy;
use App\Policies\UserPolicy;
use App\Policies\ContactSubmissionPolicy;
use App\Policies\CommentPolicy;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Vite;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Vite::prefetch(concurrency: 3);

        // Register Policies
        Gate::policy(Post::class, PostPolicy::class);
        Gate::policy(Project::class, ProjectPolicy::class);
        Gate::policy(User::class, UserPolicy::class);
        Gate::policy(ContactSubmission::class, ContactSubmissionPolicy::class);
        Gate::policy(Comment::class, CommentPolicy::class);
    }
}
