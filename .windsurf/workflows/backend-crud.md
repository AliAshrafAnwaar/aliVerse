---
description: Scaffold the Laravel backend (migration, model, form requests, resource, service, controller, routes, policy, factory, seeder, tests) for a new resource in aliVerse.
auto_execution_mode: 3
---

# Workflow: /backend-crud

Builds the Laravel 12 side of a feature. Frontend pages are handled by `/inertia-pages`.
Always obey `@.windsurf/rules/stack-rule.md` — especially the directory map and the rule that **API Resources exist only for `Api/*` controllers**; Inertia controllers return plain Eloquent models / paginators inside `Inertia::render(...)`.

## Inputs
- `Model` — singular PascalCase (e.g. `Skill`).
- `namespace` — `Web`, `Admin`, or `Api`.
- `fields` — list of `{ name, type, nullable, default, index }`.
- `ownedBy` — optional FK owner (`user`, `organization`).
- `softDeletes` — boolean.
- `uploads` — list of file-bearing fields (mime, max KB).
- `businessLogic` — short description; if non-trivial, emit a Service class (step 6).

## What gets generated (decision matrix)

| Artefact | `Web` | `Admin` | `Api` | Notes |
| --- | --- | --- | --- | --- |
| Migration | ✓ | ✓ | ✓ | Always. |
| Model | ✓ | ✓ | ✓ | Always. |
| FormRequest (`Store` + `Update`) | ✓ | ✓ | ✓ | Always. One pair reused across namespaces unless rules diverge. |
| API Resource + Collection | — | — | ✓ | **Only** for `Api/*`. Never used inside `Inertia::render`. |
| Service class | optional | optional | optional | Emit when business logic ≥ ~15 lines, touches ≥ 2 models, or wraps a DB transaction. |
| Inertia controller | ✓ | ✓ | — | Returns `Inertia::render('<Ns>/<Plural>/Index', [...])`. |
| API controller | — | — | ✓ | Returns `*Resource` / `*Collection` / `JsonResponse`. |
| Routes | `routes/web.php` | `routes/web.php` (admin group) | `routes/api.php` (+ `throttle`) | Always. |
| Policy | ownership-only | ownership-only | ownership-only | When records are user-owned or role-gated. |
| Observer | optional | optional | optional | Slugs, cache busting, audit log, broadcast events. |
| Factory + Seeder | ✓ | ✓ | ✓ | Needed for `php artisan test` and local `db:seed`. |
| Feature test | ✓ | ✓ | ✓ | At least happy-path CRUD per namespace that ships. |

## Steps

### 1. Migration
```bash
php artisan make:migration create_<table>_table
```
- Add all fields with correct types, nullability, defaults.
- Add FKs: `$table->foreignId('user_id')->constrained()->cascadeOnDelete();` when `ownedBy = user`.
- Add indexes for frequently-queried columns and every FK.
- Include `$table->timestamps();` and `$table->softDeletes();` if soft delete is in scope.
- `snake_case` everywhere.
```bash
php artisan migrate
```

### 2. Model
```bash
php artisan make:model <Model>
```
- `$fillable` = all user-assignable fields.
- `$casts` for dates, booleans, JSON, enums.
- Relationships: `belongsTo`, `hasMany`, `belongsToMany` as needed.
- `use SoftDeletes;` if the migration added `deleted_at`.
- Scope methods for common filters (e.g. `scopeOwnedBy`, `scopePublished`).
- `$appends` only for cheap computed attributes.

### 3. Form Requests
```bash
php artisan make:request Store<Model>Request
php artisan make:request Update<Model>Request
```
- Implement `authorize()` — return `true` only after checking policy or ownership (e.g. `return $this->user()?->can('create', <Model>::class);`).
- `rules()` returns validation per field. Use `Rule::unique(...)->ignore($this-><model>?->id)` on `Update`.
- `messages()` for custom messages — prefer translation keys (`__('validation.custom.<field>.<rule>')`).
- `prepareForValidation()` to normalise input (trim, lowercase emails, merge `slug`, cast booleans).
- File uploads: validate `mimes`, `max` (KB), and `dimensions` for images.
- Expose a reusable `attributes()` method for nicer field names in error messages.

### 4. API Resource + Collection (`Api/*` only)
Skip this step for `Web`/`Admin` namespaces — Inertia serialises models via `Inertia::render` and doesn't need a transformation layer.

