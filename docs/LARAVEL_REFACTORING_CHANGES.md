# Laravel Best Practices Refactoring - aliVerse Portfolio

## Overview
This document covers all the changes made to follow Laravel best practices. The codebase was refactored for cleaner architecture, better security, and maintainability.

---

## 1. Policies for Authorization

### What Changed
Instead of inline authorization checks like `if (!auth()->user()->isAdmin())`, we now use **Laravel Policies**.

### Files Created
```
app/Policies/
├── PostPolicy.php
├── ProjectPolicy.php
├── UserPolicy.php
├── ContactSubmissionPolicy.php
└── CommentPolicy.php
```

### How to Use
```php
// Old way (avoid this)
if (!auth()->user()->isAdmin() && auth()->id() !== $post->user_id) {
    abort(403);
}

// New way (use this)
$this->authorize('update', $post);
```

### Available Policy Methods
| Model | Methods |
|-------|---------|
| **Post** | viewAny, view, create, update, delete, publish, toggleFeatured, restore, forceDelete |
| **Project** | viewAny, view, create, update, delete, restore, forceDelete |
| **User** | viewAny, view, create, update, delete, toggleAdmin, toggleBan, restore, forceDelete |
| **ContactSubmission** | viewAny, view, create, update, delete, markAsRead, bulkDelete, restore, forceDelete |
| **Comment** | viewAny, view, create, update, delete, approve, reject, restore, forceDelete |

---

## 2. Form Request Validation

### What Was Already There (Good Job!)
You were already using Form Requests for validation. These stay in place:

```
app/Http/Requests/
├── StorePostRequest.php
├── UpdatePostRequest.php
├── StoreProjectRequest.php
├── UpdateProjectRequest.php
├── StoreSkillRequest.php
├── UpdateSkillRequest.php
├── StoreExperienceRequest.php
├── UpdateExperienceRequest.php
├── StoreEducationRequest.php
├── UpdateEducationRequest.php
├── StoreTestimonialRequest.php
├── UpdateTestimonialRequest.php
├── StoreContactSubmissionRequest.php
└── UpdateUserRequest.php
```

### Best Practice Tip
Always use Form Requests for:
- Complex validation rules
- Authorization checks (use `authorize()` method)
- Custom error messages
- Preparing input data

---

## 3. API Resources

### What Changed
Created API Resources for consistent JSON responses.

### Files Created
```
app/Http/Resources/
├── PostResource.php
├── PostCollection.php
├── ProjectResource.php
├── ProjectCollection.php
├── UserResource.php
├── CategoryResource.php
├── TagResource.php
├── CommentResource.php
├── ProjectImageResource.php
├── ContactSubmissionResource.php
├── SkillResource.php
├── ExperienceResource.php
├── EducationResource.php
└── TestimonialResource.php
```

### How to Use
```php
// Single resource
return new PostResource($post);

// Collection with pagination
return new PostCollection($posts);

// Or using collection method
return PostResource::collection($posts);
```

### Benefits
- Consistent JSON structure
- Control what data is exposed
- Conditional fields based on user permissions
- Automatic relationship handling

---

## 4. Controller Separation (Web vs API)

### New Structure
```
app/Http/Controllers/
├── Api/                          # JSON responses for AJAX/fetch
│   ├── PostController.php
│   ├── ProjectController.php
│   ├── UserController.php
│   ├── ContactSubmissionController.php
│   ├── SkillController.php
│   ├── ExperienceController.php
│   ├── EducationController.php
│   └── TestimonialController.php
│
├── Web/                          # Inertia/redirect responses
│   ├── PostController.php
│   ├── ProjectController.php
│   ├── UserController.php
│   ├── ContactSubmissionController.php
│   ├── SkillController.php
│   ├── ExperienceController.php
│   ├── EducationController.php
│   └── TestimonialController.php
│
├── AdminController.php           # Admin dashboard
├── ContactController.php         # Contact page
├── HomeController.php            # Home page
├── ProfileController.php         # User profile
├── DashboardController.php       # User dashboard
├── PortfolioController.php       # Portfolio display
├── ReactionController.php        # Reactions
└── CommentController.php         # Comments
```

### When to Use Which

| Use **Web Controllers** | Use **API Controllers** |
|-------------------------|-------------------------|
| Page navigation | Data refresh without reload |
| Form submissions (redirect after) | AJAX form submissions |
| Inertia.js responses | React/Vue dynamic updates |
| Traditional web flow | SPA behavior |

---

## 5. Routes Structure

### web.php - For Page Navigation
Uses Web controllers for Inertia responses:
```php
use App\Http\Controllers\Web\PostController;

Route::get('/blog', [PostController::class, 'index']);
Route::get('/blog/{post:slug}', [PostController::class, 'show']);
```

### api.php - For Data Fetching
Uses API controllers for JSON responses:
```php
use App\Http\Controllers\Api\PostController;

Route::prefix('v1')->group(function () {
    Route::get('/posts', [PostController::class, 'index']);
    Route::get('/posts/{post}', [PostController::class, 'show']);
});
```

### API Versioning
All API routes are under `/api/v1/` for future versioning support.

---

## 6. Model Scopes

