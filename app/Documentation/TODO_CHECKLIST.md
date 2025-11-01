# aliVerse Portfolio - Detailed TODO Checklist

**Last Updated:** November 1, 2025

---

## 🎯 PHASE 1: Foundation & Core Setup

### 1.1 Environment Setup
- [ ] Clone/verify repository
- [ ] Install Composer dependencies
- [ ] Install NPM dependencies
- [ ] Configure `.env` file (database, app settings)
- [ ] Generate application key
- [ ] Verify PostgreSQL connection
- [ ] Test Laravel + Vite setup

### 1.2 Database Migrations (Create in Order)
```bash
# Foundation tables
- [ ] php artisan make:migration create_users_table (should exist)
- [ ] php artisan make:migration add_profile_fields_to_users_table
- [ ] php artisan make:migration create_categories_table
- [ ] php artisan make:migration create_tags_table

# Content tables
- [ ] php artisan make:migration create_projects_table
- [ ] php artisan make:migration create_project_images_table
- [ ] php artisan make:migration create_posts_table
- [ ] php artisan make:migration create_post_tag_table

# Books module
- [ ] php artisan make:migration create_books_table
- [ ] php artisan make:migration create_book_quotes_table

# Portfolio content
- [ ] php artisan make:migration create_skills_table
- [ ] php artisan make:migration create_experiences_table
- [ ] php artisan make:migration create_educations_table

# Engagement
- [ ] php artisan make:migration create_comments_table
- [ ] php artisan make:migration create_reactions_table

# Utility
- [ ] php artisan make:migration create_contact_messages_table
- [ ] php artisan make:migration create_page_views_table

# Run migrations
- [ ] php artisan migrate
- [ ] Verify all tables created in database
```

### 1.3 Models & Traits
```bash
# Create Traits first
- [ ] app/Traits/Reactable.php
- [ ] app/Traits/Reactor.php
- [ ] app/Traits/Viewable.php

# Create Models
- [ ] php artisan make:model Category
- [ ] php artisan make:model Tag
- [ ] php artisan make:model Project
- [ ] php artisan make:model ProjectImage
- [ ] php artisan make:model Post
- [ ] php artisan make:model Book
- [ ] php artisan make:model BookQuote
- [ ] php artisan make:model Skill
- [ ] php artisan make:model Experience
- [ ] php artisan make:model Education
- [ ] php artisan make:model Comment
- [ ] php artisan make:model Reaction
- [ ] php artisan make:model ContactMessage
- [ ] php artisan make:model PageView

# Configure models
- [ ] Add $fillable arrays
- [ ] Add $casts for JSON, dates, booleans
- [ ] Define relationships
- [ ] Add traits (Reactable, Reactor, Viewable)
- [ ] Add scopes for common queries
```

### 1.4 Authentication Setup
- [ ] Verify Laravel Breeze/Jetstream installed
- [ ] Configure Sanctum
- [ ] Add admin check to User model
- [ ] Create admin middleware: `php artisan make:middleware EnsureUserIsAdmin`
- [ ] Register middleware in `app/Http/Kernel.php`
- [ ] Test login/logout flow

---

## 🎯 PHASE 2: Projects Module (MVP PRIORITY)

### 2.1 Backend - Projects

#### Database & Models
- [x] Migration created (from Phase 1)
- [ ] Configure Project model:
  ```php
  - $fillable: title, slug, description, content, image, demo_url, github_url, technologies, featured, status, sort_order
  - $casts: technologies => 'array', featured => 'boolean'
  - Relationships: hasMany(ProjectImage), morphMany(Comment), morphMany(Reaction), morphMany(PageView)
  - Use Reactable trait
  - Use Viewable trait
  ```
- [ ] Configure ProjectImage model:
  ```php
  - $fillable: project_id, image_path, alt_text, sort_order
  - Relationship: belongsTo(Project)
  ```

#### Form Requests
- [ ] `php artisan make:request StoreProjectRequest`
  - [ ] Validation rules: title, slug, description, content, image, demo_url, github_url, technologies, status
  - [ ] Authorization: user must be admin
  - [ ] Custom messages for validation
- [ ] `php artisan make:request UpdateProjectRequest`
  - [ ] Same as Store but with update logic

#### Controller
- [ ] `php artisan make:controller ProjectController`
- [ ] Implement `index()` - paginated projects for public
  - [ ] Filter: status = 'published'
  - [ ] Order by: featured desc, sort_order
  - [ ] Eager load: images
  - [ ] Return Inertia::render('Projects/Index')
