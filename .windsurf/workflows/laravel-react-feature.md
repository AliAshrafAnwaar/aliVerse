---
description: Complete Laravel + React feature implementation workflow for aliVerse Portfolio
auto_execution_mode: 3
---

# Full-Stack Feature Implementation Workflow for aliVerse

## Project Overview

**Tech Stack:**
- Backend: Laravel 12 with Sanctum authentication
- Frontend: React 19 with Inertia.js
- Database: PostgreSQL with Eloquent ORM
- UI Framework: shadcn/ui with Tailwind CSS v3.4
- Theming: Dark/Light mode support with custom color system
- i18n: Multi-language support (EN/AR) with react-i18next
- Icons: Lucide React
- State Management: React hooks + Inertia props

**Key Project Characteristics:**
- Inertia.js for seamless SPA experience without API
- Server-side rendering with Laravel controllers
- Component-based UI with shadcn/ui
- Organized directory structure:
  - `/app/Http/Controllers/` - Inertia controllers
  - `/app/Models/` - Eloquent models
  - `/resources/js/Pages/` - Inertia pages
  - `/resources/js/Components/` - Reusable React components
  - `/resources/js/Components/ui/` - shadcn/ui components
  - `/resources/js/lib/` - Utility functions
  - `/resources/js/contexts/` - React contexts (Theme, etc.)
  - `/resources/js/i18n/` - Translation files

---

## Phase 1: Backend Implementation

### Step 1: Create Database Migration

```bash
php artisan make:migration create_[table_name]_table
```

**Checklist:**
- [ ] Define table schema with proper field types
- [ ] Add indexes for frequently queried columns
- [ ] Add foreign key relationships with cascade delete/update
- [ ] Include timestamps: `$table->timestamps();`
- [ ] Add soft deletes if needed: `$table->softDeletes();`
- [ ] Use snake_case for column names
- [ ] Add user_id foreign key for ownership
- [ ] Consider adding organization_id for multi-tenancy later

```bash
php artisan migrate
```

### Step 2: Create Eloquent Model

```bash
php artisan make:model [ModelName]
```

**Checklist:**
- [ ] Add `$fillable` array with all assignable fields
- [ ] Add `$casts` array for type casting (dates, booleans, JSON)
- [ ] Define relationships: `belongsTo()`, `hasMany()`, `belongsToMany()`
- [ ] Add soft delete trait if needed: `use SoftDeletes;`
- [ ] Add custom accessors/mutators if needed
- [ ] Add scope methods for common queries
- [ ] Define `$appends` for computed attributes

### Step 3: Create Form Request Validation

```bash
php artisan make:request Store[ModelName]Request
php artisan make:request Update[ModelName]Request
```

**Checklist:**
- [ ] Define validation rules for all fields
- [ ] Add authorization logic in `authorize()` method
- [ ] Include custom validation messages
- [ ] Handle file upload validation if needed
- [ ] Add conditional rules based on request data
- [ ] Validate relationships (exists in database)

### Step 4: Create Inertia Controller

```bash
php artisan make:controller [ModelName]Controller
```

**Checklist:**
- [ ] Implement `index()` - Return Inertia page with paginated list
- [ ] Implement `create()` - Return Inertia page with create form
- [ ] Implement `store()` - Validate and create, redirect with success message
- [ ] Implement `show()` - Return Inertia page with single record
- [ ] Implement `edit()` - Return Inertia page with edit form
- [ ] Implement `update()` - Validate and update, redirect with success message
- [ ] Implement `destroy()` - Delete record, redirect with success message
- [ ] Use `Inertia::render()` to return pages
- [ ] Flash success/error messages with `session()->flash()`
- [ ] Filter by authenticated user where appropriate
- [ ] Eager load relationships to avoid N+1 queries

**Example Controller Method:**
```php
public function index(Request $request)
{
    $features = Feature::query()
        ->when($request->search, fn($query, $search) => 
            $query->where('name', 'like', "%{$search}%")
        )
        ->latest()
        ->paginate(15)
        ->withQueryString();

    return Inertia::render('Features/Index', [
        'features' => $features,
        'filters' => $request->only('search'),
    ]);
}
```

### Step 5: Register Web Routes

**File:** `routes/web.php`

