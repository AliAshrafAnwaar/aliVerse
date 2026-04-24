# aliVerse Windsurf Skills

Skills are reusable, task-scoped procedures the agent can invoke on demand. They differ from workflows in that they are meant to be small, composable, and called as building blocks during a larger task (workflows are end-to-end procedures).

## Available skills

- `shadcn-add.md` — add one or more shadcn/ui components and register them correctly.
- `inertia-page-scaffold.md` — generate the `Index/Create/Edit/Show` quartet for a model.
- `i18n-key-sync.md` — keep `en.json` and `ar.json` structurally aligned.

## Invoking a skill

Reference the skill by name in chat, e.g. "use the `shadcn-add` skill to add `table` and `dialog`", or have a workflow step explicitly call into it.
