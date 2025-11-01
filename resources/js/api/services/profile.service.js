import { router } from '@inertiajs/react';
import API_ENDPOINTS from '../endpoints';

/**
 * Profile Service
 * Handles all profile-related operations using Inertia.js router
 */
const profileService = {
    /**
     * Update basic user information (name, email)
     * @param {Object} data - User data {name, email}
     * @param {Object} options - Inertia options
     */
    updateBasic(data, options = {}) {
        return router.patch(API_ENDPOINTS.PROFILE.UPDATE_BASIC, data, {
            preserveScroll: true,
            preserveState: true,
            onSuccess: () => {
                // Reload auth data to update profile completion
                router.reload({ only: ['auth'] });
            },
            ...options,
        });
    },

    /**
     * Update advanced profile information (bio, location, social links)
     * @param {Object} data - Profile data
     * @param {Object} options - Inertia options
     */
    updateAdvanced(data, options = {}) {
        return router.put(API_ENDPOINTS.PROFILE.UPDATE_ADVANCED, data, {
            preserveScroll: true,
            preserveState: true,
            onSuccess: () => {
                // Reload auth data to update profile completion
                router.reload({ only: ['auth'] });
            },
            ...options,
        });
    },

    /**
     * Upload user avatar
     * @param {File} file - Avatar file
     * @param {Object} userData - Required user data {name, email, bio, location, website, github_url, linkedin_url, twitter_url}
     * @param {Object} options - Inertia options
     */
    uploadAvatar(file, _userData, options = {}) {
        const formData = new FormData();
        formData.append('avatar', file);
        // Explicit method override for Laravel when using multipart, matching avatar route (PATCH)
        formData.append('_method', 'PATCH');

        return router.post(API_ENDPOINTS.PROFILE.UPDATE_AVATAR, formData, {
            forceFormData: true,
            preserveScroll: true,
            preserveState: true,
            onSuccess: () => {
                // Reload auth data to update profile completion
                router.reload({ only: ['auth'] });
            },
            ...options,
        });
    },

    /**
     * Remove user avatar
     * @param {Object} options - Inertia options
     */
    removeAvatar(options = {}) {
        return router.delete(API_ENDPOINTS.PROFILE.REMOVE_AVATAR, {
            preserveScroll: true,
            onSuccess: () => {
                // Reload auth data to update profile completion
                router.reload({ only: ['auth'] });
            },
            ...options,
        });
    },

    /**
     * Update password
     * @param {Object} data - Password data {current_password, password, password_confirmation}
     * @param {Object} options - Inertia options
     */
    updatePassword(data, options = {}) {
        return router.put(API_ENDPOINTS.PROFILE.UPDATE_PASSWORD, data, {
            preserveScroll: true,
            preserveState: true,
            ...options,
        });
    },

    /**
     * Delete user account
     * @param {string} password - User password for confirmation
     * @param {Object} options - Inertia options
     */
    deleteAccount(password, options = {}) {
        return router.delete(API_ENDPOINTS.PROFILE.DELETE, {
            data: { password },
            ...options,
        });
    },
};

export default profileService;
