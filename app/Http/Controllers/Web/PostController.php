<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Http\Requests\StorePostRequest;
use App\Http\Requests\UpdatePostRequest;
use App\Models\Post;
use App\Models\Category;
use App\Models\Tag;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class PostController extends Controller
{
    /**
     * Display a listing of published posts (public).
     */
    public function index(Request $request): Response
    {
        $posts = Post::query()
            ->published()
            ->with(['user', 'category.parent', 'tags'])
            ->search($request->search)
            // Filter by main category (get all subcategory IDs)
            ->when($request->main_category, function($q, $mainCatId) use ($request) {
                if (!$request->category) {
                    // Get all subcategory IDs for this main category
                    $subCategoryIds = Category::where('parent_id', $mainCatId)->pluck('id');
                    $q->whereIn('category_id', $subCategoryIds);
                }
            })
            // Filter by specific subcategory
            ->when($request->category, fn($q, $cat) => $q->where('category_id', $cat))
            // Filter by featured
            ->when($request->has('featured') && $request->featured !== '', function($q) use ($request) {
                $q->where('featured', filter_var($request->featured, FILTER_VALIDATE_BOOLEAN));
            })
            // Filter by tags
            ->when($request->tags, function($q, $tagIds) {
                $tagArray = explode(',', $tagIds);
                $q->whereHas('tags', function($subQ) use ($tagArray) {
                    $subQ->whereIn('tags.id', $tagArray);
                });
            })
            // Sorting
            ->when($request->sort, function($q, $sort) {
                switch ($sort) {
                    case 'oldest':
                        $q->oldest('published_at');
                        break;
                    case 'popular':
                        $q->orderBy('views_count', 'desc');
                        break;
                    case 'title_asc':
                        $q->orderBy('title', 'asc');
                        break;
                    case 'title_desc':
                        $q->orderBy('title', 'desc');
                        break;
                    default:
                        $q->latest('published_at');
                }
            }, fn($q) => $q->latest('published_at'))
            ->paginate(12)
            ->withQueryString();

        // Get categories with parent relationship for hierarchy
        $categories = Category::with('parent')
            ->active()
            ->orderBy('sort_order')
            ->orderBy('name')
            ->get();

        return Inertia::render('Blog/Index', [
            'posts' => $posts,
            'categories' => $categories,
            'tags' => Tag::active()->orderBy('name')->get(),
            'filters' => $request->only('search', 'category', 'main_category', 'featured', 'tags', 'sort'),
        ]);
    }

    /**
     * Display the specified post (public).
     */
    public function show(Post $post): Response
    {
        $this->authorize('view', $post);

        $post->incrementViews();
        $post->load(['user', 'category', 'tags', 'reactions.user']);

        if (Schema::hasTable('comments')) {
            $post->load(['comments' => function ($query) {
                $query->where('is_approved', true)
                      ->whereNull('parent_id')
                      ->with('user', 'replies.user')
                      ->latest();
            }]);
        }

        $userReaction = null;
        if (auth()->check()) {
            $userReaction = $post->reactions()->where('user_id', auth()->id())->first();
        }

        $relatedPosts = Post::query()
            ->where('id', '!=', $post->id)
            ->published()
            ->when($post->category_id, fn($q) => $q->where('category_id', $post->category_id))
            ->inRandomOrder()
            ->take(3)
            ->get();

        return Inertia::render('Blog/Show', [
            'post' => $post,
            'relatedPosts' => $relatedPosts,
            'userReaction' => $userReaction,
            'reactionCounts' => $post->getReactionCounts(),
        ]);
    }

    /**
     * Display admin listing of posts.
     */
    public function adminIndex(Request $request): Response
    {
        $posts = Post::with(['user', 'category', 'tags'])
            ->search($request->search)
            ->when($request->category, fn($q, $cat) => $q->where('category_id', $cat))
            ->when($request->status, fn($q, $status) => $q->where('status', $status))
            ->when($request->featured, fn($q, $featured) => $q->where('featured', $featured === 'true'))
            ->latest()
            ->paginate(12)
            ->withQueryString();

        return Inertia::render('Admin/Blogs/Index', [
            'posts' => $posts,
            'categories' => Category::orderBy('name')->get(),
            'tags' => Tag::orderBy('name')->get(),
            'filters' => $request->only('search', 'category', 'status', 'featured'),
        ]);
    }

    /**
     * Show the form for creating a new post.
     */
    public function create(): Response
    {
        $this->authorize('create', Post::class);

        return Inertia::render('Admin/Blogs/Create', [
            'categories' => Category::orderBy('name')->get(),
            'tags' => Tag::orderBy('name')->get(),
        ]);
    }

    /**
     * Store a newly created post.
     */
    public function store(StorePostRequest $request): RedirectResponse
    {
        $this->authorize('create', Post::class);

        $data = $request->validated();

        if ($request->hasFile('featured_image')) {
            $data['featured_image'] = $request->file('featured_image')->store('posts', 'public');
        }

        // Auto-set published_at if publishing without a date
        if ($data['status'] === 'published' && empty($data['published_at'])) {
            $data['published_at'] = now();
        }
        
        // If still draft or other status, ensure published_at is null
        if ($data['status'] !== 'published' && $data['status'] !== 'scheduled') {
            $data['published_at'] = null;
        }

        $post = auth()->user()->posts()->create($data);

        if (isset($data['tags'])) {
            $post->tags()->sync($data['tags']);
        }

        if (empty($data['meta_description'])) {
            $post->generateMetaDescription();
        }

        return redirect()->route('posts.index')
            ->with('success', 'Post created successfully!');
    }

    /**
     * Show the form for editing the specified post.
     */
    public function edit(Post $post): Response
    {
        $this->authorize('update', $post);

        $post->load('tags');

        return Inertia::render('Admin/Blogs/Edit', [
            'post' => $post,
            'categories' => Category::orderBy('name')->get(),
            'tags' => Tag::orderBy('name')->get(),
        ]);
    }

    /**
     * Update the specified post.
     */
    public function update(UpdatePostRequest $request, Post $post): RedirectResponse
    {
        $this->authorize('update', $post);

        $data = $request->validated();

        if ($request->hasFile('featured_image')) {
            if ($post->featured_image) {
                Storage::disk('public')->delete($post->featured_image);
            }
            $data['featured_image'] = $request->file('featured_image')->store('posts', 'public');
        }

        // Auto-set published_at if publishing without a date
        if ($data['status'] === 'published' && empty($data['published_at'])) {
            $data['published_at'] = now();
        }
        
        // If changing to draft or other non-published status, clear published_at
        if ($data['status'] !== 'published' && $data['status'] !== 'scheduled') {
            $data['published_at'] = null;
        }

        $post->update($data);

        if (isset($data['tags'])) {
            $post->tags()->sync($data['tags']);
        } else {
            $post->tags()->detach();
        }

        if (empty($data['meta_description'])) {
            $post->generateMetaDescription();
        }

        return redirect()->route('posts.index')
            ->with('success', 'Post updated successfully!');
    }

    /**
     * Remove the specified post.
     */
    public function destroy(Post $post): RedirectResponse
    {
        $this->authorize('delete', $post);

        if ($post->featured_image) {
            Storage::disk('public')->delete($post->featured_image);
        }

        $post->delete();

        return redirect()->route('posts.index')
            ->with('success', 'Post deleted successfully!');
    }

    /**
     * Toggle featured status.
     */
    public function toggleFeatured(Post $post): RedirectResponse
    {
        $this->authorize('toggleFeatured', $post);

        $post->update(['featured' => !$post->featured]);

        return back()->with('success', 'Post featured status updated!');
    }

    /**
     * Publish a post.
     */
    public function publish(Post $post): RedirectResponse
    {
        $this->authorize('publish', $post);

        $post->update([
            'status' => 'published',
            'published_at' => now(),
        ]);

        return back()->with('success', 'Post published successfully!');
    }

    /**
     * Unpublish a post.
     */
    public function unpublish(Post $post): RedirectResponse
    {
        $this->authorize('publish', $post);

        $post->update([
            'status' => 'draft',
            'published_at' => null,
        ]);

        return back()->with('success', 'Post unpublished successfully!');
    }
}
