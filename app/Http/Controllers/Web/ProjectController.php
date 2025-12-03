<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreProjectRequest;
use App\Http\Requests\UpdateProjectRequest;
use App\Models\Project;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class ProjectController extends Controller
{
    /**
     * Display a listing of published projects (public).
     */
    public function index(Request $request): Response
    {
        $projects = Project::query()
            ->published()
            ->with('images')
            ->search($request->search)
            ->when($request->featured, fn($q) => $q->featured())
            ->ordered()
            ->paginate(12)
            ->withQueryString();

        return Inertia::render('Projects/Index', [
            'projects' => $projects,
            'filters' => $request->only('search', 'featured'),
        ]);
    }

    /**
     * Display the specified project (public).
     */
    public function show(string $slug): Response
    {
        $project = Project::where('slug', $slug)
            ->with(['images', 'reactions.user'])
            ->published()
            ->firstOrFail();

        $project->recordView();

        $userReaction = null;
        if (auth()->check()) {
            $userReaction = $project->reactions()->where('user_id', auth()->id())->first();
        }

        $project->views_count = $project->getViewsCount();
        $project->total_reactions_count = $project->getTotalReactionsCount();

        return Inertia::render('Projects/Show', [
            'project' => $project,
            'userReaction' => $userReaction,
            'reactionCounts' => $project->getReactionCounts(),
        ]);
    }

    /**
     * Display admin listing of projects.
     */
    public function adminIndex(Request $request): Response
    {
        $projects = Project::query()
            ->with('images')
            ->search($request->search)
            ->when($request->status, fn($q, $status) => $q->where('status', $status))
            ->latest()
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('Admin/Projects/Index', [
            'projects' => $projects,
            'filters' => $request->only('search', 'status'),
        ]);
    }

    /**
     * Display the specified project for admin.
     */
    public function adminShow(Project $project): Response
    {
        $project->load(['images', 'reactions.user']);

        return Inertia::render('Admin/Projects/Show', [
            'project' => $project,
        ]);
    }

    /**
     * Show the form for creating a new project.
     */
    public function create(): Response
    {
        $this->authorize('create', Project::class);

        return Inertia::render('Admin/Projects/Create');
    }

    /**
     * Store a newly created project.
     */
    public function store(StoreProjectRequest $request): RedirectResponse
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

        return redirect()
            ->route('admin.projects.show', $project)
            ->with('success', 'Project created successfully!');
    }

    /**
     * Show the form for editing the specified project.
     */
    public function edit(Project $project): Response
    {
        $this->authorize('update', $project);

        $project->load('images');

        return Inertia::render('Admin/Projects/Edit', [
            'project' => $project,
        ]);
    }

    /**
     * Update the specified project.
     */
    public function update(UpdateProjectRequest $request, Project $project): RedirectResponse
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

        if ($request->has('delete_gallery_images')) {
            $imagesToDelete = $project->images()
                ->whereIn('id', $request->input('delete_gallery_images'))
                ->get();

            foreach ($imagesToDelete as $image) {
                Storage::disk('public')->delete($image->image_path);
                $image->delete();
            }
        }

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

        return redirect()
            ->route('admin.projects.show', $project)
            ->with('success', 'Project updated successfully!');
    }

    /**
     * Remove the specified project.
     */
    public function destroy(Project $project): RedirectResponse
    {
        $this->authorize('delete', $project);

        if ($project->image) {
            Storage::disk('public')->delete($project->image);
        }

        foreach ($project->images as $image) {
            Storage::disk('public')->delete($image->image_path);
        }

        $project->delete();

        return redirect()
            ->route('admin.projects.index')
            ->with('success', 'Project deleted successfully!');
    }
}
