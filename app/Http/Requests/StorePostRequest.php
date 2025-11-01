<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StorePostRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true; // Allow authenticated users to create posts
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'title' => 'required|string|max:255|unique:posts,title',
            'excerpt' => 'nullable|string|max:500',
            'content' => 'required|string|min:10',
            'category_id' => 'nullable|exists:categories,id',
            'featured_image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'meta_description' => 'nullable|string|max:160',
            'meta_keywords' => 'nullable|string|max:255',
            'status' => 'required|in:draft,published,scheduled,archived',
            'featured' => 'boolean',
            'published_at' => 'nullable|date|after_or_equal:now',
            'tags' => 'nullable|array',
            'tags.*' => 'exists:tags,id',
        ];
    }

    /**
     * Get custom messages for validator errors.
     */
    public function messages(): array
    {
        return [
            'title.required' => 'The post title is required.',
            'title.unique' => 'A post with this title already exists.',
            'content.required' => 'The post content is required.',
            'content.min' => 'The post content must be at least 10 characters.',
            'category_id.exists' => 'The selected category does not exist.',
            'published_at.after_or_equal' => 'The publish date must be today or in the future.',
            'tags.*.exists' => 'One or more selected tags do not exist.',
        ];
    }
}
