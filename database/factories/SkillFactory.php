<?php

namespace Database\Factories;

use App\Models\Skill;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Skill>
 */
class SkillFactory extends Factory
{
    protected $model = Skill::class;

    public function definition(): array
    {
        return [
            'name'              => $this->faker->unique()->words(2, true),
            'category'          => $this->faker->randomElement(['frontend', 'backend', 'tools', 'soft_skills']),
            'proficiency_level' => $this->faker->numberBetween(1, 10),
            'icon'              => null,
            'image_path'        => null,
            'is_featured'       => false,
            'sort_order'        => 0,
        ];
    }

    public function featured(): static
    {
        return $this->state(fn () => ['is_featured' => true]);
    }

    public function category(string $category): static
    {
        return $this->state(fn () => ['category' => $category]);
    }
}
