<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;

class CategoryHierarchySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Clear existing categories
        Category::query()->forceDelete();

        // Main Categories (Fixed)
        $mainCategories = [
            [
                'name' => 'Technology',
                'description' => 'All things tech - web development, hardware, telecom, and more',
                'color' => '#3B82F6', // Blue
                'icon' => 'laptop',
                'sort_order' => 1,
                'subcategories' => [
                    ['name' => 'Web Development', 'color' => '#60A5FA', 'icon' => 'globe'],
                    ['name' => 'Backend', 'color' => '#34D399', 'icon' => 'server'],
                    ['name' => 'Telecom', 'color' => '#A78BFA', 'icon' => 'radio'],
                    ['name' => 'Hardware', 'color' => '#F87171', 'icon' => 'cpu'],
                    ['name' => 'Mobile Development', 'color' => '#FBBF24', 'icon' => 'smartphone'],
                    ['name' => 'DevOps', 'color' => '#2DD4BF', 'icon' => 'cloud'],
                    ['name' => 'AI & Machine Learning', 'color' => '#EC4899', 'icon' => 'brain'],
                ],
            ],
            [
                'name' => 'Hobbies',
                'description' => 'Personal interests, activities, and pastimes',
                'color' => '#10B981', // Green
                'icon' => 'heart',
                'sort_order' => 2,
                'subcategories' => [
                    ['name' => 'Fishing', 'color' => '#06B6D4', 'icon' => 'fish'],
                    ['name' => 'Reading', 'color' => '#8B5CF6', 'icon' => 'book'],
                    ['name' => 'Riding', 'color' => '#F59E0B', 'icon' => 'bike'],
                    ['name' => 'Farming', 'color' => '#22C55E', 'icon' => 'sprout'],
                    ['name' => 'Gaming', 'color' => '#EF4444', 'icon' => 'gamepad'],
                    ['name' => 'DIY & Crafts', 'color' => '#F97316', 'icon' => 'hammer'],
                    ['name' => 'Photography', 'color' => '#6366F1', 'icon' => 'camera'],
                ],
            ],
            [
                'name' => 'Life',
                'description' => 'Life experiences, advice, and personal growth',
                'color' => '#8B5CF6', // Purple
                'icon' => 'compass',
                'sort_order' => 3,
                'subcategories' => [
                    ['name' => 'Religion', 'color' => '#A855F7', 'icon' => 'book-open'],
                    ['name' => 'Self Management', 'color' => '#14B8A6', 'icon' => 'target'],
                    ['name' => 'Advice', 'color' => '#F472B6', 'icon' => 'lightbulb'],
                    ['name' => 'Ethics', 'color' => '#64748B', 'icon' => 'scale'],
                    ['name' => 'Health & Wellness', 'color' => '#22D3EE', 'icon' => 'heart-pulse'],
                    ['name' => 'Career', 'color' => '#84CC16', 'icon' => 'briefcase'],
                    ['name' => 'Relationships', 'color' => '#FB7185', 'icon' => 'users'],
                ],
            ],
        ];

        foreach ($mainCategories as $mainData) {
            $subcategories = $mainData['subcategories'];
            unset($mainData['subcategories']);

            // Create main category
            $mainCategory = Category::create([
                ...$mainData,
                'type' => 'main',
                'parent_id' => null,
                'is_active' => true,
            ]);

            // Create subcategories
            foreach ($subcategories as $index => $subData) {
                Category::create([
                    'name' => $subData['name'],
                    'color' => $subData['color'],
                    'icon' => $subData['icon'] ?? null,
                    'description' => null,
                    'type' => 'sub',
                    'parent_id' => $mainCategory->id,
                    'is_active' => true,
                    'sort_order' => $index + 1,
                ]);
            }
        }

        $this->command->info('Category hierarchy seeded successfully!');
        $this->command->info('Main categories: ' . Category::where('type', 'main')->count());
        $this->command->info('Subcategories: ' . Category::where('type', 'sub')->count());
    }
}