### Added Search Scopes
```php
// Post model
Post::search('laravel tips')->published()->get();

// User model
User::search('john')->admins()->get();

// Project model
Project::search('react app')->featured()->get();
```

### Existing Scopes
| Model | Scopes |
|-------|--------|
| Post | published, draft, featured, popular, latest, search |
| Project | published, featured, ordered, search |
| User | search, role, admins |
| Skill | ordered |
| Experience | ordered |
| Testimonial | active, ordered |
| ContactSubmission | read, unread, search |

---

## 7. Missing Laravel Practices to Consider

### What You Should Add

1. **Service Classes** - Move complex business logic out of controllers
   ```
   app/Services/
   ├── PostService.php
   ├── ProjectService.php
   └── FileUploadService.php
   ```

2. **Action Classes** - Single responsibility classes for specific actions
   ```
   app/Actions/
   ├── CreatePostAction.php
   ├── PublishPostAction.php
   └── DeleteProjectAction.php
   ```

3. **DTOs (Data Transfer Objects)** - Type-safe data containers
   ```php
   class CreatePostData
   {
       public function __construct(
           public string $title,
           public string $content,
           public ?int $categoryId = null,
       ) {}
   }
   ```

4. **Repository Pattern** (optional) - For complex queries
   ```php
   interface PostRepositoryInterface
   {
       public function getPublished(): Collection;
       public function findBySlug(string $slug): ?Post;
   }
   ```

5. **Events & Listeners**
   ```php
   // Events
   PostPublished::class
   ContactSubmissionReceived::class
   
   // Listeners
   SendNewPostNotification::class
   LogContactSubmission::class
   ```

6. **Observers** - Model lifecycle hooks
   ```php
   class PostObserver
   {
       public function creating(Post $post): void
       {
           $post->slug = Str::slug($post->title);
       }
   }
   ```

7. **Caching** - For frequently accessed data
   ```php
   $skills = Cache::remember('skills.all', 3600, function () {
       return Skill::ordered()->get();
   });
   ```

8. **Rate Limiting** - For API protection
   ```php
   RateLimiter::for('api', function (Request $request) {
       return Limit::perMinute(60)->by($request->user()?->id ?: $request->ip());
   });
   ```

9. **API Documentation** - Using tools like:
   - Laravel Scribe
   - Swagger/OpenAPI

10. **Testing**
    ```
    tests/
    ├── Feature/
    │   ├── PostControllerTest.php
    │   └── ProjectControllerTest.php
    └── Unit/
        ├── PostTest.php
        └── UserTest.php
    ```

---

## 8. Quick Reference

### Authorization in Controllers
```php
// Check ability
$this->authorize('update', $post);

// Check in blade/view
@can('update', $post)
    <button>Edit</button>
@endcan

// Check programmatically
if ($user->can('delete', $post)) { ... }
```

### Using Resources
```php
// In API controller
public function index()
{
    $posts = Post::published()->paginate(12);
    return new PostCollection($posts);
}

public function show(Post $post)
{
    return new PostResource($post->load('user', 'category'));
}
```

### Using Scopes
```php
// Chain multiple scopes
$posts = Post::published()
    ->featured()
    ->search($request->search)
    ->latest()
    ->paginate(12);
```

---

## 9. React Frontend Integration

The React frontend was updated to work with the new Laravel API structure.

### New API Layer Structure

```
resources/js/api/
├── axios.js              # Dual axios clients (apiClient + webClient)
├── endpoints.js          # API_ENDPOINTS and WEB_ENDPOINTS
├── index.js              # Central export
└── services/
    ├── posts.service.js
    ├── projects.service.js
    ├── users.service.js
    ├── skills.service.js
    ├── experiences.service.js
    ├── educations.service.js
    ├── testimonials.service.js
    ├── contact.service.js
    └── profile.service.js
```

### New Custom Hooks

```
resources/js/hooks/
├── index.js              # Central export
├── useApi.js             # Core hooks (useApi, usePaginatedApi, useMutation)
├── usePosts.js           # Post-specific hooks
├── useProjects.js        # Project-specific hooks
├── useSkills.js          # Skills-specific hooks
├── useContact.js         # Contact-specific hooks
└── use-toast.js          # Toast notifications
```

### Usage Examples

```jsx
// Using services directly
import API from '@/api';
const posts = await API.posts.getAll({ page: 1 });

// Using hooks (recommended for components)
import { usePosts, usePostActions } from '@/hooks';

function PostsList() {
    const { data, loading, nextPage, search } = usePosts();
    const { create, delete: deletePost } = usePostActions();
    // ...
}
```

### When to Use What

| Scenario | Use |
|----------|-----|
| Page navigation | Inertia + Web routes |
| Data refresh | API services + hooks |
| Form with redirect | Inertia `useForm` |
| AJAX form | `useMutation` hook |
| Search/filter | `usePaginatedApi` hook |

---

## File Changes Summary

| Category | Files Created | Files Modified |
|----------|---------------|----------------|
| Policies | 5 | 0 |
| Resources | 14 | 0 |
| API Controllers | 8 | 0 |
| Web Controllers | 8 | 0 |
| Routes | 0 | 2 |
| Models | 0 | 3 |
| Providers | 0 | 1 |
| **React API** | 9 | 2 |
| **React Hooks** | 5 | 0 |

---

*Last updated: November 2024*
