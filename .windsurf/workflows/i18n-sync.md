---
description: Audit and synchronise resources/js/i18n/locales/en.json with ar.json, reporting or filling missing keys.
auto_execution_mode: 3
---

# Workflow: /i18n-sync

Thin orchestration wrapper around the `i18n-key-sync` skill.

## When to run
- Immediately after a feature adds or renames UI strings.
- Before opening a PR that touched `resources/js/**/*.jsx`.
- On a schedule, as a drift audit.

## Steps

### 1. Grep for new `t(...)` usages
```bash
rg "t\(['\"]([^'\"]+)['\"]" resources/js --only-matching -r '$1' | sort -u
```
Cross-reference the printed keys against `resources/js/i18n/locales/en.json`. Add any missing keys to `en.json` first, in a logically nested location.

### 2. Run the `i18n-key-sync` skill
Execute it in report mode first. The skill:
- Loads both JSON files.
- Reports missing-in-ar, missing-in-en, and type mismatches.

### 3. Apply fixes
If the report shows gaps:
- Run the skill with `--fix` to insert empty-string placeholders in `ar.json` for every key missing from it.
- Manually resolve `missingInEn` and type mismatches (the skill will not auto-fix these).
- Translate or flag the newly added Arabic placeholders.

### 4. Validate
```bash
php -r "json_decode(file_get_contents('resources/js/i18n/locales/en.json'), true) ?: exit(1);"
php -r "json_decode(file_get_contents('resources/js/i18n/locales/ar.json'), true) ?: exit(1);"
```
Both must exit 0.

### 5. Runtime sanity check
- Start the dev server: `composer run dev:win`.
- Toggle the language to Arabic in the UI.
- Spot-check the changed pages: no raw keys visible (e.g. `skills.form.submit`), layout flips to RTL, no text clipping.

## Hand-off
Report the count of keys added to `ar.json` and list any Arabic placeholders that still need real translations.