- [ ] Implement `show($slug)` - single project detail
  - [ ] Find by slug
  - [ ] Track page view
  - [ ] Eager load: images, comments.user, reactions
  - [ ] Return Inertia::render('Projects/Show')
- [ ] Implement admin methods (auth:admin middleware):
  - [ ] `create()` - Return Inertia::render('Admin/Projects/Create')
  - [ ] `store()` - Create project with image upload
  - [ ] `edit($id)` - Return Inertia::render('Admin/Projects/Edit')
  - [ ] `update($id)` - Update project
  - [ ] `destroy($id)` - Delete project

#### Routes
- [ ] Public routes in `routes/web.php`:
  ```php
  Route::get('/projects', [ProjectController::class, 'index'])->name('projects.index');
  Route::get('/projects/{slug}', [ProjectController::class, 'show'])->name('projects.show');
  ```
- [ ] Admin routes:
  ```php
  Route::middleware(['auth', 'admin'])->prefix('admin')->group(function() {
      Route::resource('projects', ProjectController::class)->except(['index', 'show']);
  });
  ```

#### Policies
- [ ] `php artisan make:policy ProjectPolicy --model=Project`
- [ ] Implement: viewAny, view, create, update, delete

#### Image Upload
- [ ] Install intervention/image: `composer require intervention/image`
- [ ] Create storage link: `php artisan storage:link`
- [ ] Image upload service or helper
- [ ] Thumbnail generation
- [ ] Multiple image upload for gallery

### 2.2 Frontend - Projects

#### Public Pages
- [ ] **`resources/js/Pages/Projects/Index.jsx`**
  - [ ] Import: Head, Link, Button, Card from shadcn
  - [ ] Accept props: projects (paginated)
  - [ ] Layout: Grid of ProjectCards
  - [ ] Filter: Featured projects, All projects
  - [ ] Pagination component
  - [ ] Empty state

- [ ] **`resources/js/Pages/Projects/Show.jsx`**
  - [ ] Accept props: project
  - [ ] Hero section with featured image
  - [ ] Project gallery (ProjectImage carousel)
  - [ ] Description and content
  - [ ] Technologies badges
  - [ ] Demo/GitHub links
  - [ ] Comments section
  - [ ] Reactions component
  - [ ] Share buttons

#### Admin Pages
- [ ] **`resources/js/Pages/Admin/Projects/Index.jsx`**
  - [ ] Table view with all projects
  - [ ] Search and filter (status, featured)
  - [ ] Actions: Edit, Delete, View
  - [ ] Create button

- [ ] **`resources/js/Pages/Admin/Projects/Create.jsx`**
  - [ ] Form with useForm() hook
  - [ ] Fields: title, slug, description, content (rich text), image upload, demo_url, github_url, technologies (tags input), featured, status
  - [ ] Submit handler
  - [ ] Validation errors display

- [ ] **`resources/js/Pages/Admin/Projects/Edit.jsx`**
  - [ ] Pre-populated form
  - [ ] Same fields as Create
  - [ ] Update handler
  - [ ] Delete button with confirmation

#### Components
- [ ] **`resources/js/Components/ProjectCard.jsx`**
  - [ ] Props: project
  - [ ] Image with fallback
  - [ ] Title, excerpt
  - [ ] Technologies badges
  - [ ] View project link

- [ ] **`resources/js/Components/ProjectGallery.jsx`**
  - [ ] Image carousel/lightbox
  - [ ] Thumbnails
  - [ ] Zoom functionality

- [ ] **`resources/js/Components/TechnologyBadge.jsx`**
  - [ ] Tech name
  - [ ] Icon (optional)
  - [ ] Styling

#### Translations
- [ ] Add to `resources/js/i18n/locales/en.json`:
  ```json
  "projects": {
    "title": "Projects",
    "view_project": "View Project",
    "demo": "Live Demo",
    "source_code": "Source Code",
    "technologies": "Technologies",
    "featured": "Featured Projects",
    ...
  }
  ```
- [ ] Add Arabic translations

---

## 🎯 PHASE 3: Blog Module

### 3.1 Backend - Categories & Tags

#### Models
- [ ] Configure Category model
- [ ] Configure Tag model
- [ ] Relationships to Post

#### Controllers
- [ ] `php artisan make:controller CategoryController`
- [ ] `php artisan make:controller TagController`

