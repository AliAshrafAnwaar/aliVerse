<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class DashboardController extends Controller
{
    /**
     * Show the admin dashboard.
     */
    public function index(Request $request)
    {
        // Only allow access to dashboard if user is admin
        if (!Auth::user() || !Auth::user()->isAdmin()) {
            return redirect()->route('home');
        }

        return Inertia::render('Dashboard');
    }
}
