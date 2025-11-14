<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreSkillRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
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
            'category' => 'required|in:frontend,backend,tools,soft_skills',
            'proficiency_level' => 'required|integer|min:1|max:10',
            'image' => 'nullable|image|mimes:jpg,jpeg,png,webp,avif,gif|max:5120',
            'is_featured' => 'boolean',
            'sort_order' => 'integer|min:0',
        ];
    }
}