#### Routes
- [ ] Public: `/blog/category/{slug}`, `/blog/tag/{slug}`
- [ ] Admin CRUD routes

### 3.2 Backend - Posts

#### Models & Requests
- [ ] Configure Post model (with Reactable trait)
- [ ] `php artisan make:request StorePostRequest`
- [ ] `php artisan make:request UpdatePostRequest`

#### Controller
- [ ] `php artisan make:controller PostController`
- [ ] `index()` - blog listing with filters
- [ ] `show($slug)` - post detail
- [ ] Admin CRUD methods
- [ ] View counter logic

#### Routes
- [ ] Public: `/blog`, `/blog/{slug}`
- [ ] Admin routes

### 3.3 Frontend - Blog

#### Public Pages
- [ ] **`resources/js/Pages/Blog/Index.jsx`**
  - [ ] Posts grid/list
  - [ ] Category filter sidebar
  - [ ] Search bar
  - [ ] Pagination

- [ ] **`resources/js/Pages/Blog/Show.jsx`**
  - [ ] Post content (markdown/rich text)
  - [ ] Author card
  - [ ] Published date, reading time
  - [ ] Tags
  - [ ] Share buttons
  - [ ] Comments
  - [ ] Reactions
  - [ ] Related posts

- [ ] **`resources/js/Pages/Blog/Category.jsx`**
  - [ ] Filtered posts by category

- [ ] **`resources/js/Pages/Blog/Tag.jsx`**
  - [ ] Filtered posts by tag

#### Admin Pages
- [ ] **`resources/js/Pages/Admin/Posts/Index.jsx`**
- [ ] **`resources/js/Pages/Admin/Posts/Create.jsx`**
  - [ ] Rich text editor (TipTap)
  - [ ] Category select
  - [ ] Tags input
  - [ ] Featured image upload
  - [ ] SEO fields
  - [ ] Status select

- [ ] **`resources/js/Pages/Admin/Posts/Edit.jsx`**

#### Components
- [ ] **`resources/js/Components/PostCard.jsx`**
- [ ] **`resources/js/Components/PostContent.jsx`** (markdown renderer)
- [ ] **`resources/js/Components/CategoryFilter.jsx`**
- [ ] **`resources/js/Components/TagCloud.jsx`**
- [ ] **`resources/js/Components/RelatedPosts.jsx`**
- [ ] **`resources/js/Components/AuthorCard.jsx`**

#### Translations
- [ ] Add blog translations (EN/AR)

---

## 🎯 PHASE 4: Books Module

### 4.1 Backend - Books

#### Models
- [ ] Configure Book model (with Reactable trait)
- [ ] Configure BookQuote model
- [ ] Relationships

#### Requests
- [ ] `php artisan make:request StoreBookRequest`
- [ ] `php artisan make:request UpdateBookRequest`

#### Controller
- [ ] `php artisan make:controller BookController`
- [ ] `index()` - books library with filters (status, category)
- [ ] `show($slug)` - book detail with review and quotes
- [ ] Admin CRUD methods

#### Routes
- [ ] Public: `/books`, `/books/{slug}`
- [ ] Admin routes

### 4.2 Frontend - Books

#### Public Pages
- [ ] **`resources/js/Pages/Books/Index.jsx`**
  - [ ] Bookshelf view (grouped by status)
  - [ ] Filter: status, category, year, language
  - [ ] Sort: rating, finished date, title
  - [ ] Search

- [ ] **`resources/js/Pages/Books/Show.jsx`**
  - [ ] Book cover
  - [ ] Details (author, ISBN, pages, etc.)
  - [ ] Rating
  - [ ] Review
  - [ ] Quotes list
  - [ ] Purchase links (Amazon, Goodreads)
  - [ ] Reactions
  - [ ] Comments

#### Admin Pages
- [ ] **`resources/js/Pages/Admin/Books/Index.jsx`**
- [ ] **`resources/js/Pages/Admin/Books/Create.jsx`**
  - [ ] Fields: title, slug, author, ISBN, description, review, cover_image, amazon_url, goodreads_url, rating, status, pages, dates, category, tags, favorite, published_year, language
- [ ] **`resources/js/Pages/Admin/Books/Edit.jsx`**
  - [ ] Quote management (add/edit/delete quotes)

#### Components
- [ ] **`resources/js/Components/BookCard.jsx`**
  - [ ] Book cover
  - [ ] Title, author
  - [ ] Rating
  - [ ] Status badge
