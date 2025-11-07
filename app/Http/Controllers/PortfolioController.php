<?php

namespace App\Http\Controllers;

use App\Models\Skill;
use App\Models\Experience;
use App\Models\Education;
use App\Models\Testimonial;
use App\Models\Project;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class PortfolioController extends Controller
{
    /**
     * Show the user portfolio.
     */
    public function index(Request $request)
    {
        // Redirect admins to admin dashboard
        if (Auth::user() && Auth::user()->isAdmin()) {
            return redirect()->route('admin.dashboard');
        }

        // Get all portfolio data
        $skills = Skill::ordered()->get();
        $experiences = Experience::ordered()->get();
        $educations = Education::ordered()->get();
        $testimonials = Testimonial::active()->ordered()->get();

        // Group skills by category for better organization
        $groupedSkills = $skills->groupBy('category');

        return Inertia::render('Portfolio/Portfolio', [
            'skills' => $skills,
            'groupedSkills' => $groupedSkills,
            'experiences' => $experiences,
            'educations' => $educations,
            'testimonials' => $testimonials,
        ]);
    }

    /**
     * Show the detailed portfolio view.
     */
    public function show(Request $request)
    {
        // Get portfolio owner (admin user - ID 1)
        $portfolioOwner = User::findOrFail(1);
        
        // Get all portfolio data with featured prioritization
        $skills = Skill::ordered()->get();
        // Order experiences chronologically for timeline map (oldest to newest)
        $experiences = Experience::orderBy('start_date', 'asc')->get();
        $educations = Education::ordered()->get();
        $testimonials = Testimonial::active()->ordered()->get();
        $projects = Project::published()->ordered()->get();

        // Group skills by category and separate featured items
        $groupedSkills = $skills->groupBy('category');
        $featuredSkills = $skills->where('is_featured', true);
        $featuredTestimonials = $testimonials->where('is_featured', true);
        $featuredProjects = $projects->where('featured', true);
        $currentExperience = $experiences->where('is_current', true)->first();
        $pastExperiences = $experiences->where('is_current', false);

        // Get statistics
        $stats = [
            'total_skills' => $skills->count(),
            'featured_skills' => $featuredSkills->count(),
            'total_experiences' => $experiences->count(),
            'current_experience' => $currentExperience ? 1 : 0,
            'total_educations' => $educations->count(),
            'total_testimonials' => $testimonials->count(),
            'featured_testimonials' => $featuredTestimonials->count(),
            'total_projects' => $projects->count(),
            'featured_projects' => $featuredProjects->count(),
        ];

        return Inertia::render('Portfolio/Show', [
            'portfolioOwner' => $portfolioOwner,
            'skills' => $skills,
            'groupedSkills' => $groupedSkills,
            'featuredSkills' => $featuredSkills,
            'experiences' => $experiences,
            'currentExperience' => $currentExperience,
            'pastExperiences' => $pastExperiences,
            'educations' => $educations,
            'testimonials' => $testimonials,
            'featuredTestimonials' => $featuredTestimonials,
            'projects' => $projects,
            'featuredProjects' => $featuredProjects,
            'stats' => $stats,
        ]);
    }
}
