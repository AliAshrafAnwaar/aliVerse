<?php

namespace App\Http\Requests;

use App\Models\Skill;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreSkillRequest extends FormRequest
{
    public function authorize(): bool
    {
        return (bool) $this->user()?->can('create', Skill::class);
    }

    /**
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name'              => ['required', 'string', 'max:255', Rule::unique('skills', 'name')],
            'category'          => ['required', Rule::in(['frontend', 'backend', 'tools', 'soft_skills'])],
            'proficiency_level' => ['required', 'integer', 'min:1', 'max:10'],
            'icon'              => ['nullable', 'string', 'max:255'],
            'image'             => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp,avif,gif', 'max:5120'],
            'is_featured'       => ['boolean'],
            'sort_order'        => ['integer', 'min:0'],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function attributes(): array
    {
        return [
            'name'              => __('validation.attributes.skill.name'),
            'category'          => __('validation.attributes.skill.category'),
            'proficiency_level' => __('validation.attributes.skill.proficiency_level'),
            'image'             => __('validation.attributes.skill.image'),
            'is_featured'       => __('validation.attributes.skill.is_featured'),
            'sort_order'        => __('validation.attributes.skill.sort_order'),
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'name.unique'               => __('validation.custom.skill.name.unique'),
            'category.in'               => __('validation.custom.skill.category.in'),
            'proficiency_level.between' => __('validation.custom.skill.proficiency_level.between'),
        ];
    }

    protected function prepareForValidation(): void
    {
        $this->merge([
            'name'        => is_string($this->name) ? trim($this->name) : $this->name,
            'is_featured' => filter_var($this->is_featured, FILTER_VALIDATE_BOOLEAN, FILTER_NULL_ON_FAILURE) ?? false,
            'sort_order'  => (int) ($this->sort_order ?? 0),
        ]);
    }
}