```bash
php artisan make:resource <Model>Resource
php artisan make:resource <Model>Collection --collection
```

- `*Resource` lives at `@app/Http/Resources/<Model>Resource.php` and extends `JsonResource`.
- Always use `$this->whenLoaded('relation')` for relationships so the controller owns eager-loading and we avoid N+1.
- Use `$this->whenCounted('relation')` for counts loaded via `withCount`.
- Use `$this->when($condition, $value)` to hide fields (e.g. only expose `content` on `show` routes).
- Cast timestamps explicitly: `$this->created_at?->toISOString()`.
- Resolve storage paths to absolute URLs: `asset('storage/' . $this->image_path)`.
- Never leak sensitive fields (`password`, tokens, internal flags).

Example resource (mirrors `@app/Http/Resources/PostResource.php`):
```php
<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class SkillResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'          => $this->id,
            'name'        => $this->name,
            'slug'        => $this->slug,
            'category'    => $this->category,
            'level'       => $this->level,
            'is_featured' => (bool) $this->is_featured,
            'image'       => $this->image_path ? asset('storage/' . $this->image_path) : null,
            'user'        => new UserResource($this->whenLoaded('user')),
            'projects_count' => $this->whenCounted('projects'),
            'created_at'  => $this->created_at?->toISOString(),
            'updated_at'  => $this->updated_at?->toISOString(),
        ];
    }
}
```

Example collection (mirrors `@app/Http/Resources/PostCollection.php`):
```php
<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\ResourceCollection;

class SkillCollection extends ResourceCollection
{
    public $collects = SkillResource::class;

    public function toArray(Request $request): array
    {
        return [
            'data' => $this->collection,
            'meta' => [
                'current_page' => $this->currentPage(),
                'last_page'    => $this->lastPage(),
                'per_page'     => $this->perPage(),
                'total'        => $this->total(),
            ],
        ];
    }
}
```

Return from the controller:
```php
public function index(Request $request): SkillCollection
{
    return new SkillCollection(
        Skill::with('user')->withCount('projects')->paginate(15)->withQueryString()
    );
}
```

