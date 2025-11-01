<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;

class AdminUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create or update the admin user
        User::updateOrCreate(
            ['email' => 'aliashrafanwaar@gmail.com'],
            [
                'name' => 'Ali Ashraf',
                'email' => 'aliashrafanwaar@gmail.com',
                'password' => '$2y$12$tkJPZgYlTpjkEyM3NrNrqO0qIn2KJhto9VcsClllAc7YKLZsQqkVO', // Your existing password hash
                'email_verified_at' => now(),
                'role' => 'admin',
            ]
        );

        $this->command->info('Admin user created successfully!');
    }
}
