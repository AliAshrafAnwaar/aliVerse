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

        // Handle main image upload
        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('projects', 'public');
            $data['image'] = $imagePath;
        }

        // Remove gallery images from main data as they're handled separately
        unset($data['gallery_images']);
        unset($data['gallery_alt_texts']);

        $project = Project::create($data);

        // Handle gallery images upload
        if ($request->hasFile('gallery_images')) {
            $galleryImages = $request->file('gallery_images');
            $altTexts = $request->input('gallery_alt_texts', []);
            
            foreach ($galleryImages as $index => $image) {
                $imagePath = $image->store('projects/gallery', 'public');
                
                $project->images()->create([
                    'image_path' => $imagePath,
                    'alt_text' => $altTexts[$index] ?? null,
                    'sort_order' => $index,
                ]);
            }
        }

        return redirect()
            ->route('admin.projects.show', $project)
            ->with('success', 'Project created successfully!');
    }

    public function edit(Project $project): Response
    {
        $project->load('images');
        
        return Inertia::render('Admin/Projects/Edit', [
            'project' => $project,
        ]);
    }

    public function update(UpdateProjectRequest $request, Project $project)
    {
        $data = $request->validated();

        // Handle main image upload
        if ($request->hasFile('image')) {
            // Delete old image
            if ($project->image) {
                Storage::disk('public')->delete($project->image);
            }

            $imagePath = $request->file('image')->store('projects', 'public');
            $data['image'] = $imagePath;
        }

        // Remove gallery-related data from main update
        unset($data['gallery_images']);
        unset($data['gallery_alt_texts']);
        unset($data['delete_gallery_images']);

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

        // Handle new gallery images upload
        if ($request->hasFile('gallery_images')) {
            $galleryImages = $request->file('gallery_images');
            $altTexts = $request->input('gallery_alt_texts', []);
            $currentMaxOrder = $project->images()->max('sort_order') ?? -1;
            
            foreach ($galleryImages as $index => $image) {
                $imagePath = $image->store('projects/gallery', 'public');
                
                $project->images()->create([
                    'image_path' => $imagePath,
                    'alt_text' => $altTexts[$index] ?? null,
                    'sort_order' => $currentMaxOrder + $index + 1,
                ]);
            }
        }

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
