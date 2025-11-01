<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('avatar')->nullable()->after('email');
            $table->text('bio')->nullable()->after('avatar');
            $table->string('location')->nullable()->after('bio');
            $table->string('website')->nullable()->after('location');
            $table->string('github_url')->nullable()->after('website');
            $table->string('linkedin_url')->nullable()->after('github_url');
            $table->string('twitter_url')->nullable()->after('linkedin_url');
            
            // Add indexes for frequently queried fields
            $table->index('role');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['avatar', 'bio', 'location', 'website', 'github_url', 'linkedin_url', 'twitter_url']);
            $table->dropIndex(['role']);
        });
    }
};
