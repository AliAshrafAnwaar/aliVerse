<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreContactSubmissionRequest;
use App\Http\Resources\ContactSubmissionResource;
use App\Models\ContactSubmission;
use App\Mail\ContactSubmissionMail;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;

class ContactSubmissionController extends Controller
{
    /**
     * Display a listing of contact submissions.
     */
    public function index(Request $request)
    {
        $this->authorize('viewAny', ContactSubmission::class);

        $submissions = ContactSubmission::query()
            ->when($request->search, fn($q, $search) => $q->search($search))
            ->when($request->filter === 'unread', fn($q) => $q->unread())
            ->when($request->filter === 'read', fn($q) => $q->read())
            ->latest()
            ->paginate($request->per_page ?? 20)
            ->withQueryString();

        $stats = [
            'total' => ContactSubmission::count(),
            'unread' => ContactSubmission::unread()->count(),
            'read' => ContactSubmission::read()->count(),
        ];

        return response()->json([
            'data' => ContactSubmissionResource::collection($submissions),
            'stats' => $stats,
            'meta' => [
                'current_page' => $submissions->currentPage(),
                'last_page' => $submissions->lastPage(),
                'per_page' => $submissions->perPage(),
                'total' => $submissions->total(),
            ],
        ]);
    }

    /**
     * Store a newly created contact submission.
     */
    public function store(StoreContactSubmissionRequest $request): JsonResponse
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

            return response()->json([
                'message' => 'Thank you for your message! We\'ll get back to you soon.',
                'data' => new ContactSubmissionResource($submission),
            ], 201);

        } catch (\Exception $e) {
            Log::error('Failed to store contact submission: ' . $e->getMessage());
            
            return response()->json([
                'message' => 'Sorry, there was an error sending your message. Please try again.',
            ], 500);
        }
    }

    /**
     * Display the specified contact submission.
     */
    public function show(ContactSubmission $submission): ContactSubmissionResource
    {
        $this->authorize('view', $submission);

        if (!$submission->is_read) {
            $submission->markAsRead();
        }

        return new ContactSubmissionResource($submission);
    }

    /**
     * Remove the specified contact submission.
     */
    public function destroy(ContactSubmission $submission): JsonResponse
    {
        $this->authorize('delete', $submission);

        $submission->delete();

        return response()->json(['message' => 'Contact submission deleted successfully!']);
    }

    /**
     * Mark a submission as read.
     */
    public function markAsRead(ContactSubmission $submission): JsonResponse
    {
        $this->authorize('markAsRead', $submission);

        $submission->markAsRead();

        return response()->json([
            'message' => 'Submission marked as read.',
            'data' => new ContactSubmissionResource($submission),
        ]);
    }

    /**
     * Mark a submission as unread.
     */
    public function markAsUnread(ContactSubmission $submission): JsonResponse
    {
        $this->authorize('markAsRead', $submission);

        $submission->markAsUnread();

        return response()->json([
            'message' => 'Submission marked as unread.',
            'data' => new ContactSubmissionResource($submission),
        ]);
    }

    /**
     * Bulk delete submissions.
     */
    public function bulkDestroy(Request $request): JsonResponse
    {
        $this->authorize('bulkDelete', ContactSubmission::class);

        $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'exists:contact_submissions,id',
        ]);

        ContactSubmission::whereIn('id', $request->ids)->delete();

        return response()->json(['message' => 'Selected submissions deleted successfully!']);
    }

    /**
     * Bulk mark submissions as read.
     */
    public function bulkMarkAsRead(Request $request): JsonResponse
    {
        $this->authorize('bulkDelete', ContactSubmission::class);

        $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'exists:contact_submissions,id',
        ]);

        ContactSubmission::whereIn('id', $request->ids)->update(['is_read' => true]);

        return response()->json(['message' => 'Selected submissions marked as read.']);
    }

    /**
     * Bulk mark submissions as unread.
     */
    public function bulkMarkAsUnread(Request $request): JsonResponse
    {
        $this->authorize('bulkDelete', ContactSubmission::class);

        $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'exists:contact_submissions,id',
        ]);

        ContactSubmission::whereIn('id', $request->ids)->update(['is_read' => false]);

        return response()->json(['message' => 'Selected submissions marked as unread.']);
    }
}
