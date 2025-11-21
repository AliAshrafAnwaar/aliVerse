<?php

namespace App\Http\Controllers;

use App\Http\Requests\StorePostRequest;
use App\Http\Requests\UpdatePostRequest;
use App\Models\Post;
use App\Models\Category;
use App\Models\Tag;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Facades\Log;

class PostController extends Controller
{
    /**
     * Display a listing of the posts.
     */
    public function index(Request $request): Response
    {
        $posts = Post::query()
            ->with(['user', 'category', 'tags'])
            ->when($request->search, function ($query, $search) {
                $query->where('title', 'like', "%{$search}%")
                      ->orWhere('content', 'like', "%{$search}%");
            })
            ->when($request->category, function ($query, $categoryId) {
                $query->where('category_id', $categoryId);
            })
            ->when($request->status, function ($query, $status) {
                $query->where('status', $status);
            })
            ->when($request->featured, function ($query) {
                $query->where('featured', true);
            })
            ->latest()
            ->paginate(12)
            ->withQueryString();

        $categories = Category::orderBy('name')->get();
        $tags = Tag::orderBy('name')->get();

        return Inertia::render('Blog/Index', [
            'posts' => $posts,
            'categories' => $categories,
            'tags' => $tags,
            'filters' => $request->only('search', 'category', 'status', 'featured'),
        ]);
    }

    /**
     * Display a listing of posts for admin management.
     */
    public function adminIndex(Request $request): Response
    {
        $posts = Post::with(['user', 'category', 'tags'])
            ->when($request->search, function ($query, $search) {
                $query->where('title', 'like', "%{$search}%")
                      ->orWhere('content', 'like', "%{$search}%");
            })
            ->when($request->category, function ($query, $categoryId) {
                $query->where('category_id', $categoryId);
            })
            ->when($request->status, function ($query, $status) {
                $query->where('status', $status);
            })
            ->when($request->featured, function ($query, $featured) {
                $query->where('featured', $featured === 'true');
            })
            ->latest()
            ->paginate(12)
            ->withQueryString();

        $categories = Category::orderBy('name')->get();
        $tags = Tag::orderBy('name')->get();

        return Inertia::render('Admin/Blogs/Index', [
            'posts' => $posts,
            'categories' => $categories,
            'tags' => $tags,
            'filters' => $request->only('search', 'category', 'status', 'featured'),
        ]);
    }

    /**
     * Show the form for creating a new post.
     */
    public function create(): Response
    {
        // log
        Log::info('create post');
        $categories = Category::orderBy('name')->get();
        $tags = Tag::orderBy('name')->get();

        return Inertia::render('Admin/Blogs/Create', [
            'categories' => $categories,
            'tags' => $tags,
        ]);
    }

    /**
     * Store a newly created post in storage.
     */
    public function store(StorePostRequest $request)
    {
        // log
        Log::info("User #{$request->user()->id} creating post with data: " . json_encode($request->validated()));

        $data = $request->validated();
        
        // Handle featured image upload
        if ($request->hasFile('featured_image')) {
            $image = $request->file('featured_image');
            $path = $image->store('posts', 'public');
            $data['featured_image'] = $path;
        }

        // Set published_at if status is published and not already set
        if ($data['status'] === 'published' && !isset($data['published_at'])) {
            $data['published_at'] = now();
        }

        $post = auth()->user()->posts()->create($data);

        // Sync tags
        if (isset($data['tags'])) {
            $post->tags()->sync($data['tags']);
        }

        // Generate meta description if not provided
        if (empty($data['meta_description'])) {
            $post->generateMetaDescription();
        }

        return redirect()->route('posts.index')
            ->with('success', 'Post created successfully!');
    }

    /**
     * Display the specified post.
     */
    public function show(Post $post): Response
    {
        // Increment view count
        $post->incrementViews();

        $post->load(['user', 'category', 'tags', 'reactions.user']);

        // Load comments only if the table exists
        if (Schema::hasTable('comments')) {
            $post->load(['comments' => function ($query) {
                $query->where('is_approved', true)
                      ->whereNull('parent_id')
                      ->with('user', 'replies.user')
                      ->latest();
            }]);
        }

        // Get user's reaction if authenticated
        $userReaction = null;
        if (auth()->check()) {
            $userReaction = $post->reactions()
                ->where('user_id', auth()->id())
                ->first();
        }

        // Get reaction counts
        $reactionCounts = $post->getReactionCounts();

        $relatedPosts = Post::query()
            ->where('id', '!=', $post->id)
            ->where('status', 'published')
            ->when($post->category_id, function ($query) use ($post) {
                $query->where('category_id', $post->category_id);
            })
            ->inRandomOrder()
            ->take(3)
            ->get();

        return Inertia::render('Blog/Show', [
            'post' => $post,
            'relatedPosts' => $relatedPosts,
            'userReaction' => $userReaction,
            'reactionCounts' => $reactionCounts,
        ]);
    }

