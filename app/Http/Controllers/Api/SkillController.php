<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreSkillRequest;
use App\Http\Requests\UpdateSkillRequest;
use App\Http\Resources\SkillResource;
use App\Models\Skill;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Storage;

class SkillController extends Controller
{
    /**
     * Display a listing of skills.
     */
    public function index(Request $request)
    {
        $skills = Skill::query()
            ->when($request->search, fn($q, $search) => 
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('category', 'like', "%{$search}%")
            )
            ->when($request->category, fn($q, $cat) => $q->where('category', $cat))
            ->when($request->featured, fn($q) => $q->where('is_featured', true))
            ->ordered()
            ->paginate($request->per_page ?? 15)
            ->withQueryString();

        return SkillResource::collection($skills);
    }

    /**
     * Store a newly created skill.
     */
    public function store(StoreSkillRequest $request): JsonResponse
    {
        $data = $request->validated();

        if ($request->hasFile('image')) {
            $data['image_path'] = $request->file('image')->store('skills', 'public');
        }

        $skill = Skill::create($data);

        return response()->json([
            'message' => 'Skill created successfully.',
            'data' => new SkillResource($skill),
        ], 201);
    }

    /**
     * Display the specified skill.
     */
    public function show(Skill $skill): SkillResource
    {
        return new SkillResource($skill);
    }

    /**
     * Update the specified skill.
     */
    public function update(UpdateSkillRequest $request, Skill $skill): JsonResponse
    {
        $data = $request->validated();

        if ($request->hasFile('image')) {
            if ($skill->image_path && Storage::disk('public')->exists($skill->image_path)) {
                Storage::disk('public')->delete($skill->image_path);
            }
            $data['image_path'] = $request->file('image')->store('skills', 'public');
        }

        $skill->update($data);

        return response()->json([
            'message' => 'Skill updated successfully.',
            'data' => new SkillResource($skill),
        ]);
    }

    /**
     * Remove the specified skill.
     */
    public function destroy(Skill $skill): JsonResponse
    {
        if ($skill->image_path && Storage::disk('public')->exists($skill->image_path)) {
            Storage::disk('public')->delete($skill->image_path);
        }
        
        $skill->delete();

        return response()->json(['message' => 'Skill deleted successfully.']);
    }
}
