import apiClient from '../axios';
import { API_ENDPOINTS } from '../endpoints';

/**
 * Testimonials API Service
 * Use for data fetching without page reload
 */
const testimonialsService = {
    /**
     * Get all testimonials with optional filters
     * @param {Object} params - Query parameters
     */
    async getAll(params = {}) {
        const response = await apiClient.get(API_ENDPOINTS.TESTIMONIALS.LIST, { params });
        return response.data;
    },

    /**
     * Get single testimonial by ID
     * @param {number} id - Testimonial ID
     */
    async getById(id) {
        const response = await apiClient.get(API_ENDPOINTS.TESTIMONIALS.VIEW(id));
        return response.data;
    },

    /**
     * Create new testimonial
     * @param {Object} data - Testimonial data
     */
    async create(data) {
        const formData = createFormData(data);
        const response = await apiClient.post(API_ENDPOINTS.TESTIMONIALS.CREATE, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        return response.data;
    },

    /**
     * Update testimonial
     * @param {number} id - Testimonial ID
     * @param {Object} data - Testimonial data
     */
    async update(id, data) {
        const formData = createFormData(data);
        formData.append('_method', 'PUT');
        const response = await apiClient.post(API_ENDPOINTS.TESTIMONIALS.UPDATE(id), formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        return response.data;
    },

    /**
     * Delete testimonial
     * @param {number} id - Testimonial ID
     */
    async delete(id) {
        const response = await apiClient.delete(API_ENDPOINTS.TESTIMONIALS.DELETE(id));
        return response.data;
    },

    /**
     * Get active testimonials only
     */
    async getActive(params = {}) {
        return this.getAll({ ...params, active: true });
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

export default testimonialsService;
