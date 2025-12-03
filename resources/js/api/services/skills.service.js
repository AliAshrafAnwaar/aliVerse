import apiClient from '../axios';
import { API_ENDPOINTS } from '../endpoints';

/**
 * Skills API Service
 * Use for data fetching without page reload
 */
const skillsService = {
    /**
     * Get all skills with optional filters
     * @param {Object} params - Query parameters
     */
    async getAll(params = {}) {
        const response = await apiClient.get(API_ENDPOINTS.SKILLS.LIST, { params });
        return response.data;
    },

    /**
     * Get single skill by ID
     * @param {number} id - Skill ID
     */
    async getById(id) {
        const response = await apiClient.get(API_ENDPOINTS.SKILLS.VIEW(id));
        return response.data;
    },

    /**
     * Create new skill
     * @param {Object} data - Skill data
     */
    async create(data) {
        const formData = createFormData(data);
        const response = await apiClient.post(API_ENDPOINTS.SKILLS.CREATE, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        return response.data;
    },

    /**
     * Update skill
     * @param {number} id - Skill ID
     * @param {Object} data - Skill data
     */
    async update(id, data) {
        const formData = createFormData(data);
        formData.append('_method', 'PUT');
        const response = await apiClient.post(API_ENDPOINTS.SKILLS.UPDATE(id), formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        return response.data;
    },

    /**
     * Delete skill
     * @param {number} id - Skill ID
     */
    async delete(id) {
        const response = await apiClient.delete(API_ENDPOINTS.SKILLS.DELETE(id));
        return response.data;
    },

    /**
     * Get skills by category
     * @param {string} category - Category name
     */
    async getByCategory(category, params = {}) {
        return this.getAll({ ...params, category });
    },

    /**
     * Get featured skills
     */
    async getFeatured(params = {}) {
        return this.getAll({ ...params, featured: true });
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
        } else {
            formData.append(key, data[key]);
        }
    });
    
    return formData;
}

export default skillsService;