- [ ] **`resources/js/Components/BookShelf.jsx`**
  - [ ] Grouped books by status
  - [ ] Tabs: All, Reading, Completed, To Read
- [ ] **`resources/js/Components/BookRating.jsx`**
  - [ ] Star rating display
- [ ] **`resources/js/Components/QuoteCard.jsx`**
  - [ ] Quote text
  - [ ] Page number
  - [ ] Note
- [ ] **`resources/js/Components/ReadingProgress.jsx`**
  - [ ] Books read this year
  - [ ] Pages read
  - [ ] Charts

#### Translations
- [ ] Add books translations (EN/AR)

---

## 🎯 PHASE 5: Comments & Reactions

### 5.1 Comments System

#### Backend
- [ ] Configure Comment model (polymorphic)
- [ ] `php artisan make:request StoreCommentRequest`
- [ ] `php artisan make:controller CommentController`
- [ ] Routes for comments
- [ ] Admin moderation page

#### Frontend
- [ ] **`resources/js/Components/CommentList.jsx`**
  - [ ] Display nested comments
  - [ ] Reply button
  - [ ] Pagination
- [ ] **`resources/js/Components/CommentForm.jsx`**
  - [ ] Textarea
  - [ ] Submit button
  - [ ] Login prompt for guests
- [ ] **`resources/js/Components/CommentItem.jsx`**
  - [ ] User avatar
  - [ ] Username, timestamp
  - [ ] Comment content
  - [ ] Reply/React buttons
  - [ ] Nested replies
- [ ] Translations

### 5.2 Reactions System

#### Backend
- [ ] Configure Reaction model (polymorphic)
- [ ] Reactable trait implementation
- [ ] Reactor trait for User
- [ ] `php artisan make:controller ReactionController`
- [ ] Routes

#### Frontend
- [ ] **`resources/js/Components/ReactionButtons.jsx`**
  - [ ] Icons for: like, love, laugh, wow, sad, angry
  - [ ] Active state
  - [ ] Count display
  - [ ] Click handler
- [ ] **`resources/js/Components/ReactionSummary.jsx`**
  - [ ] Total reactions
  - [ ] Breakdown by type
- [ ] Translations

---

## 🎯 PHASE 6: Portfolio Content (Skills, Experience, Education)

### 6.1 Skills Module

#### Backend
- [ ] Configure Skill model
- [ ] `php artisan make:request StoreSkillRequest`
- [ ] `php artisan make:controller SkillController`
- [ ] Routes

#### Frontend
- [ ] **`resources/js/Pages/About/Skills.jsx`**
  - [ ] Skills grouped by category
  - [ ] Proficiency bars
  - [ ] Icons
- [ ] **Admin pages** for CRUD
- [ ] **`resources/js/Components/SkillCard.jsx`**
- [ ] **`resources/js/Components/ProficiencyBar.jsx`**
- [ ] Translations

### 6.2 Experience Module

#### Backend
- [ ] Configure Experience model
- [ ] `php artisan make:request StoreExperienceRequest`
- [ ] `php artisan make:controller ExperienceController`
- [ ] Routes

#### Frontend
- [ ] **`resources/js/Pages/About/Experience.jsx`**
  - [ ] Timeline view
  - [ ] Current position indicator
- [ ] **Admin pages** for CRUD
- [ ] **`resources/js/Components/ExperienceTimeline.jsx`**
- [ ] **`resources/js/Components/ExperienceCard.jsx`**
- [ ] Translations

### 6.3 Education Module

#### Backend
- [ ] Configure Education model
- [ ] `php artisan make:request StoreEducationRequest`
- [ ] `php artisan make:controller EducationController`
- [ ] Routes

#### Frontend
- [ ] **`resources/js/Pages/About/Education.jsx`**
- [ ] **Admin pages** for CRUD
- [ ] **`resources/js/Components/EducationCard.jsx`**
- [ ] Translations

---

## 🎯 PHASE 7: Contact & Analytics

### 7.1 Contact Module

#### Backend
- [ ] Configure ContactMessage model
- [ ] `php artisan make:request StoreContactMessageRequest`
- [ ] `php artisan make:controller ContactController`
- [ ] Email notification to admin
- [ ] Spam protection (rate limiting)
- [ ] Routes

#### Frontend
- [ ] **`resources/js/Pages/Contact/Index.jsx`**
  - [ ] Contact form
  - [ ] Social links
  - [ ] Location/info
