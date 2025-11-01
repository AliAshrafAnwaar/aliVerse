# aliVerse Portfolio - Complete Implementation Plan

## Project Overview

**Tech Stack:**
- Backend: Laravel 12 with Sanctum authentication
- Frontend: React 19 with Inertia.js (SPA without separate API)
- Database: PostgreSQL with Eloquent ORM
- UI Framework: shadcn/ui with Tailwind CSS v3.4
- Theming: Dark/Light mode support with custom color system
- i18n: Multi-language support (EN/AR) with react-i18next
- Icons: Lucide React
- State Management: React hooks + Inertia props

**Architecture Notes:**
- **NOT** separate React API - Using Inertia.js for seamless SPA experience
- Server-side rendering with Laravel controllers
- Component-based UI with shadcn/ui
- Polymorphic relationships for comments and reactions
- Multi-tenant ready (organization_id fields included)

---

## Database Schema

### Core Tables

#### users
```sql
CREATE TABLE users (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    email_verified_at TIMESTAMP NULL,
    password VARCHAR(255) NOT NULL,
    avatar VARCHAR(255) NULL,
    bio TEXT NULL,
    location VARCHAR(255) NULL,
    website VARCHAR(255) NULL,
    github_url VARCHAR(255) NULL,
    linkedin_url VARCHAR(255) NULL,
    twitter_url VARCHAR(255) NULL,
    is_admin BOOLEAN DEFAULT FALSE,
    remember_token VARCHAR(100) NULL,
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL
);
```

#### projects
```sql
CREATE TABLE projects (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT NOT NULL,
    content LONGTEXT,
    image VARCHAR(255) NULL,
    demo_url VARCHAR(255) NULL,
    github_url VARCHAR(255) NULL,
    technologies JSON,
    featured BOOLEAN DEFAULT FALSE,
    status ENUM('draft', 'published', 'archived') DEFAULT 'draft',
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL
);
```

#### project_images
```sql
CREATE TABLE project_images (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    project_id BIGINT UNSIGNED NOT NULL,
    image_path VARCHAR(255) NOT NULL,
    alt_text VARCHAR(255) NULL,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL,
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
);
```

#### categories
```sql
CREATE TABLE categories (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT NULL,
    image VARCHAR(255) NULL,
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL
);
```

#### tags
```sql
CREATE TABLE tags (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL
);
```

#### posts (Blog)
```sql
CREATE TABLE posts (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NOT NULL,
    category_id BIGINT UNSIGNED NULL,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    excerpt TEXT NULL,
    content LONGTEXT NOT NULL,
    featured_image VARCHAR(255) NULL,
    meta_description VARCHAR(160) NULL,
    meta_keywords VARCHAR(255) NULL,
    status ENUM('draft', 'published', 'scheduled', 'archived') DEFAULT 'draft',
    featured BOOLEAN DEFAULT FALSE,
    published_at TIMESTAMP NULL,
    views_count INTEGER DEFAULT 0,
    reading_time INTEGER DEFAULT 0,
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
);
```

#### post_tag (Pivot)
```sql
CREATE TABLE post_tag (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    post_id BIGINT UNSIGNED NOT NULL,
    tag_id BIGINT UNSIGNED NOT NULL,
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL,
    FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
    FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE,
    UNIQUE KEY unique_post_tag (post_id, tag_id)
);
```

#### books (NEW)
```sql
CREATE TABLE books (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    author VARCHAR(255) NOT NULL,
    isbn VARCHAR(20) NULL,
    description TEXT NULL,
    review TEXT NULL,
    cover_image VARCHAR(255) NULL,
    amazon_url VARCHAR(255) NULL,
    goodreads_url VARCHAR(255) NULL,
    rating TINYINT DEFAULT 0, -- 1-5 stars
    status ENUM('to_read', 'reading', 'completed', 'abandoned') DEFAULT 'to_read',
    pages INTEGER NULL,
    published_year INTEGER NULL,
    language VARCHAR(10) DEFAULT 'en',
    started_at DATE NULL,
    finished_at DATE NULL,
    featured BOOLEAN DEFAULT FALSE,
    is_favorite BOOLEAN DEFAULT FALSE,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL
);
```

#### book_quotes (NEW)
```sql
CREATE TABLE book_quotes (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    book_id BIGINT UNSIGNED NOT NULL,
    quote TEXT NOT NULL,
    page_number INTEGER NULL,
    notes TEXT NULL,
    is_featured BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL,
    FOREIGN KEY (book_id) REFERENCES books(id) ON DELETE CASCADE
);
```

#### book_category (Pivot for books)
```sql
CREATE TABLE book_category (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    book_id BIGINT UNSIGNED NOT NULL,
    category_id BIGINT UNSIGNED NOT NULL,
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL,
    FOREIGN KEY (book_id) REFERENCES books(id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE,
    UNIQUE KEY unique_book_category (book_id, category_id)
);
```

