<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreEducationRequest;
use App\Http\Requests\UpdateEducationRequest;
use App\Http\Resources\EducationResource;
use App\Models\Education;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class EducationController extends Controller
{
    /**
     * Display a listing of education entries.
     */
    public function index(Request $request)
    {
        $educations = Education::query()
            ->when($request->search, fn($q, $search) => 
                $q->where('institution', 'like', "%{$search}%")
                  ->orWhere('degree', 'like', "%{$search}%")
                  ->orWhere('field_of_study', 'like', "%{$search}%")
            )
            ->orderBy('start_date', 'desc')
            ->paginate($request->per_page ?? 15)
            ->withQueryString();

        return EducationResource::collection($educations);
    }

    /**
     * Store a newly created education entry.
     */
    public function store(StoreEducationRequest $request): JsonResponse
    {
        $education = Education::create($request->validated());

        return response()->json([
            'message' => 'Education created successfully.',
            'data' => new EducationResource($education),
        ], 201);
    }

    /**
     * Display the specified education entry.
     */
    public function show(Education $education): EducationResource
    {
        return new EducationResource($education);
    }

    /**
     * Update the specified education entry.
     */
    public function update(UpdateEducationRequest $request, Education $education): JsonResponse
    {
        $education->update($request->validated());

        return response()->json([
            'message' => 'Education updated successfully.',
            'data' => new EducationResource($education),
        ]);
    }

    /**
     * Remove the specified education entry.
     */
    public function destroy(Education $education): JsonResponse
    {
        $education->delete();

        return response()->json(['message' => 'Education deleted successfully.']);
    }
}
