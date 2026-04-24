---
description: End-to-end orchestrator for a full-stack feature in aliVerse. Delegates to focused sub-workflows and skills.
auto_execution_mode: 3
---

# Workflow: /laravel-react-feature

Top-level orchestrator. Prefer invoking the sub-workflows directly if you only need part of the cycle.

## Feature cycle

```
gather inputs → /backend-crud → /inertia-pages → /i18n-sync → QA
```

## Inputs to gather first

- **Feature name** (singular PascalCase model, e.g. `Skill`).
- **Namespace** — `Web` (public site) or `Admin` (admin panel). Use `Api` only for external consumers.
- **Fields** — `{ name, type, required, nullable, default }` per attribute.
- **Ownership** — user-owned, global, or multi-tenant (future).
- **Admin-only?** — drives layout choice and route group.

## Step 1 — Backend: `/backend-crud`
Runs:
1. Migration (snake_case, FKs with cascade, timestamps, optional soft deletes).
2. Model (`$fillable`, `$casts`, relationships, scopes).
3. FormRequests (`Store*Request`, `Update*Request`) with `authorize()` + `rules()`.
4. Controller under the chosen namespace using `Inertia::render(...)`.
5. Routes in `routes/web.php` (or `routes/api.php` for `Api`).
6. Policy, if ownership applies.

See `@.windsurf/workflows/backend-crud.md`.

## Step 2 — Frontend: `/inertia-pages`
Runs:
1. Ensure required shadcn components exist (delegates to the `shadcn-add` skill).
2. Scaffold `Index / Create / Edit / Show` pages (delegates to the `inertia-page-scaffold` skill).
3. Wrap pages in `AuthenticatedLayout` or `AdminLayout`.
4. Wire Ziggy `route()` calls, `useForm`, Inertia partial reloads, and flash messages.

See `@.windsurf/workflows/inertia-pages.md`.

## Step 3 — Localisation: `/i18n-sync`
Runs:
1. Grep new `t(...)` keys in `resources/js`.
2. Ensure `en.json` contains every key used.
3. Mirror keys into `ar.json` (empty placeholders) via the `i18n-key-sync` skill.
4. JSON parse validation + runtime spot-check.

See `@.windsurf/workflows/i18n-sync.md`.

## Step 4 — QA

Manual:
- CRUD happy paths.
- Search + pagination persistence.
- Dark / light theme on every page.
- EN + AR including RTL layout correctness.
- Responsive breakpoints (mobile, tablet, desktop).
- Empty, loading, and error states.
- Authenticated vs. guest access.
- Flash messages render and dismiss.

Automated:
```bash
composer test
```

## Step 5 — Code quality

- `./vendor/bin/pint` for PHP.
- Remove `console.log` and any debug code.
- Verify no hard-coded strings outside i18n.
- Confirm accessibility basics: form labels, focus rings, semantic headings.

## Related

- **Rules:**
  - `@.windsurf/rules/stack-rule.md` — always-on stack conventions.
  - `@.windsurf/rules/ui-rule.md` — manual-trigger UI/UX guidance.
- **Skills:**
  - `@.windsurf/skills/shadcn-add.md`
  - `@.windsurf/skills/inertia-page-scaffold.md`
  - `@.windsurf/skills/i18n-key-sync.md`
- **Optional workflows:**
  - `@.windsurf/workflows/filament-install.md` — one-time admin panel setup.

## Quick reference

```bash
# Backend scaffolding
php artisan make:model <Model> -mcr
php artisan make:request Store<Model>Request
php artisan make:request Update<Model>Request

# Frontend primitives
npx shadcn@latest add <component>

# Dev servers (Windows)
composer run dev:win

# Build
npm run build
```
