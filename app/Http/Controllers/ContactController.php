<?php

namespace App\Http\Controllers;

use App\Models\Contact;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Facades\Log;

class ContactController extends Controller
{
    /**
     * Display the public contact page.
     */
    public function index(): Response
    {
        $contact = Contact::active()
            ->with('user')
            ->firstOrFail();

        return Inertia::render('Contact/Index', [
            'contact' => $contact,
        ]);
    }

    /**
     * Show the form for editing the contact information.
     */
    public function edit(): Response
    {
        // Get or create contact info for the authenticated user
        $contact = Contact::firstOrCreate(
            ['user_id' => Auth::id()],
            [
                'title' => 'Contact Me',
                'email' => Auth::user()->email,
                'is_active' => true,
                'available_for_work' => true,
            ]
        );

        return Inertia::render('Admin/Contact/Edit', [
            'contact' => $contact,
        ]);
    }

    /**
     * Update the contact information.
     */
    public function update(Request $request): RedirectResponse
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'subtitle' => 'nullable|string|max:255',
            'description' => 'nullable|string|max:2000',
            'email' => 'required|email|max:255',
            'phone' => 'nullable|string|max:50',
            'location' => 'nullable|string|max:255',
            'website' => 'nullable|url|max:255',
            'linkedin_url' => 'nullable|url|max:255',
            'github_url' => 'nullable|url|max:255',
            'twitter_url' => 'nullable|url|max:255',
            'instagram_url' => 'nullable|url|max:255',
            'facebook_url' => 'nullable|url|max:255',
            'whatsapp_number' => 'nullable|string|max:50',
            'telegram_username' => 'nullable|string|max:100',
            'available_for_work' => 'boolean',
            'response_time' => 'nullable|string|max:100',
            'working_hours' => 'nullable|string|max:255',
            'is_active' => 'boolean',
            'meta_title' => 'nullable|string|max:255',
            'meta_description' => 'nullable|string|max:500',
        ]);

        $contact = Contact::firstOrCreate(
            ['user_id' => Auth::id()]
        );

        $contact->update($request->all());

        Log::info('Contact information updated', [
            'user_id' => Auth::id(),
            'contact_id' => $contact->id,
        ]);

        return redirect()
            ->route('admin.contact.edit')
            ->with('success', 'Contact information updated successfully!');
    }
}
