<?php

namespace App\Http\Controllers;

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

        return Inertia::render('Portfolio');
    }
}
