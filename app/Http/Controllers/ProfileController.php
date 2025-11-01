<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProfileUpdateRequest;
use App\Http\Requests\UpdateProfileRequest;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class ProfileController extends Controller
{
    /**
     * Display the user's profile form.
     */
    public function edit(Request $request): Response
    {
        Log::info("User #{$request->user()->id} viewed profile edit page");

        return Inertia::render('Profile/Edit', [
            'auth' => [
                'user' => $request->user(),
            ],
            'mustVerifyEmail' => $request->user() instanceof MustVerifyEmail,
            'status' => session('status'),
        ]);
    }

    /**
     * Update the user's profile information.
     */
    public function update(UpdateProfileRequest $request): RedirectResponse
    {
        Log::info("User #{$request->user()->id} updating profile with data: " . json_encode($request->validated()));
        $user = $request->user();
        $data = $request->validated();

        Log::info("User #{$user->id} updating profile with data: " . json_encode($data));

        // Handle avatar upload
        if ($request->hasFile('avatar')) {
            // Delete old avatar if exists
            if ($user->avatar) {
                Storage::disk('public')->delete($user->avatar);
            }

            $avatarPath = $request->file('avatar')->store('avatars', 'public');
            $data['avatar'] = $avatarPath;
        }

        // Handle email change
        if (isset($data['email']) && $data['email'] !== $user->email) {
            $data['email_verified_at'] = null;
        }

        $user->update($data);

        Log::info("User #{$user->id} updated their profile");

        return Redirect::route('profile.edit')
            ->with('success', 'Profile updated successfully!');
    }

    /**
     * Update the user's basic information (name, email).
     */
    public function updateBasic(ProfileUpdateRequest $request): RedirectResponse
    {
        $user = $request->user();
        $data = $request->validated();

        Log::info("User #{$user->id} updating basic information with data: " . json_encode($data));

        $user->fill($data);

        if ($request->user()->isDirty('email')) {
            $user->email_verified_at = null;
        }

        $user->save();

        Log::info("User #{$user->id} updated their basic information");

        return Redirect::route('profile.edit')
            ->with('success', 'Basic information updated successfully!');
    }

    /**
     * Upload or update the user's avatar only.
     */
    public function updateAvatar(Request $request): RedirectResponse
    {
        $user = $request->user();

        $validated = $request->validate([
            'avatar' => ['required','image','max:4096'],
        ]);

        Log::info("User #{$user->id} uploading avatar");

        if ($request->hasFile('avatar')) {
            if ($user->avatar) {
                Storage::disk('public')->delete($user->avatar);
            }

            $avatarPath = $request->file('avatar')->store('avatars', 'public');
            $user->update(['avatar' => $avatarPath]);

            Log::info("User #{$user->id} avatar uploaded successfully", ['path' => $avatarPath]);
        }

        return Redirect::route('profile.edit')
            ->with('success', 'Avatar uploaded successfully!');
    }

    /**
     * Remove the user's avatar.
     */
    public function removeAvatar(Request $request): RedirectResponse
    {
        $user = $request->user();

        Log::info("User #{$user->id} removing their avatar");

        if ($user->avatar) {
            Storage::disk('public')->delete($user->avatar);
            $user->update(['avatar' => null]);
        }

        Log::info("User #{$user->id} removed their avatar");

        return Redirect::route('profile.edit')
            ->with('success', 'Avatar removed successfully!');
    }

    /**
     * Delete the user's account.
     */
    public function destroy(Request $request): RedirectResponse
    {
        $request->validate([
            'password' => ['required', 'current_password'],
        ]);

        $user = $request->user();

        Log::info("User #{$user->id} deleting their account");

        Auth::logout();

        $user->delete();

        Log::info("User #{$user->id} deleted their account");

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return Redirect::to('/');
    }
}
