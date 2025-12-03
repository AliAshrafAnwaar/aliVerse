<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreProjectRequest;
use App\Http\Requests\UpdateProjectRequest;
use App\Http\Resources\ProjectCollection;
use App\Http\Resources\ProjectResource;
use App\Models\Project;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Storage;

class ProjectController extends Controller
{
    /**
     * Display a listing of published projects.
     */
    public function index(Request $request): ProjectCollection
    {
        $projects = Project::query()
            ->published()
            ->with('images')
            ->search($request->search)
            ->when($request->featured, fn($q) => $q->featured())
            ->ordered()
            ->paginate($request->per_page ?? 12)
            ->withQueryString();

        return new ProjectCollection($projects);
    }

    /**
     * Display the specified project.
     */
    public function show(string $slug): ProjectResource|JsonResponse
    {
        $project = Project::where('slug', $slug)
            ->with(['images', 'reactions.user'])
            ->published()
            ->first();

        if (!$project) {
            return response()->json(['message' => 'Project not found'], 404);
        }

        $project->recordView();
        $project->views_count = $project->getViewsCount();
        $project->total_reactions_count = $project->getTotalReactionsCount();

        return new ProjectResource($project);
    }

    /**
     * Store a newly created project.
     */
    public function store(StoreProjectRequest $request): JsonResponse
    {
        $this->authorize('create', Project::class);

        $data = $request->validated();

        if ($request->hasFile('image')) {
            $data['image'] = $request->file('image')->store('projects', 'public');
        }

        unset($data['gallery_images'], $data['gallery_alt_texts']);

        $project = Project::create($data);

        if ($request->hasFile('gallery_images')) {
            $altTexts = $request->input('gallery_alt_texts', []);
            foreach ($request->file('gallery_images') as $index => $image) {
                $project->images()->create([
                    'image_path' => $image->store('projects/gallery', 'public'),
                    'alt_text' => $altTexts[$index] ?? null,
                    'sort_order' => $index,
                ]);
            }
        }

        return response()->json([
            'message' => 'Project created successfully!',
            'data' => new ProjectResource($project->load('images')),
        ], 201);
    }

    /**
     * Update the specified project.
     */
    public function update(UpdateProjectRequest $request, Project $project): JsonResponse
    {
        $this->authorize('update', $project);

        $data = $request->validated();

        if ($request->hasFile('image')) {
            if ($project->image) {
                Storage::disk('public')->delete($project->image);
            }
            $data['image'] = $request->file('image')->store('projects', 'public');
        }

        unset($data['gallery_images'], $data['gallery_alt_texts'], $data['delete_gallery_images']);

        $project->update($data);

        // Handle gallery image deletion
        if ($request->has('delete_gallery_images')) {
            $imagesToDelete = $project->images()
                ->whereIn('id', $request->input('delete_gallery_images'))
                ->get();

            foreach ($imagesToDelete as $image) {
                Storage::disk('public')->delete($image->image_path);
                $image->delete();
            }
        }

        // Handle new gallery images
        if ($request->hasFile('gallery_images')) {
            $altTexts = $request->input('gallery_alt_texts', []);
            $currentMaxOrder = $project->images()->max('sort_order') ?? -1;

            foreach ($request->file('gallery_images') as $index => $image) {
                $project->images()->create([
                    'image_path' => $image->store('projects/gallery', 'public'),
                    'alt_text' => $altTexts[$index] ?? null,
                    'sort_order' => $currentMaxOrder + $index + 1,
                ]);
            }
        }

        return response()->json([
            'message' => 'Project updated successfully!',
            'data' => new ProjectResource($project->load('images')),
        ]);
    }

    /**
     * Remove the specified project.
     */
    public function destroy(Project $project): JsonResponse
    {
        $this->authorize('delete', $project);

        if ($project->image) {
            Storage::disk('public')->delete($project->image);
        }

        foreach ($project->images as $image) {
            Storage::disk('public')->delete($image->image_path);
        }

        $project->delete();

        return response()->json(['message' => 'Project deleted successfully!']);
    }
}
