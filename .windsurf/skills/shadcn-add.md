---
name: shadcn-add
description: Add one or more shadcn/ui components to aliVerse and verify they register under resources/js/Components/ui/.
---

# Skill: shadcn-add

## When to use
A feature needs a shadcn/ui component that is not yet present in `resources/js/Components/ui/`.

## Inputs
- `components`: one or more component names (e.g. `table`, `dialog`, `alert`, `dropdown-menu`).

## Preconditions
- `components.json` exists at the repo root.
- Node + npm are available.
- Dev server may be running; installation does not require stopping it.

## Steps

1. **Confirm the component isn't already present.**
   Check `resources/js/Components/ui/<component>.jsx`. If it exists, ask the user whether to overwrite before proceeding.

2. **Run the installer** from the repo root for each component:
   ```bash
   npx shadcn@latest add <component>
   ```
   Pass `--yes` only if the user has pre-approved overwrites.

3. **Verify installation:**
   - File appears at `resources/js/Components/ui/<component>.jsx`.
   - Any new Radix dependency shows up in `package.json` (`@radix-ui/react-*`).
   - If a peer dep was added, run `npm install` (the installer usually handles this).

4. **Wire up imports** in the consuming page/component using the alias:
   ```jsx
   import { Button } from '@/Components/ui/button';
   ```

5. **Theme check:** render the component in both light and dark mode; confirm it uses semantic tokens (`bg-background`, `text-foreground`, etc.). If the installer produced hard-coded colors, edit to semantic tokens per `stack-rule.md`.

6. **Report** which files were added/changed so the user can review.

## Failure modes

- **`npx shadcn@latest` prompts for config** — `components.json` is missing or invalid; stop and surface the prompt to the user.
- **Tailwind classes not applying** — ensure the component path is included in `tailwind.config.js` `content` globs.
- **Radix peer missing** — run `npm install <missing-pkg>` and retry.
