# API Layer Documentation

This directory contains the API layer for the aliVerse application, following a clean architecture pattern.

## Structure

```
api/
├── axios.js              # Axios instance with interceptors
├── endpoints.js          # API endpoint constants
├── index.js             # Central export point
├── services/            # Service methods organized by feature
│   ├── profile.service.js
│   └── project.service.js
└── README.md           # This file
```

## Usage

### Import Services

```javascript
// Import specific service
import { profileService } from '@/api';

// Import all services
import API from '@/api';

// Use the service
profileService.updateBasic(data, options);
// or
API.profile.updateBasic(data, options);
```

### Import Endpoints

```javascript
import { API_ENDPOINTS } from '@/api';

console.log(API_ENDPOINTS.PROFILE.UPDATE_BASIC); // '/profile'
```

### Import Axios Instance

```javascript
import { axiosInstance } from '@/api';

axiosInstance.get('/custom-endpoint');
```

## Services

### Profile Service

Handles all profile-related operations:

- `updateBasic(data, options)` - Update name and email
- `updateAdvanced(data, options)` - Update bio, location, social links
- `uploadAvatar(file, userData, options)` - Upload profile avatar
- `removeAvatar(options)` - Remove profile avatar
- `updatePassword(data, options)` - Update password
- `deleteAccount(password, options)` - Delete user account

**Example:**

```javascript
import { profileService } from '@/api';

// Update basic information
profileService.updateBasic(
    { name: 'John Doe', email: 'john@example.com' },
    {
        onSuccess: () => console.log('Updated!'),
        onError: (errors) => console.error(errors),
    }
);

// Upload avatar
profileService.uploadAvatar(
    fileObject,
    { 
        name: user.name, 
        email: user.email,
        bio: user.bio,
        location: user.location,
        website: user.website,
        github_url: user.github_url,
        linkedin_url: user.linkedin_url,
        twitter_url: user.twitter_url,
    },
    {
        onSuccess: () => console.log('Avatar uploaded!'),
    }
);
```

### Project Service

Handles all project-related operations:

- `getAll(params)` - Get all projects
- `getOne(id)` - Get single project
- `create(data, options)` - Create new project
- `update(id, data, options)` - Update project
- `delete(id, options)` - Delete project
- `uploadImage(id, file, options)` - Upload project image
- `deleteImage(projectId, imageId, options)` - Delete project image

**Example:**

```javascript
import { projectService } from '@/api';

// Create project
projectService.create(
    {
        title: 'My Project',
        description: 'Project description',
    },
    {
        onSuccess: () => console.log('Project created!'),
    }
);
```

## Axios Configuration

The axios instance includes:

- **Base URL**: `/` (relative to current domain)
- **CSRF Token**: Automatically added from meta tag
- **Error Handling**:
  - 401: Redirect to login
  - 419: Reload page (CSRF mismatch)
- **Credentials**: Included with every request

## Endpoints

All endpoints are centralized in `endpoints.js`:

```javascript
import { API_ENDPOINTS } from '@/api';

// Profile endpoints
API_ENDPOINTS.PROFILE.UPDATE_BASIC    // '/profile'
API_ENDPOINTS.PROFILE.UPDATE_ADVANCED // '/profile'
API_ENDPOINTS.PROFILE.UPDATE_AVATAR   // '/profile'

// Project endpoints
API_ENDPOINTS.PROJECTS.LIST           // '/projects'
API_ENDPOINTS.PROJECTS.VIEW(1)        // '/projects/1'
API_ENDPOINTS.PROJECTS.UPDATE(1)      // '/projects/1'
```

## Adding New Services

1. **Create service file** in `services/` directory:

```javascript
// services/post.service.js
import { router } from '@inertiajs/react';
import API_ENDPOINTS from '../endpoints';

const postService = {
    getAll(params = {}) {
        return router.get(API_ENDPOINTS.POSTS.LIST, params);
    },
    
    create(data, options = {}) {
        return router.post(API_ENDPOINTS.POSTS.CREATE, data, options);
    },
};

export default postService;
```

2. **Add endpoints** in `endpoints.js`:

```javascript
POSTS: {
    LIST: '/posts',
    CREATE: '/posts',
    VIEW: (id) => `/posts/${id}`,
},
```

3. **Export from index**:

```javascript
export { default as postService } from './services/post.service';
```

## Best Practices

1. **Always use services** instead of direct router calls
2. **Use endpoint constants** instead of hardcoded URLs
3. **Handle errors** in component callbacks
4. **Preserve state** where appropriate:
   ```javascript
   profileService.updateBasic(data, {
       preserveScroll: true,
       preserveState: true,
       onSuccess: () => { },
       onError: (errors) => { },
   });
   ```
5. **Loading states** should be managed in components
6. **Error messages** should be displayed in UI

## Integration with Inertia.js

All services use Inertia's router for navigation and state management:

- Automatic CSRF protection
- Preserving scroll position
- Preserving component state
- Partial reloads for better UX
- Progress indicators

## TypeScript Support

To add TypeScript support, rename files to `.ts` and add type definitions:

```typescript
// services/profile.service.ts
interface UpdateBasicData {
    name: string;
    email: string;
}

const profileService = {
    updateBasic(data: UpdateBasicData, options?: any) {
        // ...
    },
};
```
