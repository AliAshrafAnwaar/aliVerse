<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProjectResource extends JsonResource
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
            'title' => $this->title,
            'slug' => $this->slug,
            'description' => $this->description,
            'short_description' => $this->short_description,
            'image' => $this->image ? asset('storage/' . $this->image) : null,
            'status' => $this->status,
            'featured' => $this->featured,
            'project_url' => $this->project_url,
            'github_url' => $this->github_url,
            'technologies' => $this->technologies,
            'start_date' => $this->start_date?->toDateString(),
            'end_date' => $this->end_date?->toDateString(),
            'sort_order' => $this->sort_order,
            'created_at' => $this->created_at->toISOString(),
            'updated_at' => $this->updated_at->toISOString(),
            
            // Relationships
            'images' => ProjectImageResource::collection($this->whenLoaded('images')),
            'user' => new UserResource($this->whenLoaded('user')),
            
            // Computed fields
            'views_count' => $this->when(isset($this->views_count), $this->views_count),
            'total_reactions_count' => $this->when(isset($this->total_reactions_count), $this->total_reactions_count),
        ];
    }
}
