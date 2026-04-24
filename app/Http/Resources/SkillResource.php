<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class SkillResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id'                => $this->id,
            'name'              => $this->name,
            'category'          => $this->category,
            'proficiency_level' => (int) $this->proficiency_level,
            'icon'              => $this->icon,
            'image'             => $this->image_path ? asset('storage/' . $this->image_path) : null,
            'image_path'        => $this->image_path,
            'is_featured'       => (bool) $this->is_featured,
            'sort_order'        => (int) $this->sort_order,
            'created_at'        => $this->created_at?->toISOString(),
            'updated_at'        => $this->updated_at?->toISOString(),
        ];
    }
}