    /**
     * Show the form for editing the specified post.
     */
    public function edit(Post $post): Response
    {
        $post->load('tags');
        
        $categories = Category::orderBy('name')->get();
        $tags = Tag::orderBy('name')->get();

        return Inertia::render('Admin/Blogs/Edit', [
            'post' => $post,
            'categories' => $categories,
            'tags' => $tags,
        ]);
    }

    /**
     * Update the specified post in storage.
     */
    public function update(UpdatePostRequest $request, Post $post)
    {
        // Allow admins to update any post, or users to update their own posts
        if (!auth()->user()->isAdmin() && auth()->id() !== $post->user_id) {
            abort(403, 'Unauthorized action.');
        }
        
        $data = $request->validated();

        // Handle featured image upload
        if ($request->hasFile('featured_image')) {
            // Delete old image
            if ($post->featured_image) {
                Storage::disk('public')->delete($post->featured_image);
            }
            
            $image = $request->file('featured_image');
            $path = $image->store('posts', 'public');
            $data['featured_image'] = $path;
        }

        // Set published_at if status is published and not already set
        if ($data['status'] === 'published' && !$post->published_at) {
            $data['published_at'] = now();
        }

        $post->update($data);

        // Sync tags
        if (isset($data['tags'])) {
            $post->tags()->sync($data['tags']);
        } else {
            $post->tags()->detach();
        }

        // Generate meta description if not provided
        if (empty($data['meta_description'])) {
            $post->generateMetaDescription();
        }

        return redirect()->route('posts.index')
            ->with('success', 'Post updated successfully!');
    }

    /**
     * Remove the specified post from storage.
     */
    public function destroy(Post $post)
    {
        // Allow admins to delete any post, or users to delete their own posts
        if (!auth()->user()->isAdmin() && auth()->id() !== $post->user_id) {
            abort(403, 'Unauthorized action.');
        }
        
        // Delete featured image
        if ($post->featured_image) {
            Storage::disk('public')->delete($post->featured_image);
        }

        $post->delete();

        return redirect()->route('posts.index')
            ->with('success', 'Post deleted successfully!');
    }

    /**
     * Toggle featured status of a post.
     */
    public function toggleFeatured(Post $post)
    {
        // Only admins can toggle featured status
        if (!auth()->user()->isAdmin()) {
            abort(403, 'Unauthorized action.');
        }
        
        $post->update(['featured' => !$post->featured]);

        return back()->with('success', 'Post featured status updated!');
    }

    /**
     * Publish a post.
     */
    public function publish(Post $post)
    {
        // Allow admins to publish any post, or users to publish their own posts
        if (!auth()->user()->isAdmin() && auth()->id() !== $post->user_id) {
            abort(403, 'Unauthorized action.');
        }
        
        $post->update([
            'status' => 'published',
            'published_at' => now(),
        ]);

        return back()->with('success', 'Post published successfully!');
    }

    /**
     * Unpublish a post.
     */
    public function unpublish(Post $post)
    {
        // Allow admins to unpublish any post, or users to unpublish their own posts
        if (!auth()->user()->isAdmin() && auth()->id() !== $post->user_id) {
            abort(403, 'Unauthorized action.');
        }
        
        $post->update([
            'status' => 'draft',
            'published_at' => null,
        ]);

        return back()->with('success', 'Post unpublished successfully!');
    }

    /**
     * Get posts for API endpoints.
     */
    public function apiIndex(Request $request)
    {
        $posts = Post::query()
            ->with(['user', 'category', 'tags'])
            ->published()
            ->when($request->search, function ($query, $search) {
                $query->where('title', 'like', "%{$search}%")
                      ->orWhere('content', 'like', "%{$search}%");
            })
            ->when($request->category, function ($query, $categoryId) {
                $query->where('category_id', $categoryId);
            })
            ->when($request->featured, function ($query) {
                $query->where('featured', true);
            })
            ->latest('published_at')
            ->paginate(12)
            ->withQueryString();

        return response()->json($posts);
    }

    /**
     * Get single post for API.
     */
    public function apiShow(Post $post)
    {
        if (!$post->isPublished()) {
            return response()->json(['error' => 'Post not found'], 404);
        }

        $post->incrementViews();
        $post->load(['user', 'category', 'tags']);

        return response()->json($post);
    }
}
