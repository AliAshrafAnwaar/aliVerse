---
name: i18n-key-sync
description: Ensure resources/js/i18n/locales/en.json and ar.json are structurally identical and report missing translations.
---

# Skill: i18n-key-sync

## When to use
- After adding or renaming translation keys in `en.json`.
- Before shipping a feature that touched UI strings.
- Periodically, as a drift audit.

## Inputs
- None by default; acts on `resources/js/i18n/locales/en.json` and `ar.json`.
- Optional `--fix`: auto-add missing keys to `ar.json` with empty-string placeholders.

## Steps

1. **Load both JSON files.** Fail fast if either does not parse.

2. **Flatten keys** to dot paths (e.g. `skills.form.submit`). Build `enKeys` and `arKeys` as sorted sets.

3. **Compute diffs:**
   - `missingInAr = enKeys - arKeys`
   - `missingInEn = arKeys - enKeys`
   - `typeMismatch = keys where typeof(en[k]) !== typeof(ar[k])` (e.g. string vs. object).

4. **Report** in this exact format:
   ```
   en.json: <N> keys
   ar.json: <M> keys
   Missing in ar.json (<count>):
     - <key>
   Missing in en.json (<count>):
     - <key>
   Type mismatches (<count>):
     - <key>: en=<type> ar=<type>
   ```

5. **Fix mode (`--fix`):**
   - For each `missingInAr`, insert at the correct nested location in `ar.json` with value `""`.
   - **Never** auto-translate — the user or a translator fills the Arabic strings.
   - Keep key ordering inside each object consistent with `en.json` to minimise diff noise.
   - **Do not** touch `missingInEn`; surface them so the user can decide whether to delete the stale Arabic key or add the English counterpart.

6. **Validate** the resulting files still parse as JSON. Pretty-print with 2-space indent, trailing newline.

7. **Hand off:** suggest the user populate empty Arabic strings and run the app with `i18n.language = 'ar'` to sanity-check RTL.

## Guardrails
- Never reorder top-level namespaces; only fill missing keys.
- Never overwrite a non-empty Arabic translation.
- Treat pluralization suffixes (`_one`, `_other`, `_zero`) as distinct keys — react-i18next relies on them.
