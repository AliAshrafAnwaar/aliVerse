---
description: Build the Inertia + React page quartet (Index, Create, Edit, Show) for an aliVerse resource.
auto_execution_mode: 3
---

# Workflow: /inertia-pages

Companion to `/backend-crud`. Assumes controller + routes exist.

## Inputs
- `Model` — singular PascalCase.
- `namespace` — `Web` or `Admin`.
- `fields` — list of `{ name, type, required }`.

## Steps

### 1. Plan the page directory
Target folder: `resources/js/Pages/<Namespace>/<Plural>/`. Create it if missing.

### 2. Install any missing shadcn components
Invoke the `shadcn-add` skill with the components the pages need. Typical list: `table`, `dialog`, `input`, `textarea`, `label`, `button`, `card`, `select`, `dropdown-menu`.

### 3. Scaffold pages via the `inertia-page-scaffold` skill
Call with `{ model, namespace, fields }`. Produces:
- `Index.jsx` — list + search + pagination + row actions.
- `Create.jsx` — `useForm` + server errors + submit/cancel.
- `Edit.jsx` — `useForm` pre-populated + `put`.
- `Show.jsx` — read-only detail view + edit/delete actions.

### 4. Layout + theming checks
- Wrap each page in `AuthenticatedLayout` (Web) or `AdminLayout` (Admin).
- Pull auth from `usePage().props.auth` only when layout doesn't already handle it.
- Use semantic Tailwind tokens (`bg-primary`, `text-muted-foreground`, `bg-success`).
- Replace any `left/right` spacing with logical equivalents (`ms-*`, `me-*`, `text-start`, `text-end`) for RTL.

### 5. Inertia ergonomics
- `router.reload({ only: ['<plural>'] })` for partial refreshes.
- `router.visit(url, { preserveScroll: true })` after destructive or in-list actions.
- Debounce search input (300–400 ms) before calling `router.get`.

### 6. Flash messages
Read from `usePage().props.flash` (shared via `HandleInertiaRequests`). Render with a shadcn `Alert` or `Toast`. Dismiss on navigation.

### 7. Translations
Call `/i18n-sync` after adding any new `t('...')` keys. Never ship hard-coded strings.

### 8. Manual QA before finishing
- Create / edit / delete happy paths.
- Search + pagination persist via `withQueryString`.
- Dark + light themes on every page.
- EN + AR, including RTL layout.
- Mobile (≤ 640 px), tablet, desktop breakpoints.
- Empty state, loading state, error state.

## Hand-off
Report page files created/modified and any i18n keys added.
