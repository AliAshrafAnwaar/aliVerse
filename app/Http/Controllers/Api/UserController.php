<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\UpdateUserRequest;
use App\Http\Resources\UserResource;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    /**
     * Display a listing of users.
     */
    public function index(Request $request)
    {
        $this->authorize('viewAny', User::class);

        $users = User::query()
            ->search($request->search)
            ->when($request->role, fn($q, $role) => $q->where('role', $role))
            ->when($request->status === 'active', fn($q) => $q->whereNotNull('email_verified_at'))
            ->when($request->status === 'banned', fn($q) => $q->whereNull('email_verified_at'))
            ->latest()
            ->paginate($request->per_page ?? 12)
            ->withQueryString();

        return UserResource::collection($users);
    }

    /**
     * Display the specified user.
     */
    public function show(User $user): UserResource
    {
        $this->authorize('view', $user);

        $user->loadCount(['posts', 'projects']);

        return new UserResource($user);
    }

    /**
     * Update the specified user.
     */
    public function update(UpdateUserRequest $request, User $user): JsonResponse
    {
        $this->authorize('update', $user);

        $data = $request->validated();

        if (isset($data['password'])) {
            $data['password'] = Hash::make($data['password']);
        }

        $user->update($data);

        return response()->json([
            'message' => 'User updated successfully!',
            'data' => new UserResource($user),
        ]);
    }

    /**
     * Remove the specified user.
     */
    public function destroy(User $user): JsonResponse
    {
        $this->authorize('delete', $user);

        $user->delete();

        return response()->json(['message' => 'User deleted successfully!']);
    }

    /**
     * Toggle user admin status.
     */
    public function toggleAdmin(User $user): JsonResponse
    {
        $this->authorize('toggleAdmin', $user);

        $newRole = $user->role === 'admin' ? 'user' : 'admin';
        $user->update(['role' => $newRole]);

        return response()->json([
            'message' => 'User role updated successfully!',
            'role' => $newRole,
        ]);
    }

    /**
     * Toggle user ban status.
     */
    public function toggleBan(User $user): JsonResponse
    {
        $this->authorize('toggleBan', $user);

        if ($user->email_verified_at) {
            $user->update(['email_verified_at' => null]);
            $message = 'User banned successfully!';
            $isBanned = true;
        } else {
            $user->update(['email_verified_at' => now()]);
            $message = 'User unbanned successfully!';
            $isBanned = false;
        }

        return response()->json([
            'message' => $message,
            'is_banned' => $isBanned,
        ]);
    }
}
