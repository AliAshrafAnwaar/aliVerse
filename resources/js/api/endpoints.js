/**
 * API Endpoints Configuration
 * Centralized endpoint management for the application
 * 
 * WEB_ENDPOINTS: For Inertia navigation (page redirects)
 * API_ENDPOINTS: For AJAX/fetch (JSON responses, data refresh without reload)
 */

// ============================================
// WEB ENDPOINTS (Inertia - Page Navigation)
// ============================================
export const WEB_ENDPOINTS = {
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

    // Public Pages
    HOME: '/',
    PORTFOLIO: '/portfolio',
    
    // Projects (Public)
    PROJECTS: {
        LIST: '/projects',
        VIEW: (slug) => `/projects/${slug}`,
    },

    // Blog (Public)
    POSTS: {
        LIST: '/blog',
        VIEW: (slug) => `/blog/${slug}`,
    },

    // Contact (Public)
    CONTACT: {
        INDEX: '/contact',
        SUBMIT: '/contact',
    },

    // Admin Routes
    ADMIN: {
        DASHBOARD: '/admin',
        
        // Projects
        PROJECTS: {
            LIST: '/admin/projects',
            CREATE: '/admin/projects/create',
            STORE: '/admin/projects',
            VIEW: (id) => `/admin/projects/${id}`,
            EDIT: (id) => `/admin/projects/${id}/edit`,
            UPDATE: (id) => `/admin/projects/${id}`,
            DELETE: (id) => `/admin/projects/${id}`,
        },

        // Blog Posts
        POSTS: {
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

        // Users
        USERS: {
            LIST: '/admin/users',
            VIEW: (id) => `/admin/users/${id}`,
            EDIT: (id) => `/admin/users/${id}/edit`,
            UPDATE: (id) => `/admin/users/${id}`,
            DELETE: (id) => `/admin/users/${id}`,
            TOGGLE_ADMIN: (id) => `/admin/users/${id}/toggle-admin`,
            TOGGLE_BAN: (id) => `/admin/users/${id}/toggle-ban`,
        },

        // Skills
        SKILLS: {
            LIST: '/admin/skills',
            CREATE: '/admin/skills/create',
            STORE: '/admin/skills',
            VIEW: (id) => `/admin/skills/${id}`,
            EDIT: (id) => `/admin/skills/${id}/edit`,
            UPDATE: (id) => `/admin/skills/${id}`,
            DELETE: (id) => `/admin/skills/${id}`,
        },

        // Experiences
        EXPERIENCES: {
            LIST: '/admin/experiences',
            CREATE: '/admin/experiences/create',
            STORE: '/admin/experiences',
            VIEW: (id) => `/admin/experiences/${id}`,
            EDIT: (id) => `/admin/experiences/${id}/edit`,
            UPDATE: (id) => `/admin/experiences/${id}`,
            DELETE: (id) => `/admin/experiences/${id}`,
        },

        // Education
        EDUCATIONS: {
            LIST: '/admin/educations',
            CREATE: '/admin/educations/create',
            STORE: '/admin/educations',
            VIEW: (id) => `/admin/educations/${id}`,
            EDIT: (id) => `/admin/educations/${id}/edit`,
            UPDATE: (id) => `/admin/educations/${id}`,
            DELETE: (id) => `/admin/educations/${id}`,
        },

        // Testimonials
        TESTIMONIALS: {
            LIST: '/admin/testimonials',
            CREATE: '/admin/testimonials/create',
            STORE: '/admin/testimonials',
            VIEW: (id) => `/admin/testimonials/${id}`,
            EDIT: (id) => `/admin/testimonials/${id}/edit`,
            UPDATE: (id) => `/admin/testimonials/${id}`,
            DELETE: (id) => `/admin/testimonials/${id}`,
        },

        // Contact Submissions
        CONTACT_SUBMISSIONS: {
            LIST: '/admin/contact-submissions',
            VIEW: (id) => `/admin/contact-submissions/${id}`,
            DELETE: (id) => `/admin/contact-submissions/${id}`,
            MARK_READ: (id) => `/admin/contact-submissions/${id}/mark-read`,
            MARK_UNREAD: (id) => `/admin/contact-submissions/${id}/mark-unread`,
            BULK_DELETE: '/admin/contact-submissions/bulk-delete',
            BULK_MARK_READ: '/admin/contact-submissions/bulk-mark-read',
            BULK_MARK_UNREAD: '/admin/contact-submissions/bulk-mark-unread',
        },

        // Contact Info
        CONTACT: {
            EDIT: '/admin/contact/edit',
            UPDATE: '/admin/contact',
        },
    },
};

// ============================================
// API ENDPOINTS (JSON - Data Refresh)
// ============================================
// Note: These are relative to /api/v1
export const API_ENDPOINTS = {
    // Posts
    POSTS: {
        LIST: '/posts',
        VIEW: (id) => `/posts/${id}`,
        CREATE: '/posts',
        UPDATE: (id) => `/posts/${id}`,
        DELETE: (id) => `/posts/${id}`,
        TOGGLE_FEATURED: (id) => `/posts/${id}/toggle-featured`,
        PUBLISH: (id) => `/posts/${id}/publish`,
        UNPUBLISH: (id) => `/posts/${id}/unpublish`,
    },

    // Projects
    PROJECTS: {
        LIST: '/projects',
        VIEW: (slug) => `/projects/${slug}`,
        CREATE: '/projects',
        UPDATE: (id) => `/projects/${id}`,
        DELETE: (id) => `/projects/${id}`,
    },

    // Users
    USERS: {
        LIST: '/users',
        VIEW: (id) => `/users/${id}`,
        UPDATE: (id) => `/users/${id}`,
        DELETE: (id) => `/users/${id}`,
        TOGGLE_ADMIN: (id) => `/users/${id}/toggle-admin`,
        TOGGLE_BAN: (id) => `/users/${id}/toggle-ban`,
    },

    // Skills
    SKILLS: {
        LIST: '/skills',
        VIEW: (id) => `/skills/${id}`,
        CREATE: '/skills',
        UPDATE: (id) => `/skills/${id}`,
        DELETE: (id) => `/skills/${id}`,
    },

    // Experiences
    EXPERIENCES: {
        LIST: '/experiences',
        VIEW: (id) => `/experiences/${id}`,
        CREATE: '/experiences',
        UPDATE: (id) => `/experiences/${id}`,
        DELETE: (id) => `/experiences/${id}`,
    },

    // Education
    EDUCATIONS: {
        LIST: '/educations',
        VIEW: (id) => `/educations/${id}`,
        CREATE: '/educations',
        UPDATE: (id) => `/educations/${id}`,
        DELETE: (id) => `/educations/${id}`,
    },

    // Testimonials
    TESTIMONIALS: {
        LIST: '/testimonials',
        VIEW: (id) => `/testimonials/${id}`,
        CREATE: '/testimonials',
        UPDATE: (id) => `/testimonials/${id}`,
        DELETE: (id) => `/testimonials/${id}`,
    },

    // Contact
    CONTACT: {
        SUBMIT: '/contact',
    },

    // Contact Submissions
    CONTACT_SUBMISSIONS: {
        LIST: '/contact-submissions',
        VIEW: (id) => `/contact-submissions/${id}`,
        DELETE: (id) => `/contact-submissions/${id}`,
        MARK_READ: (id) => `/contact-submissions/${id}/mark-read`,
        MARK_UNREAD: (id) => `/contact-submissions/${id}/mark-unread`,
        BULK_DELETE: '/contact-submissions/bulk-delete',
        BULK_MARK_READ: '/contact-submissions/bulk-mark-read',
        BULK_MARK_UNREAD: '/contact-submissions/bulk-mark-unread',
    },
};

// Default export for backward compatibility
export default API_ENDPOINTS;
