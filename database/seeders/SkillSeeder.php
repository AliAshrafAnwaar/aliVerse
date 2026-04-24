<?php

namespace Database\Seeders;

use App\Models\Skill;
use Illuminate\Database\Seeder;

class SkillSeeder extends Seeder
{
    public function run(): void
    {
        $skills = [
            ['name' => 'Laravel',    'category' => 'backend',     'proficiency_level' => 9, 'is_featured' => true,  'sort_order' => 1],
            ['name' => 'PHP',        'category' => 'backend',     'proficiency_level' => 9, 'is_featured' => true,  'sort_order' => 2],
            ['name' => 'React',      'category' => 'frontend',    'proficiency_level' => 8, 'is_featured' => true,  'sort_order' => 3],
            ['name' => 'Tailwind',   'category' => 'frontend',    'proficiency_level' => 8, 'is_featured' => false, 'sort_order' => 4],
            ['name' => 'Inertia.js', 'category' => 'frontend',    'proficiency_level' => 7, 'is_featured' => false, 'sort_order' => 5],
            ['name' => 'PostgreSQL', 'category' => 'tools',       'proficiency_level' => 7, 'is_featured' => false, 'sort_order' => 6],
            ['name' => 'Git',        'category' => 'tools',       'proficiency_level' => 8, 'is_featured' => false, 'sort_order' => 7],
            ['name' => 'Teamwork',   'category' => 'soft_skills', 'proficiency_level' => 9, 'is_featured' => false, 'sort_order' => 8],
        ];

        foreach ($skills as $data) {
            Skill::updateOrCreate(['name' => $data['name']], $data);
        }
    }
}
