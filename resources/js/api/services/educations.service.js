import apiClient from '../axios';
import { API_ENDPOINTS } from '../endpoints';

/**
 * Education API Service
 * Use for data fetching without page reload
 */
const educationsService = {
    /**
     * Get all education entries with optional filters
     * @param {Object} params - Query parameters
     */
    async getAll(params = {}) {
        const response = await apiClient.get(API_ENDPOINTS.EDUCATIONS.LIST, { params });
        return response.data;
    },

    /**
     * Get single education entry by ID
     * @param {number} id - Education ID
     */
    async getById(id) {
        const response = await apiClient.get(API_ENDPOINTS.EDUCATIONS.VIEW(id));
        return response.data;
    },

    /**
     * Create new education entry
     * @param {Object} data - Education data
     */
    async create(data) {
        const response = await apiClient.post(API_ENDPOINTS.EDUCATIONS.CREATE, data);
        return response.data;
    },

    /**
     * Update education entry
     * @param {number} id - Education ID
     * @param {Object} data - Education data
     */
    async update(id, data) {
        const response = await apiClient.put(API_ENDPOINTS.EDUCATIONS.UPDATE(id), data);
        return response.data;
    },

    /**
     * Delete education entry
     * @param {number} id - Education ID
     */
    async delete(id) {
        const response = await apiClient.delete(API_ENDPOINTS.EDUCATIONS.DELETE(id));
        return response.data;
    },

    /**
     * Search education entries
     * @param {string} query - Search query
     */
    async search(query, params = {}) {
        return this.getAll({ ...params, search: query });
    },
};

export default educationsService;
