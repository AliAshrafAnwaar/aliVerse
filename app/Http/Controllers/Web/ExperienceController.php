<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreExperienceRequest;
use App\Http\Requests\UpdateExperienceRequest;
use App\Models\Experience;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class ExperienceController extends Controller
{
    /**
     * Display a listing of experiences.
     */
    public function index(Request $request): Response
    {
        $experiences = Experience::query()
            ->when($request->search, fn($q, $search) => 
                $q->where('company', 'like', "%{$search}%")
                  ->orWhere('position', 'like', "%{$search}%")
            )
            ->when($request->is_current !== null, fn($q) => 
                $q->where('is_current', $request->is_current === 'true')
            )
            ->ordered()
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('Admin/Experiences/Index', [
            'experiences' => $experiences,
            'filters' => $request->only('search', 'is_current'),
        ]);
    }

    /**
     * Show the form for creating a new experience.
     */
    public function create(): Response
    {
        return Inertia::render('Admin/Experiences/Create');
    }

    /**
     * Store a newly created experience.
     */
    public function store(StoreExperienceRequest $request): RedirectResponse
    {
        $data = $request->validated();

        if ($data['is_current']) {
            $data['end_date'] = null;
        }

        Experience::create($data);

        return redirect()->route('admin.experiences.index')
            ->with('success', 'Experience created successfully.');
    }

    /**
     * Display the specified experience.
     */
    public function show(Experience $experience): Response
    {
        return Inertia::render('Admin/Experiences/Show', [
            'experience' => $experience,
        ]);
    }

    /**
     * Show the form for editing the specified experience.
     */
    public function edit(Experience $experience): Response
    {
        return Inertia::render('Admin/Experiences/Edit', [
            'experience' => $experience,
        ]);
    }

    /**
     * Update the specified experience.
     */
    public function update(UpdateExperienceRequest $request, Experience $experience): RedirectResponse
    {
        $data = $request->validated();

        if ($data['is_current']) {
            $data['end_date'] = null;
        }

        $experience->update($data);

        return redirect()->route('admin.experiences.index')
            ->with('success', 'Experience updated successfully.');
    }

    /**
     * Remove the specified experience.
     */
    public function destroy(Experience $experience): RedirectResponse
    {
        $experience->delete();

        return redirect()->route('admin.experiences.index')
            ->with('success', 'Experience deleted successfully.');
    }
}
