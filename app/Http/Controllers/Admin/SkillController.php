<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreSkillRequest;
use App\Http\Requests\UpdateSkillRequest;
use App\Models\Skill;
use Illuminate\Http\Request;
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
        Skill::create($request->validated());

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
        $skill->update($request->validated());

        return redirect()->route('admin.skills.index')
            ->with('success', 'Skill updated successfully.');
    }

    public function destroy(Skill $skill)
    {
        $skill->delete();

        return redirect()->route('admin.skills.index')
            ->with('success', 'Skill deleted successfully.');
    }
}
