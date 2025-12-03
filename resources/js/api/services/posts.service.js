import apiClient from '../axios';
import { API_ENDPOINTS } from '../endpoints';

/**
 * Posts API Service
 * Use for data fetching without page reload
 */
const postsService = {
    /**
     * Get all posts with optional filters
     * @param {Object} params - Query parameters
     * @param {string} params.search - Search query
     * @param {number} params.category - Category ID
     * @param {boolean} params.featured - Filter featured posts
     * @param {number} params.per_page - Items per page
     * @param {number} params.page - Page number
     */
    async getAll(params = {}) {
        const response = await apiClient.get(API_ENDPOINTS.POSTS.LIST, { params });
        return response.data;
    },

    /**
     * Get single post by ID
     * @param {number} id - Post ID
     */
    async getById(id) {
        const response = await apiClient.get(API_ENDPOINTS.POSTS.VIEW(id));
        return response.data;
    },

    /**
     * Create new post
     * @param {Object} data - Post data
     */
    async create(data) {
        const formData = createFormData(data);
        const response = await apiClient.post(API_ENDPOINTS.POSTS.CREATE, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        return response.data;
    },

    /**
     * Update existing post
     * @param {number} id - Post ID
     * @param {Object} data - Post data
     */
    async update(id, data) {
        const formData = createFormData(data);
        formData.append('_method', 'PUT');
        const response = await apiClient.post(API_ENDPOINTS.POSTS.UPDATE(id), formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        return response.data;
    },

    /**
     * Delete post
     * @param {number} id - Post ID
     */
    async delete(id) {
        const response = await apiClient.delete(API_ENDPOINTS.POSTS.DELETE(id));
        return response.data;
    },

    /**
     * Toggle featured status
     * @param {number} id - Post ID
     */
    async toggleFeatured(id) {
        const response = await apiClient.post(API_ENDPOINTS.POSTS.TOGGLE_FEATURED(id));
        return response.data;
    },

    /**
     * Publish post
     * @param {number} id - Post ID
     */
    async publish(id) {
        const response = await apiClient.post(API_ENDPOINTS.POSTS.PUBLISH(id));
        return response.data;
    },

    /**
     * Unpublish post
     * @param {number} id - Post ID
     */
    async unpublish(id) {
        const response = await apiClient.post(API_ENDPOINTS.POSTS.UNPUBLISH(id));
        return response.data;
    },

    /**
     * Search posts
     * @param {string} query - Search query
     * @param {Object} params - Additional parameters
     */
    async search(query, params = {}) {
        return this.getAll({ ...params, search: query });
    },

    /**
     * Get featured posts
     * @param {number} limit - Number of posts
     */
    async getFeatured(limit = 5) {
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
        
        if (data[key] instanceof File) {
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

export default postsService;
