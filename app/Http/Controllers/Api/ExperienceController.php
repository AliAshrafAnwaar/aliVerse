<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreExperienceRequest;
use App\Http\Requests\UpdateExperienceRequest;
use App\Http\Resources\ExperienceResource;
use App\Models\Experience;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class ExperienceController extends Controller
{
    /**
     * Display a listing of experiences.
     */
    public function index(Request $request)
    {
        $experiences = Experience::query()
            ->when($request->search, fn($q, $search) => 
                $q->where('company', 'like', "%{$search}%")
                  ->orWhere('position', 'like', "%{$search}%")
            )
            ->when($request->is_current !== null, fn($q) => 
                $q->where('is_current', $request->is_current === 'true')
            )
            ->ordered()
            ->paginate($request->per_page ?? 15)
            ->withQueryString();

        return ExperienceResource::collection($experiences);
    }

    /**
     * Store a newly created experience.
     */
    public function store(StoreExperienceRequest $request): JsonResponse
    {
        $data = $request->validated();

        if ($data['is_current']) {
            $data['end_date'] = null;
        }

        $experience = Experience::create($data);

        return response()->json([
            'message' => 'Experience created successfully.',
            'data' => new ExperienceResource($experience),
        ], 201);
    }

    /**
     * Display the specified experience.
     */
    public function show(Experience $experience): ExperienceResource
    {
        return new ExperienceResource($experience);
    }

    /**
     * Update the specified experience.
     */
    public function update(UpdateExperienceRequest $request, Experience $experience): JsonResponse
    {
        $data = $request->validated();

        if ($data['is_current']) {
            $data['end_date'] = null;
        }

        $experience->update($data);

        return response()->json([
            'message' => 'Experience updated successfully.',
            'data' => new ExperienceResource($experience),
        ]);
    }

    /**
     * Remove the specified experience.
     */
    public function destroy(Experience $experience): JsonResponse
    {
        $experience->delete();

        return response()->json(['message' => 'Experience deleted successfully.']);
    }
}
