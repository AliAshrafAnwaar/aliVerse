---
description: Install and configure Filament v3 for the aliVerse admin panel.
auto_execution_mode: 1
---

# Workflow: /filament-install

One-time setup. `auto_execution_mode: 1` because this mutates `composer.json`, runs migrations, and creates an admin user — the user should confirm each step.

## Prerequisites

1. **Enable PHP `intl` extension.** Open the active `php.ini` (find with `php --ini`) and ensure:
   ```ini
   extension=intl
   ```
   Restart the terminal / PHP-FPM afterwards. Verify with `php -m | findstr intl` (Windows) or `php -m | grep intl`.

2. **Confirm Laravel 12 + PHP 8.2+**:
   ```bash
   php artisan --version
   php -v
   ```

## Steps

### 1. Install Filament
```bash
composer require filament/filament:"^3.2" -W
```

### 2. Install the panel scaffolding
```bash
php artisan filament:install --panels
```
Accept defaults unless the user specifies otherwise. This creates `app/Providers/Filament/AdminPanelProvider.php` and registers the `/admin` route.

### 3. Create an admin user
```bash
php artisan make:filament-user
```
Prompt the user for name / email / password.

### 4. Gate the panel
- Implement `FilamentUser` on `app/Models/User.php`:
  ```php
  public function canAccessPanel(\Filament\Panel $panel): bool
  {
      return str_ends_with($this->email, '@yourdomain.com') || $this->is_admin;
  }
  ```
- Add `is_admin` boolean column via a new migration if it doesn't exist.

### 5. Reconcile with existing Inertia admin
This project already has `AdminLayout.jsx` and Inertia-based admin pages under `resources/js/Pages/Admin/`. Decide with the user:
- **Option A (default):** Filament handles power-user CRUD, Inertia admin stays for custom dashboards. Keep both; they coexist under different routes.
- **Option B:** Migrate Inertia admin CRUD into Filament resources. Create a tracking doc before starting.

### 6. Theme alignment
- Publish Filament's theme: `php artisan vendor:publish --tag=filament-config`.
- Match primary colour to Tailwind `--primary` so the admin panel doesn't clash with the public site.
- Enable dark mode in `AdminPanelProvider::panel()` via `->darkMode()`.

### 7. Smoke test
```bash
composer run dev:win
```
Visit `http://localhost:8000/admin`, log in, confirm the panel renders.

## Rollback
If installation fails after step 1:
```bash
composer remove filament/filament
```
Delete `app/Providers/Filament/` and revert `bootstrap/providers.php` changes.
