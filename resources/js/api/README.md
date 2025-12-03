# API Module

This module provides a centralized way to interact with the backend API.

## Architecture

The API layer is designed to work with Laravel's dual controller structure:

| Type | Controllers | Response | Use Case |
|------|-------------|----------|----------|
| **Web** | `Web/*Controller` | Inertia/Redirect | Page navigation, form submission with redirect |
| **API** | `Api/*Controller` | JSON | Data fetching, SPA-like updates, AJAX |

## Structure

```
api/
├── axios.js           # Axios clients (apiClient + webClient)
├── endpoints.js       # API & Web endpoint constants
├── index.js           # Main export file
└── services/          # API services (JSON responses)
    ├── posts.service.js
    ├── projects.service.js
    ├── users.service.js
    ├── skills.service.js
    ├── experiences.service.js
    ├── educations.service.js
    ├── testimonials.service.js
    ├── contact.service.js
    └── profile.service.js
```

## Quick Start

### Using API Services

```javascript
import API from '@/api';

// Fetch posts
const posts = await API.posts.getAll({ page: 1, per_page: 12 });

// Get a single project
const project = await API.projects.getBySlug('my-project');

// Create a skill
const skill = await API.skills.create({ name: 'React', level: 90 });
```

### Using Hooks (Recommended)

```javascript
import { usePosts, useProject, useSkillActions } from '@/hooks';

// Fetch posts with pagination
function PostsList() {
    const { data, loading, nextPage, search } = usePosts();
    
    if (loading) return <Spinner />;
    return <PostGrid posts={data} />;
}

// Fetch single project
function ProjectPage({ slug }) {
    const { data: project, loading } = useProject(slug);
    
    if (loading) return <Spinner />;
    return <ProjectDetail project={project} />;
}

// CRUD operations
function SkillForm() {
    const { create, loading } = useSkillActions();
    
    const handleSubmit = async (data) => {
        await create(data);
    };
    
    return <form onSubmit={handleSubmit}>...</form>;
}
```

## Endpoints

### API Endpoints (JSON - `/api/v1/...`)

Use these for data fetching without page reload:

```javascript
import { API_ENDPOINTS } from '@/api';

API_ENDPOINTS.POSTS.LIST              // '/posts'
API_ENDPOINTS.POSTS.VIEW(1)           // '/posts/1'
API_ENDPOINTS.PROJECTS.VIEW('slug')   // '/projects/slug'
API_ENDPOINTS.SKILLS.CREATE           // '/skills'
```

### Web Endpoints (Inertia - Page Navigation)

Use these for page redirects with Inertia:

```javascript
import { WEB_ENDPOINTS } from '@/api';

WEB_ENDPOINTS.POSTS.LIST              // '/blog'
WEB_ENDPOINTS.ADMIN.POSTS.CREATE      // '/admin/blog/create'
WEB_ENDPOINTS.ADMIN.USERS.EDIT(1)     // '/admin/users/1/edit'
```

## Available Services

### Posts Service

```javascript
import { postsService } from '@/api';

// Methods
postsService.getAll(params)           // Get paginated posts
postsService.getById(id)              // Get single post
postsService.create(data)             // Create post
postsService.update(id, data)         // Update post
postsService.delete(id)               // Delete post
postsService.toggleFeatured(id)       // Toggle featured status
postsService.publish(id)              // Publish post
postsService.unpublish(id)            // Unpublish post
postsService.search(query)            // Search posts
postsService.getFeatured(limit)       // Get featured posts
```

### Projects Service

```javascript
import { projectsService } from '@/api';

projectsService.getAll(params)        // Get all projects
projectsService.getBySlug(slug)       // Get by slug
projectsService.create(data)          // Create project
projectsService.update(id, data)      // Update project
projectsService.delete(id)            // Delete project
projectsService.getFeatured(limit)    // Get featured
```

### Users Service (Admin)

```javascript
import { usersService } from '@/api';

usersService.getAll(params)           // Get all users
usersService.getById(id)              // Get single user
usersService.update(id, data)         // Update user
usersService.delete(id)               // Delete user
usersService.toggleAdmin(id)          // Toggle admin status
usersService.toggleBan(id)            // Toggle ban status
```

