<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreProjectRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return auth()->check() && auth()->user()->isAdmin();
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'title' => 'required|string|max:255',
            'slug' => 'required|string|max:255|unique:projects,slug',
            'description' => 'required|string|max:500',
            'content' => 'nullable|string',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:2048',
            'demo_url' => 'nullable|url|max:500',
            'github_url' => 'nullable|url|max:500',
            'technologies' => 'nullable|array|max:10',
            'technologies.*' => 'string|max:50',
            'featured' => 'boolean',
            'status' => 'required|in:draft,published,archived',
            'sort_order' => 'integer|min:0',
        ];
    }

    public function messages(): array
    {
        return [
            'title.required' => 'The project title is required.',
            'slug.required' => 'The URL slug is required.',
            'slug.unique' => 'This URL slug is already taken.',
            'description.required' => 'The project description is required.',
            'description.max' => 'Description must not exceed 500 characters.',
            'image.image' => 'The file must be an image.',
            'image.mimes' => 'Image must be jpeg, png, jpg, gif, or webp.',
            'image.max' => 'Image size must not exceed 2MB.',
            'technologies.max' => 'You can add maximum 10 technologies.',
            'status.required' => 'Project status is required.',
            'status.in' => 'Invalid project status selected.',
        ];
    }
}
