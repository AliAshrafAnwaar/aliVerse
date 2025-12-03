import apiClient from '../axios';
import { API_ENDPOINTS } from '../endpoints';

/**
 * Users API Service
 * Use for data fetching without page reload
 */
const usersService = {
    /**
     * Get all users with optional filters
     * @param {Object} params - Query parameters
     */
    async getAll(params = {}) {
        const response = await apiClient.get(API_ENDPOINTS.USERS.LIST, { params });
        return response.data;
    },

    /**
     * Get single user by ID
     * @param {number} id - User ID
     */
    async getById(id) {
        const response = await apiClient.get(API_ENDPOINTS.USERS.VIEW(id));
        return response.data;
    },

    /**
     * Update user
     * @param {number} id - User ID
     * @param {Object} data - User data
     */
    async update(id, data) {
        const response = await apiClient.put(API_ENDPOINTS.USERS.UPDATE(id), data);
        return response.data;
    },

    /**
     * Delete user
     * @param {number} id - User ID
     */
    async delete(id) {
        const response = await apiClient.delete(API_ENDPOINTS.USERS.DELETE(id));
        return response.data;
    },

    /**
     * Toggle admin status
     * @param {number} id - User ID
     */
    async toggleAdmin(id) {
        const response = await apiClient.post(API_ENDPOINTS.USERS.TOGGLE_ADMIN(id));
        return response.data;
    },

    /**
     * Toggle ban status
     * @param {number} id - User ID
     */
    async toggleBan(id) {
        const response = await apiClient.post(API_ENDPOINTS.USERS.TOGGLE_BAN(id));
        return response.data;
    },

    /**
     * Search users
     * @param {string} query - Search query
     */
    async search(query, params = {}) {
        return this.getAll({ ...params, search: query });
    },

    /**
     * Get admins only
     */
    async getAdmins(params = {}) {
        return this.getAll({ ...params, role: 'admin' });
    },
};

export default usersService;
