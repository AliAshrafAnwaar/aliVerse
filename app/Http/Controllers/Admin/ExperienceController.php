<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreExperienceRequest;
use App\Http\Requests\UpdateExperienceRequest;
use App\Models\Experience;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ExperienceController extends Controller
{
    public function index(Request $request)
    {
        $experiences = Experience::query()
            ->when($request->search, fn($query, $search) => 
                $query->where('company', 'like', "%{$search}%")
                    ->orWhere('position', 'like', "%{$search}%")
            )
            ->when($request->is_current !== null, fn($query, $isCurrent) => 
                $query->where('is_current', $isCurrent === 'true')
            )
            ->ordered()
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('Admin/Experiences/Index', [
            'experiences' => $experiences,
            'filters' => $request->only('search', 'is_current'),
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Experiences/Create');
    }

    public function store(StoreExperienceRequest $request)
    {
        $data = $request->validated();
        
        if ($data['is_current']) {
            $data['end_date'] = null;
        }

        Experience::create($data);

        return redirect()->route('admin.experiences.index')
            ->with('success', 'Experience created successfully.');
    }

    public function show(Experience $experience)
    {
        return Inertia::render('Admin/Experiences/Show', [
            'experience' => $experience,
        ]);
    }

    public function edit(Experience $experience)
    {
        return Inertia::render('Admin/Experiences/Edit', [
            'experience' => $experience,
        ]);
    }

    public function update(UpdateExperienceRequest $request, Experience $experience)
    {
        $data = $request->validated();
        
        if ($data['is_current']) {
            $data['end_date'] = null;
        }

        $experience->update($data);

        return redirect()->route('admin.experiences.index')
            ->with('success', 'Experience updated successfully.');
    }

    public function destroy(Experience $experience)
    {
        $experience->delete();

        return redirect()->route('admin.experiences.index')
            ->with('success', 'Experience deleted successfully.');
    }
}
