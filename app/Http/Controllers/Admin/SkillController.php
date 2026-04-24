<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreSkillRequest;
use App\Http\Requests\UpdateSkillRequest;
use App\Models\Skill;
use App\Services\SkillService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class SkillController extends Controller
{
    private const CATEGORIES = ['frontend', 'backend', 'tools', 'soft_skills'];

    public function __construct(private readonly SkillService $skills) {}

    public function index(Request $request): Response
    {
        $this->authorize('viewAny', Skill::class);

        $skills = Skill::query()
            ->when($request->string('search')->toString(), fn ($q, $s) => $q
                ->where('name', 'like', "%{$s}%")
                ->orWhere('category', 'like', "%{$s}%"))
            ->when($request->string('category')->toString(), fn ($q, $c) => $q->where('category', $c))
            ->ordered()
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('Admin/Skills/Index', [
            'skills'     => $skills,
            'filters'    => $request->only('search', 'category'),
            'categories' => self::CATEGORIES,
        ]);
    }

    public function create(): Response
    {
        $this->authorize('create', Skill::class);

        return Inertia::render('Admin/Skills/Create', [
            'categories' => self::CATEGORIES,
        ]);
    }

    public function store(StoreSkillRequest $request): RedirectResponse
    {
        $this->skills->create($request->validated(), $request->file('image'));

        return redirect()
            ->route('admin.skills.index')
            ->with('success', __('skills.flash.created'));
    }

    public function show(Skill $skill): Response
    {
        $this->authorize('view', $skill);

        return Inertia::render('Admin/Skills/Show', [
            'skill' => $skill,
        ]);
    }

    public function edit(Skill $skill): Response
    {
        $this->authorize('update', $skill);

        return Inertia::render('Admin/Skills/Edit', [
            'skill'      => $skill,
            'categories' => self::CATEGORIES,
        ]);
    }

    public function update(UpdateSkillRequest $request, Skill $skill): RedirectResponse
    {
        $this->skills->update($skill, $request->validated(), $request->file('image'));

        return redirect()
            ->route('admin.skills.index')
            ->with('success', __('skills.flash.updated'));
    }

    public function destroy(Skill $skill): RedirectResponse
    {
        $this->authorize('delete', $skill);

        $this->skills->delete($skill);

        return redirect()
            ->route('admin.skills.index')
            ->with('success', __('skills.flash.deleted'));
    }
}
