<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreSkillRequest;
use App\Http\Requests\UpdateSkillRequest;
use App\Models\Skill;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class SkillController extends Controller
{
    public function index(Request $request)
    {
        $skills = Skill::query()
            ->when($request->search, fn($query, $search) => 
                $query->where('name', 'like', "%{$search}%")
                    ->orWhere('category', 'like', "%{$search}%")
            )
            ->when($request->category, fn($query, $category) => 
                $query->where('category', $category)
            )
            ->ordered()
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('Admin/Skills/Index', [
            'skills' => $skills,
            'filters' => $request->only('search', 'category'),
            'categories' => ['frontend', 'backend', 'tools', 'soft_skills'],
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Skills/Create', [
            'categories' => ['frontend', 'backend', 'tools', 'soft_skills'],
        ]);
    }

    public function store(StoreSkillRequest $request)
    {
        $data = $request->validated();

        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('skills', 'public');
            $data['image_path'] = $path;
        }

        Skill::create($data);

        return redirect()->route('admin.skills.index')
            ->with('success', 'Skill created successfully.');
    }

    public function show(Skill $skill)
    {
        return Inertia::render('Admin/Skills/Show', [
            'skill' => $skill,
        ]);
    }

    public function edit(Skill $skill)
    {
        return Inertia::render('Admin/Skills/Edit', [
            'skill' => $skill,
            'categories' => ['frontend', 'backend', 'tools', 'soft_skills'],
        ]);
    }

    public function update(UpdateSkillRequest $request, Skill $skill)
    {
        $data = $request->validated();

        \Log::info('Updating skill: ' . $skill->id, $data);

        if ($request->hasFile('image')) {
            // delete old image if exists
            if ($skill->image_path && Storage::disk('public')->exists($skill->image_path)) {
                \Log::info('Deleting old image: ' . $skill->image_path);
                Storage::disk('public')->delete($skill->image_path);
            }
            $path = $request->file('image')->store('skills', 'public');
            $data['image_path'] = $path;
            \Log::info('Uploading new image: ' . $path);
        }

        $skill->update($data);

        \Log::info('Skill updated successfully.');

        return redirect()->route('admin.skills.index')
            ->with('success', 'Skill updated successfully.');
    }

    public function destroy(Skill $skill)
    {
        if ($skill->image_path && Storage::disk('public')->exists($skill->image_path)) {
            Storage::disk('public')->delete($skill->image_path);
        }
        $skill->delete();

        return redirect()->route('admin.skills.index')
            ->with('success', 'Skill deleted successfully.');
    }
}
