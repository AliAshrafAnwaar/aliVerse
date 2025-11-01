<?php

namespace App\Http\Controllers;

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
        
        // If user is admin, redirect to admin dashboard
        if ($user && $user->isAdmin()) {
            return redirect()->route('admin.dashboard');
        }
        
        // If user is regular user, redirect to home
        if ($user) {
            return redirect()->route('home');
        }
        
        // If not authenticated, redirect to welcome page
        return redirect()->route('welcome');
    }

    /**
     * Show the home page for regular users.
     */
    public function index(Request $request)
    {
        // Redirect admins to admin dashboard
        if (Auth::user() && Auth::user()->isAdmin()) {
            return redirect()->route('admin.dashboard');
        }

        return Inertia::render('Home');
    }
}
