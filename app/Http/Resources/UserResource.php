<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'email' => $this->when($this->shouldShowEmail($request), $this->email),
            'avatar' => $this->avatar ? asset('storage/' . $this->avatar) : null,
            'bio' => $this->bio,
            'role' => $this->when($request->user()?->isAdmin(), $this->role),
            'email_verified_at' => $this->when($request->user()?->isAdmin(), $this->email_verified_at?->toISOString()),
            'created_at' => $this->created_at->toISOString(),
            'updated_at' => $this->updated_at->toISOString(),
            
            // Counts
            'posts_count' => $this->whenCounted('posts'),
            'projects_count' => $this->whenCounted('projects'),
        ];
    }

    /**
     * Determine if email should be shown.
     */
    private function shouldShowEmail(Request $request): bool
    {
        $currentUser = $request->user();
        
        // Show email if viewing own profile or if admin
        return $currentUser && ($currentUser->id === $this->id || $currentUser->isAdmin());
    }
}
