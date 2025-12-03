import apiClient from '../axios';
import { API_ENDPOINTS } from '../endpoints';

/**
 * Contact API Service
 * Use for data fetching without page reload
 */
const contactService = {
    /**
     * Submit contact form
     * @param {Object} data - Contact form data
     */
    async submit(data) {
        const response = await apiClient.post(API_ENDPOINTS.CONTACT.SUBMIT, data);
        return response.data;
    },

    // ============================================
    // Admin: Contact Submissions
    // ============================================

    /**
     * Get all contact submissions
     * @param {Object} params - Query parameters
     */
    async getSubmissions(params = {}) {
        const response = await apiClient.get(API_ENDPOINTS.CONTACT_SUBMISSIONS.LIST, { params });
        return response.data;
    },

    /**
     * Get single submission by ID
     * @param {number} id - Submission ID
     */
    async getSubmissionById(id) {
        const response = await apiClient.get(API_ENDPOINTS.CONTACT_SUBMISSIONS.VIEW(id));
        return response.data;
    },

    /**
     * Delete submission
     * @param {number} id - Submission ID
     */
    async deleteSubmission(id) {
        const response = await apiClient.delete(API_ENDPOINTS.CONTACT_SUBMISSIONS.DELETE(id));
        return response.data;
    },

    /**
     * Mark submission as read
     * @param {number} id - Submission ID
     */
    async markAsRead(id) {
        const response = await apiClient.post(API_ENDPOINTS.CONTACT_SUBMISSIONS.MARK_READ(id));
        return response.data;
    },

    /**
     * Mark submission as unread
     * @param {number} id - Submission ID
     */
    async markAsUnread(id) {
        const response = await apiClient.post(API_ENDPOINTS.CONTACT_SUBMISSIONS.MARK_UNREAD(id));
        return response.data;
    },

    /**
     * Bulk delete submissions
     * @param {Array<number>} ids - Submission IDs
     */
    async bulkDelete(ids) {
        const response = await apiClient.post(API_ENDPOINTS.CONTACT_SUBMISSIONS.BULK_DELETE, { ids });
        return response.data;
    },

    /**
     * Bulk mark as read
     * @param {Array<number>} ids - Submission IDs
     */
    async bulkMarkAsRead(ids) {
        const response = await apiClient.post(API_ENDPOINTS.CONTACT_SUBMISSIONS.BULK_MARK_READ, { ids });
        return response.data;
    },

    /**
     * Bulk mark as unread
     * @param {Array<number>} ids - Submission IDs
     */
    async bulkMarkAsUnread(ids) {
        const response = await apiClient.post(API_ENDPOINTS.CONTACT_SUBMISSIONS.BULK_MARK_UNREAD, { ids });
        return response.data;
    },

    /**
     * Get unread submissions
     */
    async getUnread(params = {}) {
        return this.getSubmissions({ ...params, filter: 'unread' });
    },

    /**
     * Get read submissions
     */
    async getRead(params = {}) {
        return this.getSubmissions({ ...params, filter: 'read' });
    },
};

export default contactService;
