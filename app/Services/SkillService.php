<?php

namespace App\Services;

use App\Models\Skill;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class SkillService
{
    /**
     * Create a new skill, optionally storing an uploaded image.
     */
    public function create(array $data, ?UploadedFile $image = null): Skill
    {
        return DB::transaction(function () use ($data, $image) {
            if ($image) {
                $data['image_path'] = $image->store('skills', 'public');
            }

            return Skill::create($data);
        });
    }

    /**
     * Update a skill, swapping the stored image if a new one is provided.
     */
    public function update(Skill $skill, array $data, ?UploadedFile $image = null): Skill
    {
        return DB::transaction(function () use ($skill, $data, $image) {
            if ($image) {
                $this->deleteStoredImage($skill);
                $data['image_path'] = $image->store('skills', 'public');
            }

            $skill->update($data);

            return $skill->fresh();
        });
    }

    /**
     * Delete a skill along with its stored image file.
     */
    public function delete(Skill $skill): void
    {
        DB::transaction(function () use ($skill) {
            $this->deleteStoredImage($skill);
            $skill->delete();
        });
    }

    private function deleteStoredImage(Skill $skill): void
    {
        if ($skill->image_path && Storage::disk('public')->exists($skill->image_path)) {
            Storage::disk('public')->delete($skill->image_path);
        }
    }
}
