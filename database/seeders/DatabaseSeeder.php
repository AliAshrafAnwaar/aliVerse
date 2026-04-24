<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Admin user first so Ali gets user ID 1 (HomeController loads user 1)
        $this->call([
            AdminUserSeeder::class,
        ]);

        // Test user gets ID 2
        User::factory()->create([
            'name' => 'Test User',
            'email' => 'test@example.com',
        ]);

        $this->call([
            ProfileSeeder::class,
            CategoryHierarchySeeder::class,
            TagSeeder::class,
            BlogSeeder::class,
            UpdateProjectUserSeeder::class,
            SkillSeeder::class,
        ]);
    }
}
