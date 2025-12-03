<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StorePostRequest;
use App\Http\Requests\UpdatePostRequest;
use App\Http\Resources\PostCollection;
use App\Http\Resources\PostResource;
use App\Models\Post;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Storage;

class PostController extends Controller
{
    /**
     * Display a listing of published posts.
     */
    public function index(Request $request): PostCollection
    {
        $posts = Post::query()
            ->published()
            ->with(['user', 'category', 'tags'])
            ->search($request->search)
            ->when($request->category, fn($q, $cat) => $q->where('category_id', $cat))
            ->when($request->featured, fn($q) => $q->featured())
            ->latest('published_at')
            ->paginate($request->per_page ?? 12)
            ->withQueryString();

        return new PostCollection($posts);
    }

    /**
     * Display the specified post.
     */
    public function show(Post $post): PostResource|JsonResponse
    {
        $this->authorize('view', $post);

        if (!$post->isPublished() && !auth()->user()?->isAdmin()) {
            return response()->json(['message' => 'Post not found'], 404);
        }

        $post->incrementViews();
        $post->load(['user', 'category', 'tags', 'comments' => function ($query) {
            $query->where('is_approved', true)
                  ->whereNull('parent_id')
                  ->with('user', 'replies.user')
                  ->latest();
        }]);

        return new PostResource($post);
    }

    /**
     * Store a newly created post.
     */
    public function store(StorePostRequest $request): JsonResponse
    {
        $this->authorize('create', Post::class);

        $data = $request->validated();

        if ($request->hasFile('featured_image')) {
            $data['featured_image'] = $request->file('featured_image')->store('posts', 'public');
        }

        if ($data['status'] === 'published' && !isset($data['published_at'])) {
            $data['published_at'] = now();
        }

        $post = auth()->user()->posts()->create($data);

        if (isset($data['tags'])) {
            $post->tags()->sync($data['tags']);
        }

        if (empty($data['meta_description'])) {
            $post->generateMetaDescription();
        }

        return response()->json([
            'message' => 'Post created successfully!',
            'data' => new PostResource($post->load(['user', 'category', 'tags'])),
        ], 201);
    }

    /**
     * Update the specified post.
     */
    public function update(UpdatePostRequest $request, Post $post): JsonResponse
    {
        $this->authorize('update', $post);

        $data = $request->validated();

        if ($request->hasFile('featured_image')) {
            if ($post->featured_image) {
                Storage::disk('public')->delete($post->featured_image);
            }
            $data['featured_image'] = $request->file('featured_image')->store('posts', 'public');
        }

        if ($data['status'] === 'published' && !$post->published_at) {
            $data['published_at'] = now();
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

        return response()->json([
            'message' => 'Post updated successfully!',
            'data' => new PostResource($post->load(['user', 'category', 'tags'])),
        ]);
    }

    /**
     * Remove the specified post.
     */
    public function destroy(Post $post): JsonResponse
    {
        $this->authorize('delete', $post);

        if ($post->featured_image) {
            Storage::disk('public')->delete($post->featured_image);
        }

        $post->delete();

        return response()->json(['message' => 'Post deleted successfully!']);
    }

    /**
     * Toggle featured status of a post.
     */
    public function toggleFeatured(Post $post): JsonResponse
    {
        $this->authorize('toggleFeatured', $post);

        $post->update(['featured' => !$post->featured]);

        return response()->json([
            'message' => 'Post featured status updated!',
            'featured' => $post->featured,
        ]);
    }

    /**
     * Publish a post.
     */
    public function publish(Post $post): JsonResponse
    {
        $this->authorize('publish', $post);

        $post->update([
            'status' => 'published',
            'published_at' => now(),
        ]);

        return response()->json([
            'message' => 'Post published successfully!',
            'data' => new PostResource($post),
        ]);
    }

    /**
     * Unpublish a post.
     */
    public function unpublish(Post $post): JsonResponse
    {
        $this->authorize('publish', $post);

        $post->update([
            'status' => 'draft',
            'published_at' => null,
        ]);

        return response()->json([
            'message' => 'Post unpublished successfully!',
            'data' => new PostResource($post),
        ]);
    }
}
