<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreEducationRequest;
use App\Http\Requests\UpdateEducationRequest;
use App\Models\Education;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class EducationController extends Controller
{
    /**
     * Display a listing of education entries.
     */
    public function index(Request $request): Response
    {
        $educations = Education::query()
            ->when($request->search, fn($q, $search) => 
                $q->where('institution', 'like', "%{$search}%")
                  ->orWhere('degree', 'like', "%{$search}%")
                  ->orWhere('field_of_study', 'like', "%{$search}%")
            )
            ->orderBy('start_date', 'desc')
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('Admin/Educations/Index', [
            'educations' => $educations,
            'filters' => $request->only('search'),
        ]);
    }

    /**
     * Show the form for creating a new education entry.
     */
    public function create(): Response
    {
        return Inertia::render('Admin/Educations/Create');
    }

    /**
     * Store a newly created education entry.
     */
    public function store(StoreEducationRequest $request): RedirectResponse
    {
        Education::create($request->validated());

        return redirect()->route('admin.educations.index')
            ->with('success', 'Education created successfully.');
    }

    /**
     * Display the specified education entry.
     */
    public function show(Education $education): Response
    {
        return Inertia::render('Admin/Educations/Show', [
            'education' => $education,
        ]);
    }

    /**
     * Show the form for editing the specified education entry.
     */
    public function edit(Education $education): Response
    {
        return Inertia::render('Admin/Educations/Edit', [
            'education' => $education,
        ]);
    }

    /**
     * Update the specified education entry.
     */
    public function update(UpdateEducationRequest $request, Education $education): RedirectResponse
    {
        $education->update($request->validated());

        return redirect()->route('admin.educations.index')
            ->with('success', 'Education updated successfully.');
    }

    /**
     * Remove the specified education entry.
     */
    public function destroy(Education $education): RedirectResponse
    {
        $education->delete();

        return redirect()->route('admin.educations.index')
            ->with('success', 'Education deleted successfully.');
    }
}