**Checklist:**
- [ ] Add routes inside `Route::middleware(['auth', 'verified'])->group()` for protected routes
- [ ] Use resource routing for standard CRUD: `Route::resource('features', FeatureController::class);`
- [ ] Add custom routes for special operations
- [ ] Use route model binding for automatic model resolution
- [ ] Group related routes with `Route::prefix()` if needed

---

## Phase 2: Frontend Implementation

### Step 6: Create Inertia Page Components

#### A. List/Index Component

**File:** `resources/js/Pages/Features/Index.jsx`

**Checklist:**
- [ ] Import necessary components from shadcn/ui
- [ ] Use `useTranslation()` hook for i18n
- [ ] Accept `features` and `filters` props from Inertia
- [ ] Display data in table or grid layout using shadcn/ui components
- [ ] Add pagination using Inertia's pagination links
- [ ] Add search functionality with debounced input
- [ ] Add action buttons (Edit, Delete, View) with proper routing
- [ ] Add Create button with `Link` to create page
- [ ] Show loading states during navigation
- [ ] Display empty state when no data
- [ ] Use `router.visit()` or `Link` for navigation

**Key Features:**
- Use `Inertia.get()` or `router.reload()` for filtering
- Implement search with debouncing to avoid excessive requests
- Show success/error flash messages from session
- Confirm before deleting with Dialog component
- Use ThemeToggle and LanguageToggle in header

**Example Component Structure:**
```jsx
import { Head, Link, router } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/Components/ui/button';
import { Card } from '@/Components/ui/card';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function Index({ auth, features, filters }) {
    const { t } = useTranslation();

    const handleDelete = (id) => {
        if (confirm(t('common.confirm'))) {
            router.delete(route('features.destroy', id));
        }
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title={t('features.title')} />
            
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Content */}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
```

#### B. Create Component

**File:** `resources/js/Pages/Features/Create.jsx`

**Checklist:**
- [ ] Create form with all required fields using shadcn/ui Input, Textarea, etc.
- [ ] Use `useForm()` hook from Inertia for form handling
- [ ] Add client-side validation
- [ ] Handle form submission with `form.post()`
- [ ] Show loading state during submission using `form.processing`
- [ ] Display validation errors using `form.errors`
- [ ] Add cancel button with `Link` back to index
- [ ] Use proper layout (AuthenticatedLayout)
- [ ] Show success message after creation (handled by redirect)

**Example Form Handling:**
```jsx
import { useForm } from '@inertiajs/react';

export default function Create({ auth }) {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        description: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('features.store'));
    };

    return (
        // Form JSX
    );
}
```

#### C. Edit Component

**File:** `resources/js/Pages/Features/Edit.jsx`

**Checklist:**
- [ ] Accept `feature` prop from Inertia
- [ ] Pre-populate form with existing data in `useForm()`
- [ ] Add form validation
- [ ] Handle submission with `form.put()` or `form.patch()`
- [ ] Show loading state during submission
- [ ] Display validation errors
- [ ] Add cancel button
- [ ] Show success message after update

#### D. Show/Detail Component

**File:** `resources/js/Pages/Features/Show.jsx`

**Checklist:**
- [ ] Accept `feature` prop from Inertia
- [ ] Display all feature information using shadcn/ui Card
- [ ] Show related data (user, timestamps)
- [ ] Add Edit button with `Link`
- [ ] Add Delete button with confirmation Dialog
- [ ] Add back button
- [ ] Use proper typography and layout
- [ ] Handle dark/light theme styling

### Step 7: Add Translations

**Files:** 
- `resources/js/i18n/locales/en.json`
- `resources/js/i18n/locales/ar.json`

**Checklist:**
- [ ] Add feature-specific translations
- [ ] Include form labels, buttons, messages
- [ ] Add validation error messages
- [ ] Include success/error notifications
- [ ] Support RTL for Arabic

**Example:**
```json
{
  "features": {
    "title": "Features",
    "create": "Create Feature",
    "edit": "Edit Feature",
    "delete": "Delete Feature",
    "name": "Name",
    "description": "Description",
    "created_success": "Feature created successfully",
    "updated_success": "Feature updated successfully",
    "deleted_success": "Feature deleted successfully"
  }
}
```

### Step 8: Create Reusable Components (Optional)

**Location:** `resources/js/Components/`

**Examples:**
- FeatureCard.jsx - Card for displaying feature
- FeatureForm.jsx - Reusable form component
- FeatureTable.jsx - Table component with sorting
- DeleteConfirmDialog.jsx - Confirmation dialog

