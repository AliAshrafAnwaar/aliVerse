<?php

namespace App\Policies;

use App\Models\ContactSubmission;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class ContactSubmissionPolicy
{
    use HandlesAuthorization;

    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return $user->isAdmin();
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, ContactSubmission $submission): bool
    {
        return $user->isAdmin();
    }

    /**
     * Determine whether the user can create models.
     * Anyone can submit a contact form.
     */
    public function create(?User $user): bool
    {
        return true;
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, ContactSubmission $submission): bool
    {
        return $user->isAdmin();
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, ContactSubmission $submission): bool
    {
        return $user->isAdmin();
    }

    /**
     * Determine whether the user can mark as read/unread.
     */
    public function markAsRead(User $user, ContactSubmission $submission): bool
    {
        return $user->isAdmin();
    }

    /**
     * Determine whether the user can perform bulk operations.
     */
    public function bulkDelete(User $user): bool
    {
        return $user->isAdmin();
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, ContactSubmission $submission): bool
    {
        return $user->isAdmin();
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, ContactSubmission $submission): bool
    {
        return $user->isAdmin();
    }
}
