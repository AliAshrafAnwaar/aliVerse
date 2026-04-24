---
trigger: always_on
---

# aliVerse Stack Conventions

These conventions always apply. Follow them unless the user explicitly overrides.

## Stack Ground Truth

- **Backend:** Laravel 12 (`laravel/framework: ^12.0`), PHP 8.2+.
- **SPA bridge:** Inertia.js 2 (`inertiajs/inertia-laravel: ^2.0`, `@inertiajs/react: ^2.0.0`). Do NOT build REST endpoints for first-party UI; use Inertia controllers returning `Inertia::render(...)`.
- **Auth:** Laravel Sanctum (`laravel/sanctum: ^4.0`) + Laravel Breeze scaffolding. Protect app routes with `['auth', 'verified']`.
- **Routes in JS:** Ziggy (`tightenco/ziggy: ^2.0`). Always use `route('name', params)` in React — never hard-code URLs.
- **Frontend:** React **18.2** (not 19), Vite 7, `laravel-vite-plugin` 2.
- **UI:** shadcn/ui components live in `resources/js/Components/ui/`. Tailwind **v3.4** with `tailwindcss-animate`. Radix primitives are already installed — prefer them.
- **Icons:** `lucide-react` only. Do not add other icon packs.
- **i18n:** `react-i18next` + `i18next`. Locale files at `resources/js/i18n/locales/en.json` and `ar.json`. Config at `resources/js/i18n/config.js`.
- **DB:** PostgreSQL (`DB_CONNECTION=pgsql`, database `aliVerse`). Sessions/queues/cache all use `database` driver.
- **Testing:** PHPUnit 11 via `composer test`.
- **Dev servers:** `composer run dev:win` on Windows, `composer run dev` elsewhere.

## Directory Map (enforce)

- `app/Http/Controllers/Web/` — Inertia page controllers for the public site.
- `app/Http/Controllers/Admin/` — Inertia controllers for the admin panel.
- `app/Http/Controllers/Api/` — only for third-party / external API consumers.
- `app/Http/Resources/` — API resources (used by `Api/*` controllers).
- `app/Models/` — Eloquent models.
- `resources/js/Pages/` — Inertia pages, mirror controller namespace (`Admin/Skills/Index.jsx` ↔ `Admin\SkillController@index`).
- `resources/js/Components/` — reusable feature components.
- `resources/js/Components/ui/` — shadcn primitives; edit cautiously.
- `resources/js/Layouts/` — `AdminLayout`, `AuthenticatedLayout`, `GuestLayout`, `PublicLayout`.
- `resources/js/contexts/` — React contexts (Theme, etc.).
- `resources/js/hooks/` — custom hooks.
- `resources/js/lib/` — pure utilities (e.g., `cn`).
- `resources/js/api/services/` — axios clients for external APIs only.

## Coding Conventions

- **PHP:** PSR-12, run `./vendor/bin/pint` before committing.
- **Migrations:** `snake_case` columns, always include `$table->timestamps()`, add indexes for FKs and frequently-queried columns, cascade on parent delete where ownership applies, prefer `$table->foreignId('user_id')->constrained()->cascadeOnDelete()`.
- **Models:** define `$fillable`, `$casts`, relationships, and scopes. Avoid `$guarded = []`.
- **Controllers:** thin. Validate via FormRequest classes, eager-load to avoid N+1, paginate lists (`->paginate(15)->withQueryString()`), flash messages via `session()->flash('success', ...)`.
- **Authorization:** use Policies + `$this->authorize(...)` or `Gate::authorize(...)`. Filter list queries by `auth()->id()` when the resource is user-owned.
- **React:** function components + hooks only. No class components. Props destructured in signature. File name matches default export.
- **Styling:** Tailwind utility classes; use semantic tokens (`bg-primary`, `text-muted-foreground`, `bg-success`) instead of raw colors.
- **Forms:** always use Inertia's `useForm()` for create/edit. Show server errors from `errors`, loading state from `processing`.
- **Navigation:** always `<Link href={route(...)}>` or `router.visit(route(...))`. Never bare `<a>` for internal links.

## i18n Rules

- **Every** user-facing string goes through `t('namespace.key')`. No hard-coded English in JSX.
- Keep `en.json` and `ar.json` **structurally identical** — same keys, same nesting. Arabic translations may be empty strings pending review, but keys must exist.
- Wrap page roots with `dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}` or rely on the layout to do this.
- Prefer logical CSS (`ms-*`, `me-*`, `ps-*`, `pe-*`, `text-start`, `text-end`) over `left/right` variants so RTL works automatically.

## UI / UX Rules (see also `ui-rule.md`)

- Minimalist, developer-dashboard feel: clear hierarchy, generous spacing, subtle shadows, smooth corners.
- Support **both** dark and light themes on every surface. Test both before declaring done.
- Confirm destructive actions with a Dialog, never a native `confirm()` in production paths.
- Provide empty states, loading states, and error states for every data view.

## Security & Privacy

- Never log PII, tokens, or secrets. Never commit `.env`.
- Validate file uploads (mime, size) in FormRequests.
- CSRF is automatic via Inertia — do not disable.
- Rate-limit `Api/*` routes with `throttle:*` middleware.

## Do-Not List

- Do not introduce a REST API layer for features the Inertia UI consumes.
- Do not add TypeScript without explicit approval — the codebase is JSX.
- Do not install additional UI kits (Material, Chakra, Ant). shadcn + Radix + Tailwind only.
- Do not bypass FormRequest validation by validating inline in controllers for non-trivial forms.
- Do not add new top-level locales without updating `resources/js/i18n/config.js`.
