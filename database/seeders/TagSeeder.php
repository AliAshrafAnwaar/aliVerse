<?php

namespace Database\Seeders;

use App\Models\Tag;
use Illuminate\Database\Seeder;

class TagSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Clear existing tags
        Tag::query()->forceDelete();

        $tags = [
            // Technology Tags
            ['name' => 'Laravel', 'color' => '#FF2D20'],
            ['name' => 'PHP', 'color' => '#777BB4'],
            ['name' => 'React', 'color' => '#61DAFB'],
            ['name' => 'JavaScript', 'color' => '#F7DF1E'],
            ['name' => 'TypeScript', 'color' => '#3178C6'],
            ['name' => 'Node.js', 'color' => '#339933'],
            ['name' => 'Python', 'color' => '#3776AB'],
            ['name' => 'Docker', 'color' => '#2496ED'],
            ['name' => 'PostgreSQL', 'color' => '#4169E1'],
            ['name' => 'MySQL', 'color' => '#4479A1'],
            ['name' => 'Redis', 'color' => '#DC382D'],
            ['name' => 'AWS', 'color' => '#FF9900'],
            ['name' => 'Flutter', 'color' => '#02569B'],
            ['name' => 'Firebase', 'color' => '#FFCA28'],
            ['name' => 'Vue.js', 'color' => '#4FC08D'],
            ['name' => 'Tailwind CSS', 'color' => '#06B6D4'],
            ['name' => 'API', 'color' => '#6366F1'],
            ['name' => 'REST', 'color' => '#10B981'],
            ['name' => 'GraphQL', 'color' => '#E10098'],
            ['name' => 'Linux', 'color' => '#FCC624'],
            ['name' => 'Git', 'color' => '#F05032'],
            ['name' => 'CI/CD', 'color' => '#40BE46'],
            ['name' => 'AMD', 'color' => '#ED1C24'],
            ['name' => 'Intel', 'color' => '#0071C5'],
            ['name' => 'NVIDIA', 'color' => '#76B900'],
            ['name' => 'Networking', 'color' => '#0096D6'],
            ['name' => '5G', 'color' => '#FF6B6B'],
            ['name' => 'IoT', 'color' => '#00D4AA'],
            
            // Hobbies Tags
            ['name' => 'Snakehead Fish', 'color' => '#1E3A5F'],
            ['name' => 'Bass Fishing', 'color' => '#2563EB'],
            ['name' => 'Fly Fishing', 'color' => '#059669'],
            ['name' => 'Sci-Fi Books', 'color' => '#7C3AED'],
            ['name' => 'Technical Books', 'color' => '#DC2626'],
            ['name' => 'Mountain Biking', 'color' => '#D97706'],
            ['name' => 'Road Cycling', 'color' => '#0891B2'],
            ['name' => 'Hydroponics', 'color' => '#16A34A'],
            ['name' => 'Tomatoes', 'color' => '#EF4444'],
            ['name' => 'Organic Farming', 'color' => '#84CC16'],
            ['name' => 'PC Gaming', 'color' => '#7C3AED'],
            ['name' => 'Console Gaming', 'color' => '#2563EB'],
            ['name' => 'Indie Games', 'color' => '#EC4899'],
            ['name' => 'Woodworking', 'color' => '#92400E'],
            ['name' => 'Electronics', 'color' => '#0EA5E9'],
            
            // Life Tags
            ['name' => 'Productivity', 'color' => '#059669'],
            ['name' => 'Time Management', 'color' => '#7C3AED'],
            ['name' => 'Mindfulness', 'color' => '#06B6D4'],
            ['name' => 'Meditation', 'color' => '#8B5CF6'],
            ['name' => 'Career Tips', 'color' => '#F59E0B'],
            ['name' => 'Interview Prep', 'color' => '#10B981'],
            ['name' => 'Work-Life Balance', 'color' => '#EC4899'],
            ['name' => 'Personal Growth', 'color' => '#6366F1'],
            ['name' => 'Philosophy', 'color' => '#64748B'],
            ['name' => 'Motivation', 'color' => '#EF4444'],
            ['name' => 'Leadership', 'color' => '#0891B2'],
            ['name' => 'Communication', 'color' => '#F97316'],
        ];

        foreach ($tags as $tagData) {
            Tag::create([
                'name' => $tagData['name'],
                'color' => $tagData['color'],
                'is_active' => true,
            ]);
        }

        $this->command->info('Tags seeded successfully! Total: ' . Tag::count());
    }
}