- [ ] **`resources/js/Pages/Admin/Messages/Index.jsx`**
  - [ ] Messages table
  - [ ] Status filter
  - [ ] Read/Reply actions
- [ ] **`resources/js/Components/ContactForm.jsx`**
- [ ] Translations

### 7.2 Analytics (Page Views)

#### Backend
- [ ] Configure PageView model
- [ ] Viewable trait implementation
- [ ] Middleware to track views
- [ ] Analytics service
- [ ] Routes

#### Frontend
- [ ] **`resources/js/Pages/Admin/Analytics/Index.jsx`**
  - [ ] Dashboard with charts
  - [ ] Popular content
  - [ ] Traffic sources
- [ ] **`resources/js/Components/ViewsChart.jsx`**
- [ ] **`resources/js/Components/PopularContent.jsx`**

---

## 🎯 PHASE 8: Main Pages & Layout

### 8.1 Public Pages

- [ ] **`resources/js/Pages/Home.jsx`**
  - [ ] Hero section with intro
  - [ ] Featured projects
  - [ ] Latest blog posts
  - [ ] Skills overview
  - [ ] Contact CTA

- [ ] **`resources/js/Pages/About.jsx`**
  - [ ] Bio
  - [ ] Photo
  - [ ] Skills
  - [ ] Experience timeline
  - [ ] Education
  - [ ] Social links

- [ ] **`resources/js/Pages/Contact.jsx`**
  - [ ] Contact form
  - [ ] Social media links
  - [ ] Email, location

### 8.2 Admin Dashboard

- [ ] **`resources/js/Pages/Admin/Dashboard.jsx`**
  - [ ] Stats cards (total projects, posts, comments, messages)
  - [ ] Recent activity
  - [ ] Quick actions
  - [ ] Analytics summary

### 8.3 Layouts

- [ ] **`resources/js/Layouts/GuestLayout.jsx`**
  - [ ] Header with navigation
  - [ ] Main content
  - [ ] Footer
  - [ ] Theme toggle
  - [ ] Language toggle

- [ ] **`resources/js/Layouts/AuthenticatedLayout.jsx`**
  - [ ] Admin sidebar
  - [ ] Header
  - [ ] Main content
  - [ ] Breadcrumbs

### 8.4 Shared Components

- [ ] **`resources/js/Components/Header.jsx`**
  - [ ] Logo
  - [ ] Navigation menu (Home, About, Projects, Blog, Books, Contact)
  - [ ] Theme toggle
  - [ ] Language toggle
  - [ ] Mobile menu

- [ ] **`resources/js/Components/Footer.jsx`**
  - [ ] Copyright
  - [ ] Social links
  - [ ] Quick links

- [ ] **`resources/js/Components/ThemeToggle.jsx`**
  - [ ] Dark/Light switch
  - [ ] Icon

- [ ] **`resources/js/Components/LanguageToggle.jsx`**
  - [ ] EN/AR switch

- [ ] **`resources/js/Components/ShareButtons.jsx`**
  - [ ] Twitter, Facebook, LinkedIn, Copy link

- [ ] **`resources/js/Components/Breadcrumbs.jsx`**

- [ ] **`resources/js/Components/Pagination.jsx`**
  - [ ] Inertia pagination links

- [ ] **`resources/js/Components/SearchBar.jsx`**

- [ ] **`resources/js/Components/LoadingSpinner.jsx`**

- [ ] **`resources/js/Components/EmptyState.jsx`**

---

## 🎯 PHASE 9: i18n & Theming

### 9.1 Translations

- [ ] Set up react-i18next
- [ ] Create translation structure
- [ ] **`resources/js/i18n/locales/en.json`** (complete all modules)
- [ ] **`resources/js/i18n/locales/ar.json`** (complete all modules)
- [ ] RTL support for Arabic
- [ ] Language persistence (localStorage)

### 9.2 Theme System

- [ ] Configure Tailwind dark mode
- [ ] shadcn/ui theme customization
- [ ] Custom color palette
- [ ] Theme context
- [ ] Theme persistence (localStorage)
- [ ] Smooth transitions

---

## 🎯 PHASE 10: SEO & Performance

### 10.1 SEO

- [ ] Dynamic meta tags with Inertia Head
- [ ] Open Graph tags for social sharing
- [ ] Twitter Card tags
- [ ] Schema.org markup (Article, Person, Organization)
- [ ] `php artisan make:command GenerateSitemap`
- [ ] Sitemap generation
- [ ] robots.txt
- [ ] Canonical URLs

