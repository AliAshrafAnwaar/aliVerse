<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateSkillRequest extends FormRequest
{
    public function authorize(): bool
    {
        $skill = $this->route('skill');

        return $skill !== null
            && (bool) $this->user()?->can('update', $skill);
    }

    /**
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $skillId = $this->route('skill')?->id;

        return [
            'name'              => ['sometimes', 'required', 'string', 'max:255', Rule::unique('skills', 'name')->ignore($skillId)],
            'category'          => ['sometimes', 'required', Rule::in(['frontend', 'backend', 'tools', 'soft_skills'])],
            'proficiency_level' => ['sometimes', 'required', 'integer', 'min:1', 'max:10'],
            'icon'              => ['nullable', 'string', 'max:255'],
            'image'             => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp,avif,gif', 'max:5120'],
            'is_featured'       => ['sometimes', 'boolean'],
            'sort_order'        => ['sometimes', 'integer', 'min:0'],
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
        $payload = [];

        if ($this->has('name') && is_string($this->name)) {
            $payload['name'] = trim($this->name);
        }

        if ($this->has('is_featured')) {
            $payload['is_featured'] = filter_var($this->is_featured, FILTER_VALIDATE_BOOLEAN, FILTER_NULL_ON_FAILURE) ?? false;
        }

        if ($payload) {
            $this->merge($payload);
        }
    }
}
