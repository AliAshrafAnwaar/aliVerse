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
        // Helper function to check if index exists
        $indexExists = function ($table, $indexName) {
            $connection = Schema::getConnection();
            $schemaName = $connection->getConfig('schema') ?: 'public';
            return $connection->select(
                "SELECT 1 FROM pg_indexes WHERE schemaname = ? AND indexname = ?",
                [$schemaName, $indexName]
            ) ? true : false;
        };

        // Add indexes to posts table (check for existing indexes)
        Schema::table('posts', function (Blueprint $table) use ($indexExists) {
            if (!$indexExists('posts', 'posts_status_index')) {
                $table->index('status');
            }
            if (!$indexExists('posts', 'posts_featured_index')) {
                $table->index('featured');
            }
            if (!$indexExists('posts', 'posts_published_at_index')) {
                $table->index('published_at');
            }
            if (!$indexExists('posts', 'posts_status_published_at_index')) {
                $table->index(['status', 'published_at']);
            }
            if (!$indexExists('posts', 'posts_user_id_index')) {
                $table->index('user_id');
            }
            if (!$indexExists('posts', 'posts_category_id_index')) {
                $table->index('category_id');
            }
        });

        // Add indexes to projects table
        Schema::table('projects', function (Blueprint $table) use ($indexExists) {
            if (!$indexExists('projects', 'projects_status_index')) {
                $table->index('status');
            }
            if (!$indexExists('projects', 'projects_featured_index')) {
                $table->index('featured');
            }
        });

        // Add indexes to comments table (if table exists)
        if (Schema::hasTable('comments')) {
            Schema::table('comments', function (Blueprint $table) use ($indexExists) {
                if (!$indexExists('comments', 'comments_commentable_type_commentable_id_index')) {
                    $table->index(['commentable_type', 'commentable_id']);
                }
                if (!$indexExists('comments', 'comments_user_id_index')) {
                    $table->index('user_id');
                }
                if (!$indexExists('comments', 'comments_created_at_index')) {
                    $table->index('created_at');
                }
            });
        }

        // Add indexes to reactions table (if table exists)
        if (Schema::hasTable('reactions')) {
            Schema::table('reactions', function (Blueprint $table) use ($indexExists) {
                if (!$indexExists('reactions', 'reactions_reactable_type_reactable_id_index')) {
                    $table->index(['reactable_type', 'reactable_id']);
                }
                if (!$indexExists('reactions', 'reactions_user_id_index')) {
                    $table->index('user_id');
                }
            });
        }

        // Add index for email verification lookups
        Schema::table('users', function (Blueprint $table) use ($indexExists) {
            if (!$indexExists('users', 'users_email_verified_at_index')) {
                $table->index('email_verified_at');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Helper function to check if index exists
        $indexExists = function ($table, $indexName) {
            $connection = Schema::getConnection();
            $schemaName = $connection->getConfig('schema') ?: 'public';
            return $connection->select(
                "SELECT 1 FROM pg_indexes WHERE schemaname = ? AND indexname = ?",
                [$schemaName, $indexName]
            ) ? true : false;
        };

        Schema::table('posts', function (Blueprint $table) use ($indexExists) {
            if ($indexExists('posts', 'posts_status_index')) {
                $table->dropIndex(['status']);
            }
            if ($indexExists('posts', 'posts_featured_index')) {
                $table->dropIndex(['featured']);
            }
            if ($indexExists('posts', 'posts_published_at_index')) {
                $table->dropIndex(['published_at']);
            }
            if ($indexExists('posts', 'posts_status_published_at_index')) {
                $table->dropIndex(['status', 'published_at']);
            }
            if ($indexExists('posts', 'posts_user_id_index')) {
                $table->dropIndex(['user_id']);
            }
            if ($indexExists('posts', 'posts_category_id_index')) {
                $table->dropIndex(['category_id']);
            }
        });

        Schema::table('projects', function (Blueprint $table) use ($indexExists) {
            if ($indexExists('projects', 'projects_status_index')) {
                $table->dropIndex(['status']);
            }
            if ($indexExists('projects', 'projects_featured_index')) {
                $table->dropIndex(['featured']);
            }
        });

        if (Schema::hasTable('comments')) {
            Schema::table('comments', function (Blueprint $table) use ($indexExists) {
                if ($indexExists('comments', 'comments_commentable_type_commentable_id_index')) {
                    $table->dropIndex(['commentable_type', 'commentable_id']);
                }
                if ($indexExists('comments', 'comments_user_id_index')) {
                    $table->dropIndex(['user_id']);
                }
                if ($indexExists('comments', 'comments_created_at_index')) {
                    $table->dropIndex(['created_at']);
                }
            });
        }

        if (Schema::hasTable('reactions')) {
            Schema::table('reactions', function (Blueprint $table) use ($indexExists) {
                if ($indexExists('reactions', 'reactions_reactable_type_reactable_id_index')) {
                    $table->dropIndex(['reactable_type', 'reactable_id']);
                }
                if ($indexExists('reactions', 'reactions_user_id_index')) {
                    $table->dropIndex(['user_id']);
                }
            });
        }

        Schema::table('users', function (Blueprint $table) use ($indexExists) {
            if ($indexExists('users', 'users_email_verified_at_index')) {
                $table->dropIndex(['email_verified_at']);
            }
        });
    }
};
