<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreProjectRequest;
use App\Http\Requests\UpdateProjectRequest;
use App\Models\Project;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class ProjectController extends Controller
{
    public function index(Request $request): Response
    {
        $projects = Project::query()
            ->published()
            ->with('images')
            ->when($request->search, function ($query, $search) {
                $query->where('title', 'like', "%{$search}%")
                      ->orWhere('description', 'like', "%{$search}%");
            })
            ->when($request->featured, function ($query) {
                $query->featured();
            })
            ->ordered()
            ->paginate(12)
            ->withQueryString();

        return Inertia::render('Projects/Index', [
            'projects' => $projects,
            'filters' => $request->only('search', 'featured'),
        ]);
    }

    public function show(string $slug): Response
    {
        $project = Project::where('slug', $slug)
            ->with(['images', 'reactions.user'])
            ->published()
            ->firstOrFail();

        // Record page view
        $project->recordView();

        return Inertia::render('Projects/Show', [
            'project' => $project,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Admin/Projects/Create');
    }

    public function store(StoreProjectRequest $request)
    {
        $data = $request->validated();

        // Handle image upload
        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('projects', 'public');
            $data['image'] = $imagePath;
        }

        $project = Project::create($data);

        return redirect()
            ->route('admin.projects.show', $project)
            ->with('success', 'Project created successfully!');
    }

    public function edit(Project $project): Response
    {
        return Inertia::render('Admin/Projects/Edit', [
            'project' => $project,
        ]);
    }

    public function update(UpdateProjectRequest $request, Project $project)
    {
        $data = $request->validated();

        // Handle image upload
        if ($request->hasFile('image')) {
            // Delete old image
            if ($project->image) {
                Storage::disk('public')->delete($project->image);
            }

            $imagePath = $request->file('image')->store('projects', 'public');
            $data['image'] = $imagePath;
        }

        $project->update($data);

        return redirect()
            ->route('admin.projects.show', $project)
            ->with('success', 'Project updated successfully!');
    }

    public function destroy(Project $project)
    {
        // Delete project image
        if ($project->image) {
            Storage::disk('public')->delete($project->image);
        }

        // Delete gallery images
        foreach ($project->images as $image) {
            Storage::disk('public')->delete($image->image_path);
        }

        $project->delete();

        return redirect()
            ->route('admin.projects.index')
            ->with('success', 'Project deleted successfully!');
    }

    // Admin methods
    public function adminIndex(Request $request): Response
    {
        $projects = Project::query()
            ->with('images')
            ->when($request->search, function ($query, $search) {
                $query->where('title', 'like', "%{$search}%")
                      ->orWhere('description', 'like', "%{$search}%");
            })
            ->when($request->status, function ($query, $status) {
                $query->where('status', $status);
            })
            ->latest()
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('Admin/Projects/Index', [
            'projects' => $projects,
            'filters' => $request->only('search', 'status'),
        ]);
    }

    public function adminShow(Project $project): Response
    {
        $project->load(['images', 'reactions.user']);

        return Inertia::render('Admin/Projects/Show', [
            'project' => $project,
        ]);
    }
}