#### book_tag (Pivot for books)
```sql
CREATE TABLE book_tag (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    book_id BIGINT UNSIGNED NOT NULL,
    tag_id BIGINT UNSIGNED NOT NULL,
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL,
    FOREIGN KEY (book_id) REFERENCES books(id) ON DELETE CASCADE,
    FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE,
    UNIQUE KEY unique_book_tag (book_id, tag_id)
);
```

#### comments (Polymorphic)
```sql
CREATE TABLE comments (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NOT NULL,
    parent_id BIGINT UNSIGNED NULL,
    commentable_type VARCHAR(255) NOT NULL,
    commentable_id BIGINT UNSIGNED NOT NULL,
    content TEXT NOT NULL,
    status ENUM('pending', 'approved', 'rejected', 'spam') DEFAULT 'pending',
    ip_address VARCHAR(45) NULL,
    user_agent TEXT NULL,
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (parent_id) REFERENCES comments(id) ON DELETE CASCADE,
    INDEX idx_commentable (commentable_type, commentable_id),
    INDEX idx_parent (parent_id)
);
```

#### reactions (Polymorphic)
```sql
CREATE TABLE reactions (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NOT NULL,
    reactable_type VARCHAR(255) NOT NULL,
    reactable_id BIGINT UNSIGNED NOT NULL,
    type ENUM('like', 'love', 'laugh', 'wow', 'sad', 'angry') NOT NULL,
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_reaction (user_id, reactable_type, reactable_id),
    INDEX idx_reactable (reactable_type, reactable_id)
);
```

#### skills
```sql
CREATE TABLE skills (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    proficiency_level INTEGER DEFAULT 1,
    icon VARCHAR(255) NULL,
    is_featured BOOLEAN DEFAULT FALSE,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL
);
```

#### experiences
```sql
CREATE TABLE experiences (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    company VARCHAR(255) NOT NULL,
    position VARCHAR(255) NOT NULL,
    description TEXT NULL,
    start_date DATE NOT NULL,
    end_date DATE NULL,
    is_current BOOLEAN DEFAULT FALSE,
    location VARCHAR(255) NULL,
    company_url VARCHAR(255) NULL,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL
);
```

#### educations
```sql
CREATE TABLE educations (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    institution VARCHAR(255) NOT NULL,
    degree VARCHAR(255) NOT NULL,
    field_of_study VARCHAR(255) NULL,
    description TEXT NULL,
    start_date DATE NOT NULL,
    end_date DATE NULL,
    grade VARCHAR(50) NULL,
    location VARCHAR(255) NULL,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL
);
```

#### contact_messages
```sql
CREATE TABLE contact_messages (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    subject VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    status ENUM('unread', 'read', 'replied', 'archived') DEFAULT 'unread',
    ip_address VARCHAR(45) NULL,
    user_agent TEXT NULL,
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL
);
```

#### page_views (Analytics)
```sql
CREATE TABLE page_views (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    viewable_type VARCHAR(255) NOT NULL,
    viewable_id BIGINT UNSIGNED NOT NULL,
    ip_address VARCHAR(45) NOT NULL,
    user_agent TEXT NULL,
    referrer VARCHAR(500) NULL,
    viewed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_viewable (viewable_type, viewable_id),
    INDEX idx_viewed_at (viewed_at)
);
```

---

## Frontend API Layer Structure

### API Configuration
```
resources/js/
├── api/
│   ├── index.ts                 # API setup and configuration
│   ├── endpoints.ts             # API endpoint constants
│   └── services/
│       ├── auth.service.ts      # Authentication API calls
│       ├── post.service.ts      # Blog posts API
│       ├── project.service.ts   # Projects API
│       ├── book.service.ts      # Books API (NEW)
│       ├── comment.service.ts   # Comments API
│       ├── reaction.service.ts  # Reactions API
│       ├── skill.service.ts     # Skills API
│       ├── experience.service.ts # Experience API
│       ├── education.service.ts # Education API
│       ├── contact.service.ts   # Contact API
│       └── analytics.service.ts # Analytics API
```

### Service Layer Pattern
Each service follows this pattern:
```typescript
// Example: book.service.ts
import api from './index';
import { Book, BookFormData, BookFilters } from '@/types/models';

export const bookService = {
  // CRUD operations
  getAll: (filters?: BookFilters) => api.get('/books', { params: filters }),
  getById: (id: number) => api.get(`/books/${id}`),
  create: (data: BookFormData) => api.post('/books', data),
  update: (id: number, data: BookFormData) => api.put(`/books/${id}`, data),
  delete: (id: number) => api.delete(`/books/${id}`),
  
  // Custom operations
  toggleFavorite: (id: number) => api.post(`/books/${id}/favorite`),
  updateStatus: (id: number, status: string) => api.patch(`/books/${id}/status`),
  getQuotes: (bookId: number) => api.get(`/books/${bookId}/quotes`),
  addQuote: (bookId: number, quote: any) => api.post(`/books/${bookId}/quotes`),
};
```