### 10.2 Performance

- [ ] Image optimization
  - [ ] WebP conversion
  - [ ] Responsive images
  - [ ] Lazy loading
- [ ] Database optimization
  - [ ] Eager loading
  - [ ] Query optimization
  - [ ] Indexes
- [ ] Caching
  - [ ] Route caching
  - [ ] Config caching
  - [ ] View caching (if needed)
- [ ] Asset optimization
  - [ ] Vite build optimization
  - [ ] CSS purging
  - [ ] Code splitting

### 10.3 Accessibility

- [ ] ARIA labels on interactive elements
- [ ] Keyboard navigation
- [ ] Focus indicators
- [ ] Alt text on images
- [ ] Color contrast (WCAG AA)
- [ ] Screen reader testing

---

## 🎯 PHASE 11: Testing & QA

### 11.1 Backend Testing

- [ ] Feature tests for each module
- [ ] Unit tests for traits/services
- [ ] Policy tests
- [ ] Validation tests
- [ ] Run: `php artisan test`

### 11.2 Frontend Testing

- [ ] Manual testing checklist
  - [ ] All CRUD operations
  - [ ] Form validation
  - [ ] Authentication flow
  - [ ] Dark/Light theme
  - [ ] EN/AR language switch
  - [ ] Responsive design
  - [ ] Browser compatibility

### 11.3 Cross-browser Testing

- [ ] Chrome
- [ ] Firefox
- [ ] Safari
- [ ] Edge
- [ ] Mobile browsers (iOS Safari, Chrome Mobile)

### 11.4 Performance Testing

- [ ] Lighthouse audit
- [ ] Page speed insights
- [ ] Database query profiling (Laravel Debugbar)

---

## 🎯 PHASE 12: Deployment

### 12.1 Pre-deployment

- [ ] Environment variables review
- [ ] Database backup
- [ ] Remove debug code
- [ ] Run: `npm run build`
- [ ] Run: `php artisan optimize`
- [ ] Run: `php artisan config:cache`
- [ ] Run: `php artisan route:cache`

### 12.2 Deployment Steps

- [ ] Set up hosting (VPS/shared/cloud)
- [ ] Configure web server (Nginx/Apache)
- [ ] SSL certificate (Let's Encrypt)
- [ ] Deploy code
- [ ] Run migrations on production
- [ ] Configure cron jobs (if needed)
- [ ] Set up backups

### 12.3 Post-deployment

- [ ] Test all features on production
- [ ] Monitor error logs
- [ ] Set up monitoring (Sentry, LogRocket)
- [ ] Google Analytics integration
- [ ] Submit sitemap to Google Search Console

---

## 📊 Progress Tracking

### Overall Completion: 0%

- [ ] Phase 1: Foundation (0/30 tasks)
- [ ] Phase 2: Projects (0/45 tasks)
- [ ] Phase 3: Blog (0/40 tasks)
- [ ] Phase 4: Books (0/25 tasks)
- [ ] Phase 5: Comments & Reactions (0/15 tasks)
- [ ] Phase 6: Portfolio Content (0/20 tasks)
- [ ] Phase 7: Contact & Analytics (0/15 tasks)
- [ ] Phase 8: Main Pages (0/25 tasks)
- [ ] Phase 9: i18n & Theming (0/10 tasks)
- [ ] Phase 10: SEO & Performance (0/15 tasks)
- [ ] Phase 11: Testing (0/20 tasks)
- [ ] Phase 12: Deployment (0/15 tasks)

**Total Tasks:** ~275  
**Completed:** 0

---

## 🚀 Quick Start Commands

```bash
# Start development
composer run dev:win

# OR separately
php artisan serve
npm run dev

# Create a new feature
php artisan make:model Feature -mcr

# Add shadcn component
npx shadcn@latest add button

# Run migrations
php artisan migrate

# Run tests
php artisan test

# Build for production
npm run build
```

---

## 📝 Notes

- Start with **Phase 2 (Projects)** for quickest MVP
- **Books module** is the newest addition - implement after core features
- **Polymorphic relations** (Comments, Reactions) require careful testing
- **Image uploads** need proper validation and storage configuration
- **RTL support** for Arabic requires CSS adjustments
- **Admin middleware** must be tested thoroughly for security

---

**Happy Coding! 🚀**
