<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Tag;
use App\Models\Post;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class BlogSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get or create a user for posts
        $user = User::first() ?? User::factory()->create([
            'name' => 'Admin User',
            'email' => 'admin@example.com',
            'is_admin' => true,
        ]);

        // Create categories only if they don't exist
        if (Category::count() === 0) {
            $categories = [
                [
                    'name' => 'Web Development',
                    'description' => 'Articles about web development, frontend, and backend technologies',
                    'color' => '#3B82F6',
                    'icon' => 'code',
                    'sort_order' => 1,
                ],
                [
                    'name' => 'Laravel',
                    'description' => 'Tips, tricks, and tutorials for Laravel framework',
                    'color' => '#EF4444',
                    'icon' => 'laravel',
                    'sort_order' => 2,
                ],
                [
                    'name' => 'React',
                    'description' => 'React.js tutorials, hooks, and best practices',
                    'color' => '#61DAFB',
                    'icon' => 'react',
                    'sort_order' => 3,
                ],
            ];

            foreach ($categories as $categoryData) {
                Category::create($categoryData);
            }
        }

        // Create tags only if they don't exist
        if (Tag::count() === 0) {
            $tags = [
                ['name' => 'PHP', 'color' => '#777BB4'],
                ['name' => 'JavaScript', 'color' => '#F7DF1E'],
                ['name' => 'React', 'color' => '#61DAFB'],
                ['name' => 'Laravel', 'color' => '#FF2D20'],
                ['name' => 'Tailwind CSS', 'color' => '#06B6D4'],
                ['name' => 'PostgreSQL', 'color' => '#4169E1'],
                ['name' => 'Docker', 'color' => '#2496ED'],
                ['name' => 'TypeScript', 'color' => '#3178C6'],
            ];

            foreach ($tags as $tagData) {
                Tag::create($tagData);
            }
        }

        // Create sample posts only if they don't exist
        if (Post::count() === 0) {
            $webDevCategory = Category::where('name', 'Web Development')->first();
            $laravelCategory = Category::where('name', 'Laravel')->first();
            $reactCategory = Category::where('name', 'React')->first();

            $phpTag = Tag::where('name', 'PHP')->first();
            $laravelTag = Tag::where('name', 'Laravel')->first();
            $reactTag = Tag::where('name', 'React')->first();
            $jsTag = Tag::where('name', 'JavaScript')->first();

            // Create sample posts
            $posts = [
                [
                    'title' => 'Getting Started with Laravel 12: A Complete Guide',
                    'excerpt' => 'Learn how to set up and build your first Laravel 12 application with the latest features and best practices.',
                    'content' => '<h2>Introduction to Laravel 12</h2><p>Laravel 12 brings exciting new features that make web development even more enjoyable...</p><p>In this comprehensive guide, we\'ll walk through everything you need to know to get started with Laravel 12.</p><h3>Prerequisites</h3><p>Before we begin, make sure you have PHP 8.3+ and Composer installed on your system.</p><h3>Installation</h3><p>Installing Laravel 12 is straightforward with the Laravel installer...</p>',
                    'meta_description' => 'Complete guide to getting started with Laravel 12, including installation, setup, and first application.',
                    'meta_keywords' => 'Laravel, PHP, Web Development, Tutorial',
                    'status' => 'published',
                    'featured' => true,
                    'published_at' => now()->subDays(7),
                    'category_id' => $laravelCategory->id,
                    'tags' => [$phpTag->id, $laravelTag->id],
                ],
                [
                    'title' => 'Building Modern React Apps with Hooks and Context',
                    'excerpt' => 'Discover how to build scalable React applications using modern hooks and context API for state management.',
                    'content' => '<h2>React Hooks Revolution</h2><p>React Hooks have changed the way we write React components...</p><p>In this article, we\'ll explore the power of useState, useEffect, and useContext hooks.</p><h3>Custom Hooks</h3><p>Learn how to create your own custom hooks to share logic between components...</p>',
                    'meta_description' => 'Learn to build modern React applications using hooks and context API for effective state management.',
                    'meta_keywords' => 'React, Hooks, JavaScript, Frontend',
                    'status' => 'published',
                    'featured' => true,
                    'published_at' => now()->subDays(5),
                    'category_id' => $reactCategory->id,
                    'tags' => [$reactTag->id, $jsTag->id],
                ],
                [
                    'title' => 'The Ultimate Guide to PostgreSQL Performance Tuning',
                    'excerpt' => 'Optimize your PostgreSQL database for maximum performance with these proven techniques and best practices.',
                    'content' => '<h2>Database Performance Matters</h2><p>A well-optimized database can make or break your application performance...</p><p>Let\'s dive into the essential PostgreSQL tuning techniques.</p><h3>Indexing Strategies</h3><p>Proper indexing is crucial for query performance...</p>',
                    'meta_description' => 'Complete guide to PostgreSQL performance tuning, indexing, and optimization techniques.',
                    'meta_keywords' => 'PostgreSQL, Database, Performance, Optimization',
                    'status' => 'published',
                    'featured' => false,
                    'published_at' => now()->subDays(3),
                    'category_id' => $webDevCategory->id,
                    'tags' => [],
                ],
            ];

            foreach ($posts as $postData) {
                $post = Post::create([
                    'user_id' => $user->id,
                    'category_id' => $postData['category_id'],
                    'title' => $postData['title'],
                    'excerpt' => $postData['excerpt'],
                    'content' => $postData['content'],
                    'meta_description' => $postData['meta_description'],
                    'meta_keywords' => $postData['meta_keywords'],
                    'status' => $postData['status'],
                    'featured' => $postData['featured'],
                    'published_at' => $postData['published_at'],
                ]);

                // Attach tags
                if (!empty($postData['tags'])) {
                    $post->tags()->attach($postData['tags']);
                }
            }
        }

        $this->command->info('✅ Blog seed data created successfully!');
        $this->command->info('📝 Categories: ' . Category::count());
        $this->command->info('🏷️ Tags: ' . Tag::count());
        $this->command->info('📄 Posts: ' . Post::count());
    }
}
