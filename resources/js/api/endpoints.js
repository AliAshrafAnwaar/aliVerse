/**
 * API Endpoints Configuration
 * Centralized endpoint management for the application
 */

const API_ENDPOINTS = {
    // Authentication
    AUTH: {
        LOGIN: '/login',
        LOGOUT: '/logout',
        REGISTER: '/register',
        FORGOT_PASSWORD: '/forgot-password',
        RESET_PASSWORD: '/reset-password',
        VERIFY_EMAIL: '/email/verification-notification',
    },

    // Profile
    PROFILE: {
        VIEW: '/profile',
        UPDATE_BASIC: '/profile',
        UPDATE_ADVANCED: '/profile',
        UPDATE_AVATAR: '/profile/avatar',
        REMOVE_AVATAR: '/profile/avatar',
        UPDATE_PASSWORD: '/profile/password',
        DELETE: '/profile',
    },

    // Projects
    PROJECTS: {
        LIST: '/projects',
        CREATE: '/projects',
        VIEW: (id) => `/projects/${id}`,
        UPDATE: (id) => `/projects/${id}`,
        DELETE: (id) => `/projects/${id}`,
        UPLOAD_IMAGE: (id) => `/projects/${id}/images`,
        DELETE_IMAGE: (projectId, imageId) => `/projects/${projectId}/images/${imageId}`,
        // Admin routes
        ADMIN: {
            LIST: '/admin/projects',
            CREATE: '/admin/projects/create',
            STORE: '/admin/projects',
            VIEW: (id) => `/admin/projects/${id}`,
            EDIT: (id) => `/admin/projects/${id}/edit`,
            UPDATE: (id) => `/admin/projects/${id}`,
            DELETE: (id) => `/admin/projects/${id}`,
        },
    },

    // Blog Posts
    POSTS: {
        // Public routes
        LIST: '/blog',
        VIEW: (slug) => `/blog/${slug}`,
        // Admin routes
        ADMIN: {
            LIST: '/admin/blog',
            CREATE: '/admin/blog/create',
            STORE: '/admin/blog',
            EDIT: (id) => `/admin/blog/${id}/edit`,
            UPDATE: (id) => `/admin/blog/${id}`,
            DELETE: (id) => `/admin/blog/${id}`,
            TOGGLE_FEATURED: (id) => `/admin/blog/${id}/toggle-featured`,
            PUBLISH: (id) => `/admin/blog/${id}/publish`,
            UNPUBLISH: (id) => `/admin/blog/${id}/unpublish`,
        },
    },

    // Comments
    COMMENTS: {
        LIST: (type, id) => `/${type}/${id}/comments`,
        CREATE: (type, id) => `/${type}/${id}/comments`,
        UPDATE: (commentId) => `/comments/${commentId}`,
        DELETE: (commentId) => `/comments/${commentId}`,
    },

    // Reactions
    REACTIONS: {
        TOGGLE: (type, id) => `/${type}/${id}/reactions`,
        LIST: (type, id) => `/${type}/${id}/reactions`,
    },
};

export default API_ENDPOINTS;
