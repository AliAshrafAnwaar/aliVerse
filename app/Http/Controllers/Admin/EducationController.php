<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreEducationRequest;
use App\Http\Requests\UpdateEducationRequest;
use App\Models\Education;
use Illuminate\Http\Request;
use Inertia\Inertia;

class EducationController extends Controller
{
    public function index(Request $request)
    {
        $educations = Education::query()
            ->when($request->search, fn($query, $search) => 
                $query->where('institution', 'like', "%{$search}%")
                    ->orWhere('degree', 'like', "%{$search}%")
                    ->orWhere('field_of_study', 'like', "%{$search}%")
            )
            ->ordered()
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('Admin/Educations/Index', [
            'educations' => $educations,
            'filters' => $request->only('search'),
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Educations/Create');
    }

    public function store(StoreEducationRequest $request)
    {
        Education::create($request->validated());

        return redirect()->route('admin.educations.index')
            ->with('success', 'Education created successfully.');
    }

    public function show(Education $education)
    {
        return Inertia::render('Admin/Educations/Show', [
            'education' => $education,
        ]);
    }

    public function edit(Education $education)
    {
        return Inertia::render('Admin/Educations/Edit', [
            'education' => $education,
        ]);
    }

    public function update(UpdateEducationRequest $request, Education $education)
    {
        $education->update($request->validated());

        return redirect()->route('admin.educations.index')
            ->with('success', 'Education updated successfully.');
    }

    public function destroy(Education $education)
    {
        $education->delete();

        return redirect()->route('admin.educations.index')
            ->with('success', 'Education deleted successfully.');
    }
}
