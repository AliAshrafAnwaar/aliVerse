<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreTestimonialRequest;
use App\Http\Requests\UpdateTestimonialRequest;
use App\Models\Testimonial;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TestimonialController extends Controller
{
    public function index(Request $request)
    {
        $testimonials = Testimonial::query()
            ->when($request->search, fn($query, $search) => 
                $query->where('client_name', 'like', "%{$search}%")
                    ->orWhere('client_company', 'like', "%{$search}%")
            )
            ->when($request->is_featured !== null, fn($query, $isFeatured) => 
                $query->where('is_featured', $isFeatured === 'true')
            )
            ->when($request->is_active !== null, fn($query, $isActive) => 
                $query->where('is_active', $isActive === 'true')
            )
            ->ordered()
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('Admin/Testimonials/Index', [
            'testimonials' => $testimonials,
            'filters' => $request->only('search', 'is_featured', 'is_active'),
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Testimonials/Create');
    }

    public function store(StoreTestimonialRequest $request)
    {
        Testimonial::create($request->validated());

        return redirect()->route('admin.testimonials.index')
            ->with('success', 'Testimonial created successfully.');
    }

    public function show(Testimonial $testimonial)
    {
        return Inertia::render('Admin/Testimonials/Show', [
            'testimonial' => $testimonial,
        ]);
    }

    public function edit(Testimonial $testimonial)
    {
        return Inertia::render('Admin/Testimonials/Edit', [
            'testimonial' => $testimonial,
        ]);
    }

    public function update(UpdateTestimonialRequest $request, Testimonial $testimonial)
    {
        $testimonial->update($request->validated());

        return redirect()->route('admin.testimonials.index')
            ->with('success', 'Testimonial updated successfully.');
    }

    public function destroy(Testimonial $testimonial)
    {
        $testimonial->delete();

        return redirect()->route('admin.testimonials.index')
            ->with('success', 'Testimonial deleted successfully.');
    }
}
