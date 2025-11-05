<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Project;
use App\Models\User;

class UpdateProjectUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get the first admin user
        $adminUser = User::where('role', 'admin')->first();
        
        if ($adminUser) {
            // Update all projects without a user_id to belong to the admin user
            Project::whereNull('user_id')->update(['user_id' => $adminUser->id]);
            
            $this->command->info('Updated existing projects to belong to admin user (ID: ' . $adminUser->id . ')');
        } else {
            $this->command->error('No admin user found. Please create an admin user first.');
        }
    }
}
