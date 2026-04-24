<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreSkillRequest;
use App\Http\Requests\UpdateSkillRequest;
use App\Http\Resources\SkillCollection;
use App\Http\Resources\SkillResource;
use App\Models\Skill;
use App\Services\SkillService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class SkillController extends Controller
{
    public function __construct(private readonly SkillService $skills) {}

    public function index(Request $request): SkillCollection
    {
        $this->authorize('viewAny', Skill::class);

        $skills = Skill::query()
            ->when($request->string('search')->toString(), fn ($q, $s) => $q
                ->where('name', 'like', "%{$s}%")
                ->orWhere('category', 'like', "%{$s}%"))
            ->when($request->string('category')->toString(), fn ($q, $c) => $q->where('category', $c))
            ->when($request->boolean('featured'), fn ($q) => $q->where('is_featured', true))
            ->ordered()
            ->paginate($request->integer('per_page', 15))
            ->withQueryString();

        return new SkillCollection($skills);
    }

    public function store(StoreSkillRequest $request): JsonResponse
    {
        $skill = $this->skills->create($request->validated(), $request->file('image'));

        return (new SkillResource($skill))
            ->response()
            ->setStatusCode(Response::HTTP_CREATED);
    }

    public function show(Skill $skill): SkillResource
    {
        $this->authorize('view', $skill);

        return new SkillResource($skill);
    }

    public function update(UpdateSkillRequest $request, Skill $skill): SkillResource
    {
        $skill = $this->skills->update($skill, $request->validated(), $request->file('image'));

        return new SkillResource($skill);
    }

    public function destroy(Skill $skill): Response
    {
        $this->authorize('delete', $skill);

        $this->skills->delete($skill);

        return response()->noContent();
    }
}