### Skills Service

```javascript
import { skillsService } from '@/api';

skillsService.getAll(params)          // Get all skills
skillsService.getById(id)             // Get single skill
skillsService.create(data)            // Create skill
skillsService.update(id, data)        // Update skill
skillsService.delete(id)              // Delete skill
skillsService.getByCategory(cat)      // Get by category
```

### Contact Service

```javascript
import { contactService } from '@/api';

// Public
contactService.submit(data)           // Submit contact form

// Admin
contactService.getSubmissions(params) // Get all submissions
contactService.getSubmissionById(id)  // Get single submission
contactService.markAsRead(id)         // Mark as read
contactService.markAsUnread(id)       // Mark as unread
contactService.deleteSubmission(id)   // Delete submission
contactService.bulkDelete(ids)        // Bulk delete
contactService.bulkMarkAsRead(ids)    // Bulk mark read
contactService.bulkMarkAsUnread(ids)  // Bulk mark unread
```

## Custom Hooks

Located in `resources/js/hooks/`:

### Core Hooks

```javascript
import { useApi, usePaginatedApi, useMutation } from '@/hooks';

// Generic fetch hook
const { data, loading, error, refetch } = useApi(
    () => apiFunction(),
    [deps],
    { immediate: true }
);

// Paginated data hook
const { data, meta, loading, goToPage, nextPage, search } = usePaginatedApi(
    (params) => apiFunction(params),
    initialParams
);

// Mutation hook (create/update/delete)
const { mutate, loading, error } = useMutation(
    (data) => apiFunction(data),
    { onSuccess, onError }
);
```

### Resource Hooks

```javascript
// Posts
import { usePosts, usePost, useFeaturedPosts, usePostActions } from '@/hooks';

// Projects
import { useProjects, useProject, useFeaturedProjects, useProjectActions } from '@/hooks';

// Skills
import { useSkills, useSkill, useSkillActions } from '@/hooks';

// Contact
import { useContactSubmit, useContactSubmissions, useSubmissionActions } from '@/hooks';
```

## Axios Configuration

### API Client (Default)

For API routes (`/api/v1/...`):

```javascript
import apiClient from '@/api/axios';

// Preconfigured with:
// - Base URL: /api/v1
// - CSRF token
// - JSON headers
// - Error handling (401, 419, 403, 422)
```

### Web Client

For web routes (Inertia compatible):

```javascript
import { webClient } from '@/api/axios';

// Preconfigured with:
// - Base URL: /
// - CSRF token
// - JSON headers
```

## Best Practices

### 1. Use Hooks for Components

```javascript
// Good - declarative, handles loading/error
function PostsList() {
    const { data, loading, error } = usePosts();
    
    if (loading) return <Spinner />;
    if (error) return <Error message={error} />;
    return <PostGrid posts={data} />;
}
```

### 2. Use Services for Complex Logic

```javascript
// Good - in event handlers, utilities
async function exportPosts(filters) {
    const { data } = await postsService.getAll(filters);
    return generateCSV(data);
}
```

### 3. Handle Errors Properly

```javascript
const { mutate, error } = useMutation(API.posts.create, {
    onSuccess: () => toast.success('Created!'),
    onError: (err) => toast.error(err.response?.data?.message),
});
```

### 4. Use Optimistic Updates

```javascript
const { mutate } = useMutation(API.posts.delete, {
    onSuccess: () => {
        // Immediately update UI
        queryClient.invalidateQueries('posts');
    }
});
```

## When to Use API vs Web Routes

| Use API Routes | Use Web Routes |
|----------------|----------------|
| Refresh data without reload | Navigate to new page |
| Dynamic updates | Form submission with redirect |
| Search/filter results | Create/edit flows |
| Infinite scroll | Full page actions |
| Real-time updates | Authentication |

## TypeScript Support

Services and hooks are JavaScript, but easily typed:

```typescript
interface Post {
    id: number;
    title: string;
    content: string;
}

const { data } = useApi<Post[]>(() => postsService.getAll());
```
