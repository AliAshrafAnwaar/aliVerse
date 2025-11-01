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
        // Create categories table first
        Schema::create('categories', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            $table->text('description')->nullable();
            $table->string('color', 7)->nullable(); // Hex color code
            $table->string('icon')->nullable();
            $table->boolean('is_active')->default(true);
            $table->integer('sort_order')->default(0);
            $table->timestamps();
            $table->softDeletes();
            
            // Indexes
            $table->index('is_active');
            $table->index('sort_order');
        });

        // Create tags table second
        Schema::create('tags', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            $table->text('description')->nullable();
            $table->string('color', 7)->nullable(); // Hex color code
            $table->boolean('is_active')->default(true);
            $table->timestamps();
            $table->softDeletes();
            
            // Indexes
            $table->index('is_active');
        });

        // Create posts table third
        Schema::create('posts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('category_id')->nullable()->constrained()->onDelete('set null');
            $table->string('title');
            $table->string('slug')->unique();
            $table->text('excerpt')->nullable();
            $table->longText('content');
            $table->string('featured_image')->nullable();
            $table->string('meta_description', 160)->nullable();
            $table->string('meta_keywords')->nullable();
            $table->enum('status', ['draft', 'published', 'scheduled', 'archived'])->default('draft');
            $table->boolean('featured')->default(false);
            $table->timestamp('published_at')->nullable();
            $table->integer('views_count')->default(0);
            $table->integer('reading_time')->default(0);
            $table->timestamps();
            $table->softDeletes();
            
            // Indexes for performance
            $table->index(['status', 'published_at']);
            $table->index(['user_id', 'status']);
            $table->index('featured');
            $table->index('views_count');
        });

        // Create post_tag pivot table last
        Schema::create('post_tag', function (Blueprint $table) {
            $table->foreignId('post_id')->constrained()->onDelete('cascade');
            $table->foreignId('tag_id')->constrained()->onDelete('cascade');
            $table->timestamps();
            
            // Unique constraint to prevent duplicate relationships
            $table->unique(['post_id', 'tag_id']);
            
            // Indexes for performance
            $table->index('post_id');
            $table->index('tag_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Drop in reverse order of creation
        Schema::dropIfExists('post_tag');
        Schema::dropIfExists('posts');
        Schema::dropIfExists('tags');
        Schema::dropIfExists('categories');
    }
};
