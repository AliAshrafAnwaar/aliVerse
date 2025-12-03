<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreSkillRequest;
use App\Http\Requests\UpdateSkillRequest;
use App\Models\Skill;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class SkillController extends Controller
{
    private const CATEGORIES = ['frontend', 'backend', 'tools', 'soft_skills'];

    /**
     * Display a listing of skills.
     */
    public function index(Request $request): Response
    {
        $skills = Skill::query()
            ->when($request->search, fn($q, $search) => 
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('category', 'like', "%{$search}%")
            )
            ->when($request->category, fn($q, $cat) => $q->where('category', $cat))
            ->ordered()
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('Admin/Skills/Index', [
            'skills' => $skills,
            'filters' => $request->only('search', 'category'),
            'categories' => self::CATEGORIES,
        ]);
    }

    /**
     * Show the form for creating a new skill.
     */
    public function create(): Response
    {
        return Inertia::render('Admin/Skills/Create', [
            'categories' => self::CATEGORIES,
        ]);
    }

    /**
     * Store a newly created skill.
     */
    public function store(StoreSkillRequest $request): RedirectResponse
    {
        $data = $request->validated();

        if ($request->hasFile('image')) {
            $data['image_path'] = $request->file('image')->store('skills', 'public');
        }

        Skill::create($data);

        return redirect()->route('admin.skills.index')
            ->with('success', 'Skill created successfully.');
    }

    /**
     * Display the specified skill.
     */
    public function show(Skill $skill): Response
    {
        return Inertia::render('Admin/Skills/Show', [
            'skill' => $skill,
        ]);
    }

    /**
     * Show the form for editing the specified skill.
     */
    public function edit(Skill $skill): Response
    {
        return Inertia::render('Admin/Skills/Edit', [
            'skill' => $skill,
            'categories' => self::CATEGORIES,
        ]);
    }

    /**
     * Update the specified skill.
     */
    public function update(UpdateSkillRequest $request, Skill $skill): RedirectResponse
    {
        $data = $request->validated();

        if ($request->hasFile('image')) {
            if ($skill->image_path && Storage::disk('public')->exists($skill->image_path)) {
                Storage::disk('public')->delete($skill->image_path);
            }
            $data['image_path'] = $request->file('image')->store('skills', 'public');
        }

        $skill->update($data);

        return redirect()->route('admin.skills.index')
            ->with('success', 'Skill updated successfully.');
    }

    /**
     * Remove the specified skill.
     */
    public function destroy(Skill $skill): RedirectResponse
    {
        if ($skill->image_path && Storage::disk('public')->exists($skill->image_path)) {
            Storage::disk('public')->delete($skill->image_path);
        }
        
        $skill->delete();

        return redirect()->route('admin.skills.index')
            ->with('success', 'Skill deleted successfully.');
    }
}
