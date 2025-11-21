<?php

namespace App\Http\Controllers;

use App\Models\Skill;
use App\Models\Experience;
use App\Models\Education;
use App\Models\Testimonial;
use App\Models\Project;
use App\Models\Post;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class HomeController extends Controller
{
    /**
     * Handle the incoming request for role-based redirect.
     */
    public function __invoke(Request $request)
    {
        $user = Auth::user();
        
        // // If user is admin, redirect to admin dashboard
        // if ($user && $user->isAdmin()) {
        //     return redirect()->route('admin.dashboard');
        // }
        
        // If user is regular user, redirect to home
        // if ($user) {
            return redirect()->route('home');
        // }
        
        // If not authenticated, redirect to welcome page
        return redirect()->route('welcome');
    }

    /**
     * Show the home page for regular users.
     */
    public function index(Request $request)
    {
        // Redirect admins to admin dashboard
        // if (Auth::user() && Auth::user()->isAdmin()) {
        //     return redirect()->route('admin.dashboard');
        // }

        // Get portfolio owner (admin user - ID 1) instead of current authenticated user
        $portfolioOwner = \App\Models\User::findOrFail(1);

        // Get comprehensive portfolio data using model scopes (same as PortfolioController)
        $skills = Skill::ordered()->get();
        // Order experiences: past experiences by start_date DESC, then current jobs at the end
        $experiences = Experience::orderByRaw('is_current ASC')
            ->orderBy('start_date', 'asc')
            ->get();
        $educations = Education::orderBy('start_date', 'asc')->get();
        $testimonials = Testimonial::active()->ordered()->get();

        // Group skills by category for better organization
        $groupedSkills = $skills->groupBy('category');
        $featuredSkills = $skills->where('is_featured', true);

        // Get current and past experiences (already ordered: past first, then current)
        $currentExperience = $experiences->where('is_current', true)->first();
        $pastExperiences = $experiences->where('is_current', false)->values();

        // Projects and posts for existing sections
        $latestProjects = Project::published()->ordered()->take(6)->get();
        $featuredProjects = Project::published()->featured()->ordered()->take(3)->get();
        $latestPosts = Post::published()->with('category')->latest()->take(3)->get();

        // Calculate stats
        $stats = [
            'total_projects' => Project::published()->count(),
            'total_skills' => Skill::count(),
            'total_experiences' => Experience::count(),
            'total_testimonials' => Testimonial::active()->count(),
            'total_posts' => Post::published()->count(),
        ];

        return Inertia::render('Home', [
            'portfolioOwner' => $portfolioOwner,
            'stats' => $stats,
            'featuredProjects' => $featuredProjects,
            'latestProjects' => $latestProjects,
            'latestPosts' => $latestPosts,
            'featuredSkills' => $featuredSkills,
            'groupedSkills' => $groupedSkills,
            'currentExperience' => $currentExperience,
            'experiences' => $pastExperiences, // Send only past experiences to avoid duplication with currentExperience
            'educations' => $educations,
            'testimonials' => $testimonials,
        ]);
    }
}
