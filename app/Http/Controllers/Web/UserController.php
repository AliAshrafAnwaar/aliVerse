<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Http\Requests\UpdateUserRequest;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use Inertia\Response;

class UserController extends Controller
{
    /**
     * Display a listing of users.
     */
    public function index(Request $request): Response
    {
        $this->authorize('viewAny', User::class);

        $users = User::query()
            ->search($request->search)
            ->when($request->role, fn($q, $role) => $q->where('role', $role))
            ->when($request->status === 'active', fn($q) => $q->whereNotNull('email_verified_at'))
            ->when($request->status === 'banned', fn($q) => $q->whereNull('email_verified_at'))
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
    public function show(User $user): Response
    {
        $this->authorize('view', $user);

        $user->loadCount(['posts', 'projects']);

        return Inertia::render('Admin/Users/Show', [
            'user' => $user,
        ]);
    }

    /**
     * Show the form for editing the specified user.
     */
    public function edit(User $user): Response
    {
        $this->authorize('update', $user);

        return Inertia::render('Admin/Users/Edit', [
            'user' => $user,
        ]);
    }

    /**
     * Update the specified user.
     */
    public function update(UpdateUserRequest $request, User $user): RedirectResponse
    {
        $this->authorize('update', $user);

        $data = $request->validated();

        if (isset($data['password'])) {
            $data['password'] = Hash::make($data['password']);
        }

        $user->update($data);

        return redirect()
            ->route('admin.users.show', $user)
            ->with('success', 'User updated successfully!');
    }

    /**
     * Remove the specified user.
     */
    public function destroy(User $user): RedirectResponse
    {
        $this->authorize('delete', $user);

        $user->delete();

        return redirect()
            ->route('admin.users.index')
            ->with('success', 'User deleted successfully!');
    }

    /**
     * Toggle user admin status.
     */
    public function toggleAdmin(User $user): RedirectResponse
    {
        $this->authorize('toggleAdmin', $user);

        $newRole = $user->role === 'admin' ? 'user' : 'admin';
        $user->update(['role' => $newRole]);

        return back()->with('success', 'User role updated successfully!');
    }

    /**
     * Toggle user ban status.
     */
    public function toggleBan(User $user): RedirectResponse
    {
        $this->authorize('toggleBan', $user);

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