> Reference: [Laravel 12 – Eloquent: API Resources](https://laravel.com/docs/12.x/eloquent-resources). Prefer `whenLoaded` / `whenCounted` over manual conditionals.

### 5. Service class (optional, for non-trivial business logic)
Emit a service when the controller action would otherwise be longer than ~15 lines, wraps a `DB::transaction(...)`, touches multiple models, calls an external API, dispatches events/jobs, or needs to be reused by another controller, console command, or queue job. Otherwise skip — thin controllers + Eloquent scopes are fine.

- Location: `app/Services/<Model>Service.php` (create the folder on first use; it is **not** in the default Laravel skeleton).
- Namespace: `App\Services`.
- Generate with Laravel 12's `make:class` command:
  ```bash
  php artisan make:class Services/<Model>Service
  ```
  (Falls back to manual file creation on older installs — no make:service exists.)
- Accept primitive arrays / the `Model` itself. Do **not** accept `Request` or `FormRequest` instances — validation is the controller's job; services must stay framework-agnostic enough to be callable from jobs and commands.
- Inject collaborators via the constructor. Laravel's container auto-resolves them.
- Wrap multi-step writes in `DB::transaction(fn () => ...)`; return the created/updated model.
- Keep one service per aggregate root; if a method grows past ~40 lines, extract a dedicated Action class (`App\Actions\<Verb><Noun>`).
- No interface unless you actually have multiple implementations — YAGNI.

Example:
```php
<?php

namespace App\Services;

use App\Models\Skill;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class SkillService
{
    public function create(array $data, ?UploadedFile $image = null): Skill
    {
        return DB::transaction(function () use ($data, $image) {
            $data['slug'] ??= Str::slug($data['name']);

            if ($image) {
                $data['image_path'] = $image->store('skills', 'public');
            }

            $skill = Skill::create($data);
            $skill->tags()->sync($data['tags'] ?? []);

            return $skill;
        });
    }

    public function update(Skill $skill, array $data, ?UploadedFile $image = null): Skill
    {
        return DB::transaction(function () use ($skill, $data, $image) {
            if ($image) {
                if ($skill->image_path && Storage::disk('public')->exists($skill->image_path)) {
                    Storage::disk('public')->delete($skill->image_path);
                }
                $data['image_path'] = $image->store('skills', 'public');
            }

            $skill->update($data);

            if (array_key_exists('tags', $data)) {
                $skill->tags()->sync($data['tags']);
            }

            return $skill->fresh();
        });
    }

    public function delete(Skill $skill): void
    {
        DB::transaction(function () use ($skill) {
            if ($skill->image_path && Storage::disk('public')->exists($skill->image_path)) {
                Storage::disk('public')->delete($skill->image_path);
            }
            $skill->delete();
        });
    }
}
```

Inject into the controller — no manual binding needed for concrete classes:
```php
public function __construct(private readonly SkillService $skills) {}

public function store(StoreSkillRequest $request)
{
    $skill = $this->skills->create($request->validated(), $request->file('image'));

    return redirect()
        ->route('admin.skills.index')
        ->with('success', __('skills.flash.created'));
}
```

> Reference: [Laravel 12 – Service Container](https://laravel.com/docs/12.x/container). Only add an interface + `AppServiceProvider` binding when you need to swap implementations (e.g. fake in tests, multi-driver).

### 6. Controller
Pick the right namespace:
- Public site → `app/Http/Controllers/Web/<Model>Controller.php`
- Admin panel → `app/Http/Controllers/Admin/<Model>Controller.php`
- External API → `app/Http/Controllers/Api/<Model>Controller.php` (uses the Resource from §4)

```bash
# Inertia (Web / Admin)
php artisan make:controller <Namespace>/<Model>Controller --resource --model=<Model>

# API
php artisan make:controller Api/<Model>Controller --api --model=<Model>
```

Shared rules for every controller:
- Constructor-inject the Service (if any) and call `$this->authorize(...)` at the top of every protected action.
- `index()` — eager-load relations used by the view, support `?search`, `?filter[...]`, paginate with `->paginate(15)->withQueryString()`.
- `store()` / `update()` — receive the matching FormRequest; delegate to the Service or write inline only if trivial.
- `destroy()` — idempotent; return a redirect (Inertia) or 204 (Api).
- Filter list queries by `auth()->id()` for user-owned resources.
- Never `dd()` / `Log::info($request->all())` — PII leakage.

Inertia (Web/Admin) example:
```php
public function index(Request $request): Response
{
    $skills = Skill::query()
        ->when($request->search, fn ($q, $s) => $q->where('name', 'like', "%{$s}%"))
        ->when($request->category, fn ($q, $c) => $q->where('category', $c))
        ->latest()
        ->paginate(15)
        ->withQueryString();

    return Inertia::render('Admin/Skills/Index', [
        'skills'  => $skills,
        'filters' => $request->only('search', 'category'),
    ]);
}

public function store(StoreSkillRequest $request): RedirectResponse
{
    $this->skills->create($request->validated(), $request->file('image'));

    return redirect()
        ->route('admin.skills.index')
        ->with('success', __('skills.flash.created'));
}
```

Api example (mirrors `@app/Http/Controllers/Api/SkillController.php`):
```php
public function index(Request $request): SkillCollection
{
    $skills = Skill::query()
        ->with('user')
        ->withCount('projects')
        ->when($request->search, fn ($q, $s) => $q->where('name', 'like', "%{$s}%"))
        ->ordered()
        ->paginate($request->integer('per_page', 15))
        ->withQueryString();

    return new SkillCollection($skills);
}

public function store(StoreSkillRequest $request): JsonResponse
{
    $skill = $this->skills->create($request->validated(), $request->file('image'));

    return (new SkillResource($skill))
        ->response()
        ->setStatusCode(201);
}
```

### 7. Routes
`routes/web.php`:
```php
Route::middleware(['auth', 'verified'])->group(function () {
    Route::resource('skills', \App\Http\Controllers\Web\SkillController::class);
});

Route::middleware(['auth', 'verified', 'can:access-admin'])
    ->prefix('admin')
    ->name('admin.')
    ->group(function () {
        Route::resource('skills', \App\Http\Controllers\Admin\SkillController::class);
    });
```

`routes/api.php`:
```php
Route::middleware(['auth:sanctum', 'throttle:60,1'])->group(function () {
    Route::apiResource('skills', \App\Http\Controllers\Api\SkillController::class);
});
```

- Always use named routes — Ziggy exposes them to React via `route(...)`.
- Prefer `apiResource` over `resource` for `Api/*` so Laravel omits `create` / `edit`.
- Verify that `Admin/*` routes are under the `admin.` name prefix so Inertia page props resolve `route('admin.skills.index')` correctly.

### 8. Policy (when ownership or role-gating matters)
```bash
php artisan make:policy <Model>Policy --model=<Model>
```
- Implement `viewAny`, `view`, `create`, `update`, `delete`, plus feature-specific verbs (`publish`, `feature`).
- Return `Response::allow()` / `Response::deny(__('policies.<model>.<action>'))` for translatable denial messages.
- In Laravel 11+/12 policies are auto-discovered by convention (`App\Models\Skill` → `App\Policies\SkillPolicy`); no `AuthServiceProvider` entry required unless you break the convention.
- Call `$this->authorize('update', $skill)` inside every protected controller action, and `Gate::authorize(...)` from services/jobs.

### 9. Observer (optional)
Use an observer for side-effects that should always fire regardless of which entry point created the model (controller, seeder, console command, job).

```bash
php artisan make:observer <Model>Observer --model=<Model>
```

Good fits:
- Auto-generate `slug` on `creating` / `updating` when the name changes.
- Invalidate cache tags on `saved` / `deleted`.
- Fire domain events (`event(new SkillPublished($skill))`).
- Enforce denormalised counters.

Register in `@app/Providers/AppServiceProvider.php@boot()`:
```php
use App\Models\Skill;
use App\Observers\SkillObserver;

public function boot(): void
{
    Skill::observe(SkillObserver::class);
}
```

### 10. Factory + Seeder
```bash
php artisan make:factory <Model>Factory --model=<Model>
php artisan make:seeder <Model>Seeder
```

- Factory `definition()` must cover every **required** column so `<Model>::factory()->create()` works out of the box in tests.
- Provide named states for common variants: `->published()`, `->featured()`, `->withImage()`.
- Seeder either calls `<Model>::factory()->count(20)->create()` or seeds deterministic rows for E2E.
- Register the seeder in `@database/seeders/DatabaseSeeder.php` so `php artisan db:seed` exercises it.

### 11. Feature test
```bash
php artisan make:test <Model>Test
```

Minimum coverage per namespace that ships:
- `authenticated_user_can_list_<plural>`
- `authenticated_user_can_create_<singular>` (assert DB row + flash or JSON 201)
- `authenticated_user_can_update_own_<singular>`
- `user_cannot_update_foreign_<singular>` (policy enforcement)
- `authenticated_user_can_delete_own_<singular>`
- Validation: `store_requires_<field>` with `assertSessionHasErrors` / `assertJsonValidationErrors`.

Use `RefreshDatabase`, `Inertia\Testing\AssertableInertia` for Web/Admin, and `assertJsonStructure` for Api. Run:
```bash
php artisan test --filter=<Model>
```

### 12. Verify
```bash
php artisan route:list --path=<routePrefix>
php artisan migrate:fresh --seed
php artisan test --filter=<Model>
./vendor/bin/pint app/Http/Controllers/<Namespace> app/Services app/Http/Resources app/Http/Requests app/Models app/Policies app/Observers
```

## Hand-off
Report every generated file path grouped by layer (migration, model, request, resource, service, controller, route, policy, observer, factory, seeder, test). Next: run `/inertia-pages` to scaffold the frontend (skip for pure `Api` features).

## References
- [Laravel 12 – Eloquent: API Resources](https://laravel.com/docs/12.x/eloquent-resources)
- [Laravel 12 – Service Container](https://laravel.com/docs/12.x/container)
- [Laravel 12 – Form Request Validation](https://laravel.com/docs/12.x/validation#form-request-validation)
- [Laravel 12 – Authorization (Policies)](https://laravel.com/docs/12.x/authorization)
- [Laravel 12 – Eloquent Observers](https://laravel.com/docs/12.x/eloquent#observers)
- [Laravel 12 – Database Testing / Factories](https://laravel.com/docs/12.x/database-testing)
- aliVerse conventions: `@.windsurf/rules/stack-rule.md`
- Existing reference resources: `@app/Http/Resources/PostResource.php`, `@app/Http/Resources/PostCollection.php`
- Existing reference controller: `@app/Http/Controllers/Api/SkillController.php`
