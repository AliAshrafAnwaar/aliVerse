import { router } from '@inertiajs/react';
import API_ENDPOINTS from '../endpoints';

/**
 * Project Service
 * Handles all project-related operations
 */
const projectService = {
    /**
     * Get all projects
     * @param {Object} params - Query parameters
     */
    getAll(params = {}) {
        return router.get(API_ENDPOINTS.PROJECTS.LIST, params);
    },

    /**
     * Get single project
     * @param {number} id - Project ID
     */
    getOne(id) {
        return router.get(API_ENDPOINTS.PROJECTS.VIEW(id));
    },

    /**
     * Create new project
     * @param {Object} data - Project data
     * @param {Object} options - Inertia options
     */
    create(data, options = {}) {
        return router.post(API_ENDPOINTS.PROJECTS.CREATE, data, {
            preserveScroll: true,
            ...options,
        });
    },

    /**
     * Update project
     * @param {number} id - Project ID
     * @param {Object} data - Project data
     * @param {Object} options - Inertia options
     */
    update(id, data, options = {}) {
        return router.put(API_ENDPOINTS.PROJECTS.UPDATE(id), data, {
            preserveScroll: true,
            ...options,
        });
    },

    /**
     * Delete project
     * @param {number} id - Project ID
     * @param {Object} options - Inertia options
     */
    delete(id, options = {}) {
        return router.delete(API_ENDPOINTS.PROJECTS.DELETE(id), options);
    },

    /**
     * Upload project image
     * @param {number} id - Project ID
     * @param {File} file - Image file
     * @param {Object} options - Inertia options
     */
    uploadImage(id, file, options = {}) {
        const formData = new FormData();
        formData.append('image', file);

        return router.post(API_ENDPOINTS.PROJECTS.UPLOAD_IMAGE(id), formData, {
            forceFormData: true,
            preserveScroll: true,
            ...options,
        });
    },

    /**
     * Delete project image
     * @param {number} projectId - Project ID
     * @param {number} imageId - Image ID
     * @param {Object} options - Inertia options
     */
    deleteImage(projectId, imageId, options = {}) {
        return router.delete(API_ENDPOINTS.PROJECTS.DELETE_IMAGE(projectId, imageId), options);
    },
};

export default projectService;
