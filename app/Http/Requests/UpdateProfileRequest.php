<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateProfileRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return auth()->check();
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email,' . auth()->id(),
            'avatar' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:2048',
            'bio' => 'nullable|string|max:1000',
            'position' => 'nullable|string|max:255',
            'location' => 'nullable|string|max:255',
            'website' => 'nullable|url|max:500',
            'github_url' => 'nullable|url|max:500',
            'linkedin_url' => 'nullable|url|max:500',
            'twitter_url' => 'nullable|url|max:500',
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'Your name is required.',
            'email.required' => 'Your email address is required.',
            'email.unique' => 'This email address is already taken.',
            'avatar.image' => 'The avatar must be an image file.',
            'avatar.mimes' => 'The avatar must be a JPEG, PNG, JPG, GIF, or WebP file.',
            'avatar.max' => 'The avatar may not be larger than 2MB.',
            'bio.max' => 'Bio may not be larger than 1000 characters.',
            'website.url' => 'Please enter a valid website URL.',
            'github_url.url' => 'Please enter a valid GitHub URL.',
            'linkedin_url.url' => 'Please enter a valid LinkedIn URL.',
            'twitter_url.url' => 'Please enter a valid Twitter URL.',
        ];
    }
}