---

## Implementation Phases

### Phase 1: Foundation (Week 1)
1. **Database Setup**
   - Create all migrations in dependency order
   - Set up model relationships
   - Add seeders for initial data

2. **Authentication**
   - Laravel Sanctum setup
   - User registration/login
   - Profile management

3. **Core Infrastructure**
   - Base layout with theme toggle
   - Navigation components
   - Error handling

### Phase 2: Projects Module (Week 2)
1. **Backend**
   - Project CRUD with image uploads
   - Project images gallery
   - Categories and tags

2. **Frontend**
   - Project grid/list views
   - Project detail pages
   - Image gallery component

### Phase 3: Blog Module (Week 3)
1. **Backend**
   - Post CRUD with rich content
   - Category/tag management
   - SEO metadata

2. **Frontend**
   - Blog listing with pagination
   - Post detail with reading time
   - Category/tag filtering

### Phase 4: Books Module (Week 4) - NEW
1. **Backend**
   - Book CRUD with metadata
   - Quote management
   - Reading status tracking

2. **Frontend**
   - Book library with filters
   - Reading progress tracker
   - Quote collection display

### Phase 5: Interactive Features (Week 5)
1. **Comments System**
   - Polymorphic comments
   - Nested replies
   - Moderation

2. **Reactions System**
   - Polymorphic reactions
   - Real-time updates
   - Analytics

### Phase 6: Personal Info (Week 6)
1. **Skills & Experience**
   - Skills with proficiency levels
   - Work experience timeline
   - Education history

2. **Contact System**
   - Contact form
   - Message management
   - Admin panel

### Phase 7: Analytics & SEO (Week 7)
1. **Analytics**
   - Page view tracking
   - Popular content
   - User engagement metrics

2. **SEO Optimization**
   - Meta tags management
   - Sitemap generation
   - Schema markup

### Phase 8: Polish & Launch (Week 8)
1. **Performance**
   - Image optimization
   - Caching strategies
   - Lazy loading

2. **Final Touches**
   - Testing suite
   - Documentation
   - Deployment setup

---

## File Structure

### Backend (Laravel)
```
app/
├── Http/
│   ├── Controllers/
│   │   ├── Auth/
│   │   ├── ProjectController.php
│   │   ├── PostController.php
│   │   ├── BookController.php
│   │   ├── CommentController.php
│   │   ├── ReactionController.php
│   │   ├── SkillController.php
│   │   ├── ExperienceController.php
│   │   ├── EducationController.php
│   │   └── ContactController.php
│   ├── Requests/
│   └── Middleware/
├── Models/
│   ├── User.php
│   ├── Project.php
│   ├── Post.php
│   ├── Book.php
│   ├── Comment.php
│   ├── Reaction.php
│   ├── Skill.php
│   ├── Experience.php
│   └── Education.php
└── Providers/

database/
├── migrations/
├── seeders/
└── factories/

routes/
├── web.php
├── api.php
└── auth.php
```

### Frontend (React/Inertia)
```
resources/js/
├── Pages/
│   ├── Auth/
│   ├── Projects/
│   ├── Blog/
│   ├── Books/
│   ├── Profile/
│   ├── Contact/
│   └── Dashboard/
├── Components/
│   ├── ui/                    # shadcn/ui components
│   ├── layout/
│   ├── forms/
│   └── shared/
├── api/
│   ├── index.ts
│   ├── endpoints.ts
│   └── services/
├── types/
│   ├── models.ts
│   ├── api.ts
│   └── common.ts
├── hooks/
├── utils/
├── contexts/
└── i18n/
    ├── en/
    └── ar/
```

---

## Timeline Estimates

- **Full Implementation**: 6-8 weeks
- **MVP (Projects + Blog + Books)**: 3-4 weeks
- **Basic Portfolio**: 2 weeks

### Priority Order for MVP:
1. Projects (Core portfolio feature)
2. Books (Personal reading tracker)
3. Blog (Content platform)
4. Basic comments/reactions
5. Skills & experience
6. Contact form

---

## Next Steps

1. **Review this plan** and adjust scope if needed
2. **Set up development environment** with Laravel + React
3. **Start with Phase 1** - Foundation setup
4. **Follow the todo checklist** for detailed tasks
5. **Use the laravel-react-feature workflow** for each module

Each module can be developed independently following the established patterns, making it easy to prioritize features based on your timeline and requirements.