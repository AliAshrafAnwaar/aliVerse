import apiClient from '../axios';
import { API_ENDPOINTS } from '../endpoints';

/**
 * Projects API Service
 * Use for data fetching without page reload
 */
const projectsService = {
    /**
     * Get all projects with optional filters
     * @param {Object} params - Query parameters
     */
    async getAll(params = {}) {
        const response = await apiClient.get(API_ENDPOINTS.PROJECTS.LIST, { params });
        return response.data;
    },

    /**
     * Get single project by slug
     * @param {string} slug - Project slug
     */
    async getBySlug(slug) {
        const response = await apiClient.get(API_ENDPOINTS.PROJECTS.VIEW(slug));
        return response.data;
    },

    /**
     * Create new project
     * @param {Object} data - Project data
     */
    async create(data) {
        const formData = createFormData(data);
        const response = await apiClient.post(API_ENDPOINTS.PROJECTS.CREATE, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        return response.data;
    },

    /**
     * Update existing project
     * @param {number} id - Project ID
     * @param {Object} data - Project data
     */
    async update(id, data) {
        const formData = createFormData(data);
        formData.append('_method', 'PUT');
        const response = await apiClient.post(API_ENDPOINTS.PROJECTS.UPDATE(id), formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        return response.data;
    },

    /**
     * Delete project
     * @param {number} id - Project ID
     */
    async delete(id) {
        const response = await apiClient.delete(API_ENDPOINTS.PROJECTS.DELETE(id));
        return response.data;
    },

    /**
     * Search projects
     * @param {string} query - Search query
     */
    async search(query, params = {}) {
        return this.getAll({ ...params, search: query });
    },

    /**
     * Get featured projects
     * @param {number} limit - Number of projects
     */
    async getFeatured(limit = 6) {
        return this.getAll({ featured: true, per_page: limit });
    },
};

/**
 * Helper: Create FormData from object
 */
function createFormData(data) {
    const formData = new FormData();
    
    Object.keys(data).forEach(key => {
        if (data[key] === undefined || data[key] === null) return;
        
        if (key === 'gallery_images' && Array.isArray(data[key])) {
            data[key].forEach((file, index) => {
                formData.append(`gallery_images[${index}]`, file);
            });
        } else if (data[key] instanceof File) {
            formData.append(key, data[key]);
        } else if (Array.isArray(data[key])) {
            data[key].forEach((item, index) => {
                formData.append(`${key}[${index}]`, item);
            });
        } else if (typeof data[key] === 'object') {
            formData.append(key, JSON.stringify(data[key]));
        } else {
            formData.append(key, data[key]);
        }
    });
    
    return formData;
}

export default projectsService;
