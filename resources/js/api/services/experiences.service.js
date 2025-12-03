import apiClient from '../axios';
import { API_ENDPOINTS } from '../endpoints';

/**
 * Experiences API Service
 * Use for data fetching without page reload
 */
const experiencesService = {
    /**
     * Get all experiences with optional filters
     * @param {Object} params - Query parameters
     */
    async getAll(params = {}) {
        const response = await apiClient.get(API_ENDPOINTS.EXPERIENCES.LIST, { params });
        return response.data;
    },

    /**
     * Get single experience by ID
     * @param {number} id - Experience ID
     */
    async getById(id) {
        const response = await apiClient.get(API_ENDPOINTS.EXPERIENCES.VIEW(id));
        return response.data;
    },

    /**
     * Create new experience
     * @param {Object} data - Experience data
     */
    async create(data) {
        const response = await apiClient.post(API_ENDPOINTS.EXPERIENCES.CREATE, data);
        return response.data;
    },

    /**
     * Update experience
     * @param {number} id - Experience ID
     * @param {Object} data - Experience data
     */
    async update(id, data) {
        const response = await apiClient.put(API_ENDPOINTS.EXPERIENCES.UPDATE(id), data);
        return response.data;
    },

    /**
     * Delete experience
     * @param {number} id - Experience ID
     */
    async delete(id) {
        const response = await apiClient.delete(API_ENDPOINTS.EXPERIENCES.DELETE(id));
        return response.data;
    },

    /**
     * Get current experiences
     */
    async getCurrent(params = {}) {
        return this.getAll({ ...params, is_current: 'true' });
    },

    /**
     * Get past experiences
     */
    async getPast(params = {}) {
        return this.getAll({ ...params, is_current: 'false' });
    },
};

export default experiencesService;
