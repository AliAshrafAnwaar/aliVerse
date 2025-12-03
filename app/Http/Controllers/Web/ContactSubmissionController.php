<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreContactSubmissionRequest;
use App\Models\ContactSubmission;
use App\Mail\ContactSubmissionMail;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Inertia\Response;

class ContactSubmissionController extends Controller
{
    /**
     * Display a listing of contact submissions.
     */
    public function index(Request $request): Response
    {
        $this->authorize('viewAny', ContactSubmission::class);

        $submissions = ContactSubmission::query()
            ->when($request->search, fn($q, $search) => $q->search($search))
            ->when($request->filter === 'unread', fn($q) => $q->unread())
            ->when($request->filter === 'read', fn($q) => $q->read())
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
     * Store a newly created contact submission.
     */
    public function store(StoreContactSubmissionRequest $request): RedirectResponse
    {
        try {
            $submission = ContactSubmission::create([
                'name' => $request->name,
                'email' => $request->email,
                'subject' => $request->subject,
                'message' => $request->message,
                'ip_address' => $request->ip(),
                'user_agent' => $request->userAgent(),
            ]);

            try {
                Mail::to(config('mail.contact_email', config('mail.from.address')))
                    ->queue(new ContactSubmissionMail($submission));
            } catch (\Exception $e) {
                Log::error('Failed to send contact submission email: ' . $e->getMessage());
            }

            session()->flash('success', 'Thank you for your message! We\'ll get back to you soon.');
            return redirect()->back();

        } catch (\Exception $e) {
            Log::error('Failed to store contact submission: ' . $e->getMessage());
            session()->flash('error', 'Sorry, there was an error sending your message. Please try again.');
            return redirect()->back()->withInput();
        }
    }

    /**
     * Display the specified contact submission.
     */
    public function show(ContactSubmission $submission): Response
    {
        $this->authorize('view', $submission);

        if (!$submission->is_read) {
            $submission->markAsRead();
        }

        return Inertia::render('Admin/ContactSubmissions/Show', [
            'submission' => $submission,
        ]);
    }

    /**
     * Remove the specified contact submission.
     */
    public function destroy(ContactSubmission $submission): RedirectResponse
    {
        $this->authorize('delete', $submission);

        $submission->delete();

        return redirect()->route('admin.contact-submissions.index')
            ->with('success', 'Contact submission deleted successfully.');
    }

    /**
     * Mark a submission as read.
     */
    public function markAsRead(ContactSubmission $submission): RedirectResponse
    {
        $this->authorize('markAsRead', $submission);

        $submission->markAsRead();

        return redirect()->back()->with('success', 'Submission marked as read.');
    }

    /**
     * Mark a submission as unread.
     */
    public function markAsUnread(ContactSubmission $submission): RedirectResponse
    {
        $this->authorize('markAsRead', $submission);

        $submission->markAsUnread();

        return redirect()->back()->with('success', 'Submission marked as unread.');
    }

    /**
     * Bulk delete submissions.
     */
    public function bulkDestroy(Request $request): RedirectResponse
    {
        $this->authorize('bulkDelete', ContactSubmission::class);

        $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'exists:contact_submissions,id',
        ]);

        ContactSubmission::whereIn('id', $request->ids)->delete();

        return redirect()->back()->with('success', 'Selected submissions deleted successfully.');
    }

    /**
     * Bulk mark submissions as read.
     */
    public function bulkMarkAsRead(Request $request): RedirectResponse
    {
        $this->authorize('bulkDelete', ContactSubmission::class);

        $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'exists:contact_submissions,id',
        ]);

        ContactSubmission::whereIn('id', $request->ids)->update(['is_read' => true]);

        return redirect()->back()->with('success', 'Selected submissions marked as read.');
    }

    /**
     * Bulk mark submissions as unread.
     */
    public function bulkMarkAsUnread(Request $request): RedirectResponse
    {
        $this->authorize('bulkDelete', ContactSubmission::class);

        $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'exists:contact_submissions,id',
        ]);

        ContactSubmission::whereIn('id', $request->ids)->update(['is_read' => false]);

        return redirect()->back()->with('success', 'Selected submissions marked as unread.');
    }
}
