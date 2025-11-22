<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreContactSubmissionRequest;
use App\Models\ContactSubmission;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use App\Mail\ContactSubmissionMail;

class ContactSubmissionController extends Controller
{
    /**
     * Store a new contact submission.
     */
    public function store(StoreContactSubmissionRequest $request)
    {
        try {
            // Create the contact submission
            $submission = ContactSubmission::create([
                'name' => $request->name,
                'email' => $request->email,
                'subject' => $request->subject,
                'message' => $request->message,
                'ip_address' => $request->ip(),
                'user_agent' => $request->userAgent(),
            ]);

            // Send email notification (queued to avoid blocking)
            try {
                Mail::to(config('mail.contact_email', config('mail.from.address')))
                    ->queue(new ContactSubmissionMail($submission));
            } catch (\Exception $e) {
                Log::error('Failed to send contact submission email: ' . $e->getMessage());
                // Continue even if email fails - don't block user experience
            }

            // Flash success message
            session()->flash('success', 'Thank you for your message! We\'ll get back to you soon.');

            return redirect()->back();

        } catch (\Exception $e) {
            Log::error('Failed to store contact submission: ' . $e->getMessage());
            
            session()->flash('error', 'Sorry, there was an error sending your message. Please try again.');
            
            return redirect()->back()
                ->withInput();
        }
    }

    /**
     * Display a listing of contact submissions for admin.
     */
    public function index(Request $request)
    {
        $submissions = ContactSubmission::query()
            ->when($request->search, function ($query, $search) {
                $query->search($search);
            })
            ->when($request->filter === 'unread', function ($query) {
                $query->unread();
            })
            ->when($request->filter === 'read', function ($query) {
                $query->read();
            })
            ->latest()
            ->paginate(20)
            ->withQueryString();

        $stats = [
            'total' => ContactSubmission::count(),
            'unread' => ContactSubmission::unread()->count(),
            'read' => ContactSubmission::read()->count(),
        ];

        return Inertia::render('Admin/ContactSubmissions/Index', [
            'submissions' => $submissions,
            'stats' => $stats,
            'filters' => $request->only(['search', 'filter']),
        ]);
    }

    /**
     * Display the specified contact submission.
     */
    public function show(ContactSubmission $submission)
    {
        // Mark as read when viewed
        if (!$submission->is_read) {
            $submission->markAsRead();
        }

        return Inertia::render('Admin/ContactSubmissions/Show', [
            'submission' => $submission,
        ]);
    }

    /**
     * Mark a submission as read.
     */
    public function markAsRead(ContactSubmission $submission)
    {
        $submission->markAsRead();

        return redirect()->back()
            ->with('success', 'Submission marked as read.');
    }

    /**
     * Mark a submission as unread.
     */
    public function markAsUnread(ContactSubmission $submission)
    {
        $submission->markAsUnread();

        return redirect()->back()
            ->with('success', 'Submission marked as unread.');
    }

    /**
     * Remove the specified contact submission.
     */
    public function destroy(ContactSubmission $submission)
    {
        $submission->delete();

        return redirect()->route('admin.contact-submissions.index')
            ->with('success', 'Contact submission deleted successfully.');
    }

    /**
     * Bulk delete submissions.
     */
    public function bulkDestroy(Request $request)
    {
        $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'exists:contact_submissions,id',
        ]);

        ContactSubmission::whereIn('id', $request->ids)->delete();

        return redirect()->back()
            ->with('success', 'Selected submissions deleted successfully.');
    }

    /**
     * Bulk mark submissions as read.
     */
    public function bulkMarkAsRead(Request $request)
    {
        $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'exists:contact_submissions,id',
        ]);

        ContactSubmission::whereIn('id', $request->ids)->update(['is_read' => true]);

        return redirect()->back()
            ->with('success', 'Selected submissions marked as read.');
    }

    /**
     * Bulk mark submissions as unread.
     */
    public function bulkMarkAsUnread(Request $request)
    {
        $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'exists:contact_submissions,id',
        ]);

        ContactSubmission::whereIn('id', $request->ids)->update(['is_read' => false]);

        return redirect()->back()
            ->with('success', 'Selected submissions marked as unread.');
    }
}