---

## Phase 3: Testing & Refinement

### Step 9: Manual Testing Checklist

- [ ] Test create functionality
- [ ] Test edit functionality
- [ ] Test delete functionality with confirmation
- [ ] Test list with pagination
- [ ] Test search/filtering
- [ ] Test validation (required fields, formats)
- [ ] Test dark/light theme switching
- [ ] Test language switching (EN/AR)
- [ ] Test RTL layout for Arabic
- [ ] Test responsive design (mobile, tablet, desktop)
- [ ] Test authenticated vs guest access
- [ ] Test flash messages display correctly
- [ ] Test loading states during navigation

### Step 10: Code Quality Check

- [ ] Remove console.logs and debug code
- [ ] Ensure consistent code formatting
- [ ] Add proper prop-types or TypeScript if needed
- [ ] Optimize component re-renders
- [ ] Check accessibility (a11y) with screen readers
- [ ] Verify SEO with proper Head meta tags
- [ ] Test performance with React DevTools Profiler

---

## Best Practices for aliVerse

### Inertia.js Patterns

1. **Pass Only Necessary Data:**
   ```php
   return Inertia::render('Features/Index', [
       'features' => $features,
       // Don't pass entire User object if you only need name
   ]);
   ```

2. **Share Global Data:**
   Use `HandleInertiaRequests` middleware to share auth user, flash messages globally.

3. **Use Partial Reloads:**
   ```jsx
   router.reload({ only: ['features'] })
   ```

4. **Preserve Scroll Position:**
   ```jsx
   router.visit(url, { preserveScroll: true })
   ```

### shadcn/ui Integration

1. **Install Components as Needed:**
   ```bash
   npx shadcn@latest add table dialog alert
   ```

2. **Customize Components:**
   Edit components in `resources/js/Components/ui/` to match brand.

3. **Use Variants:**
   ```jsx
   <Button variant="destructive">Delete</Button>
   <Button variant="outline">Cancel</Button>
   ```

### Theming

1. **Use Theme Colors:**
   ```jsx
   className="bg-primary text-primary-foreground"
   className="bg-success text-success-foreground"
   ```

2. **Access Theme Context:**
   ```jsx
   const { theme, toggleTheme } = useTheme();
   ```

### Internationalization

1. **Use Translation Hook:**
   ```jsx
   const { t, i18n } = useTranslation();
   ```

2. **Handle RTL:**
   ```jsx
   <div dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}>
   ```

3. **Format Dates/Numbers:**
   Use i18n formatting for localized dates and numbers.

---

## Additional Setup Notes

### Filament Admin Panel (Future)

To install Filament for admin access:

1. **Enable PHP intl extension** in `php.ini`:
   ```ini
   extension=intl
   ```

2. **Install Filament:**
   ```bash
   composer require filament/filament
   php artisan filament:install --panels
   ```

3. **Create Admin User:**
   ```bash
   php artisan make:filament-user
   ```

4. **Access Admin:** `http://localhost/admin`

### Windows Development Script

Add to `composer.json`:
```json
"scripts": {
    "dev:win": [
        "Composer\\Config::disableProcessTimeout",
        "npx concurrently -c \"#93c5fd,#fdba74\" \"php artisan serve\" \"npm run dev\" --names=server,vite"
    ]
}
```

Run with: `composer run dev:win`

---

## Quick Reference Commands

```bash
# Create full CRUD for a feature
php artisan make:model Feature -mcr
php artisan make:request StoreFeatureRequest
php artisan make:request UpdateFeatureRequest

# Add shadcn component
npx shadcn@latest add [component-name]

# Run migrations
php artisan migrate

# Start development servers
composer run dev:win
# OR separately:
php artisan serve
npm run dev

# Build for production
npm run build
```

---

## Summary

This workflow integrates:
- ✅ Laravel 12 + PostgreSQL backend
- ✅ React 19 + Inertia.js frontend
- ✅ shadcn/ui component library
- ✅ Tailwind CSS v3.4 with custom theme
- ✅ Dark/Light mode switching
- ✅ Multi-language support (EN/AR with RTL)
- ✅ Modern color system with success/warning/info variants
- ✅ Type-safe forms with validation
- ✅ SEO-friendly with Inertia Head
- ✅ Responsive, accessible UI

Follow this workflow for consistent, maintainable feature development across your portfolio project.