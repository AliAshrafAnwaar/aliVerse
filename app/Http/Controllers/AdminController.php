<?php

namespace App\Http\Controllers;

use App\Models\Post;
use App\Models\Project;
use App\Models\Contact;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class AdminController extends Controller
{
    /**
     * Display the admin dashboard.
     */
    public function index(): Response
    {
        $user = Auth::user();
        
        // Get statistics
        $stats = [
            'total_posts' => Post::count(),
            'published_posts' => Post::published()->count(),
            'total_projects' => Project::count(),
            'published_projects' => Project::published()->count(),
            'total_users' => User::count(),
            'contact_info' => Contact::where('is_active', true)->exists(),
        ];

        // Get recent posts
        $recentPosts = Post::with('user')
            ->orderBy('created_at', 'desc')
            ->take(5)
            ->get();

        // Get recent projects
        $recentProjects = Project::with('user')
            ->orderBy('created_at', 'desc')
            ->take(5)
            ->get();

        // Get recent users
        $recentUsers = User::orderBy('created_at', 'desc')
            ->take(5)
            ->get();

        return Inertia::render('Admin/Dashboard', [
            'stats' => $stats,
            'recentPosts' => $recentPosts,
            'recentProjects' => $recentProjects,
            'recentUsers' => $recentUsers,
        ]);
    }
}
