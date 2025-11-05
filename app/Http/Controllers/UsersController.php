<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class UsersController extends Controller
{
    /**
     * Display a listing of users.
     */
    public function index(Request $request): \Inertia\Response
    {
        $users = User::query()
            ->when($request->search, function ($query, $search) {
                $query->where('name', 'like', "%{$search}%")
                      ->orWhere('email', 'like', "%{$search}%");
            })
            ->when($request->role, function ($query, $role) {
                $query->where('is_admin', $role === 'admin');
            })
            ->when($request->status, function ($query, $status) {
                if ($status === 'active') {
                    $query->where('email_verified_at', '!=', null);
                } elseif ($status === 'inactive') {
                    $query->where('email_verified_at', null);
                }
            })
            ->latest()
            ->paginate(12)
            ->withQueryString();

        return Inertia::render('Admin/Users/Index', [
            'users' => $users,
            'filters' => $request->only('search', 'role', 'status'),
        ]);
    }

    /**
     * Display the specified user.
     */
    public function show(User $user): \Inertia\Response
    {
        $user->loadCount(['posts', 'projects']);

        return Inertia::render('Admin/Users/Show', [
            'user' => $user,
        ]);
    }

    /**
     * Show the form for editing the specified user.
     */
    public function edit(User $user): \Inertia\Response
    {
        return Inertia::render('Admin/Users/Edit', [
            'user' => $user,
        ]);
    }

    /**
     * Update the specified user in storage.
     */
    public function update(Request $request, User $user)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'email' => [
                'required',
                'string',
                'email',
                'max:255',
                Rule::unique('users')->ignore($user->id),
            ],
            'password' => 'nullable|string|min:8|confirmed',
            'is_admin' => 'required|boolean',
        ]);

        // Only update password if provided
        if (empty($data['password'])) {
            unset($data['password']);
        } else {
            $data['password'] = Hash::make($data['password']);
        }

        $user->update($data);

        return redirect()
            ->route('admin.users.show', $user)
            ->with('success', 'User updated successfully!');
    }

    /**
     * Remove the specified user from storage.
     */
    public function destroy(User $user)
    {
        // Prevent deletion of the authenticated user
        if ($user->id === auth()->id()) {
            return back()->with('error', 'You cannot delete your own account.');
        }

        $user->delete();

        return redirect()
            ->route('admin.users.index')
            ->with('success', 'User deleted successfully!');
    }

    /**
     * Toggle user admin status.
     */
    public function toggleAdmin(User $user)
    {
        // Prevent admin from removing their own admin status
        if ($user->id === auth()->id()) {
            return back()->with('error', 'You cannot change your own admin status.');
        }

        $user->update(['is_admin' => !$user->is_admin]);

        return back()->with('success', 'User admin status updated!');
    }

    /**
     * Ban/Unban user (by setting email_verified_at to null).
     */
    public function toggleBan(User $user)
    {
        // Prevent admin from banning themselves
        if ($user->id === auth()->id()) {
            return back()->with('error', 'You cannot ban your own account.');
        }

        if ($user->email_verified_at) {
            $user->update(['email_verified_at' => null]);
            $message = 'User banned successfully!';
        } else {
            $user->update(['email_verified_at' => now()]);
            $message = 'User unbanned successfully!';
        }

        return back()->with('success', $message);
    }
}
