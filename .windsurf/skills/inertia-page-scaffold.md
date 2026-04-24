---
name: inertia-page-scaffold
description: Generate the Index / Create / Edit / Show Inertia page quartet for a Laravel model in aliVerse.
---

# Skill: inertia-page-scaffold

## When to use
Backend controller + routes for a resource exist (or are being created in parallel) and the user needs the matching Inertia pages wired up.

## Inputs
- `model`: singular PascalCase model name (e.g. `Skill`, `Project`).
- `namespace`: `Web` (default), `Admin`, or custom (maps to `resources/js/Pages/<Namespace>/<ModelPlural>/`).
- `fields`: list of `{ name, type, required }` describing form fields.

## Derived names
- `plural` = pluralized kebab/PascalCase (e.g. `Skills`).
- `routePrefix` = `<namespace-lower>.<plural-lower>` (e.g. `admin.skills`).
- `pagePath` = `resources/js/Pages/<Namespace>/<plural>/`.

## Steps

1. **Create directory** `pagePath` if missing.

2. **Generate `Index.jsx`** with:
   - Head title via `t('<plural>.title')`.
   - Props `{ auth, <plural>, filters }`.
   - Search input (debounced) that calls `router.get(route('<routePrefix>.index'), { search }, { preserveState: true, replace: true })`.
   - Table or card grid from shadcn/ui (`Table`, `Card`).
   - Row actions: Edit `<Link>` → `<routePrefix>.edit`, Delete with Dialog confirm → `router.delete(route('<routePrefix>.destroy', id))`.
   - Pagination rendered from Laravel paginator meta.
   - Empty state when `data.length === 0`.
   - Wrap in `AuthenticatedLayout` (or `AdminLayout` for Admin namespace).

3. **Generate `Create.jsx`** with:
   - `useForm` initialized with every field from `fields`.
   - Field inputs from shadcn `Input` / `Textarea` / `Select` / `Checkbox` based on type.
   - Server errors rendered inline using `errors.<field>`.
   - Submit button disabled while `processing`.
   - Cancel `<Link>` back to index.

4. **Generate `Edit.jsx`** — same as Create but:
   - Accept `<model>` prop.
   - Initialize `useForm` with existing values.
   - Submit with `put(route('<routePrefix>.update', <model>.id))`.

5. **Generate `Show.jsx`** with:
   - Display fields in a `Card` with `dl`/`dt`/`dd` or labeled rows.
   - Edit button → `<routePrefix>.edit`; Delete with confirm Dialog.
   - Back link to index.

6. **i18n:** add the new keys under a `<plural>` namespace to `resources/js/i18n/locales/en.json` and `ar.json`. Required keys: `title`, `create`, `edit`, `delete`, one per field, `created_success`, `updated_success`, `deleted_success`, `confirm_delete`. Chain into the `i18n-key-sync` skill after adding.

7. **Smoke-check routes** with `php artisan route:list --name=<routePrefix>` (optional but recommended).

## Output contract
Report the list of files created and a one-line diff summary per file so the user can review before running the app.

## Must follow
- Respect `@c:/Users/aliof/projects/aliVerse/.windsurf/rules/stack-rule.md` (Ziggy `route()`, semantic tokens, no native `confirm`, logical CSS for RTL).
- Do not inline English strings. Every label → `t(...)`.
