import axios from 'axios';

/**
 * API Version
 */
export const API_VERSION = 'v1';
export const API_BASE_URL = `/api/${API_VERSION}`;

/**
 * Axios instance for API calls (JSON responses)
 * Use this for data fetching without page reload
 */
const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'X-Requested-With': 'XMLHttpRequest',
        'Accept': 'application/json',
        'Content-Type': 'application/json',
    },
    withCredentials: true,
});

/**
 * Axios instance for web calls (Inertia compatible)
 * Use this for traditional form submissions
 */
export const webClient = axios.create({
    baseURL: '/',
    headers: {
        'X-Requested-With': 'XMLHttpRequest',
        'Accept': 'application/json',
        'Content-Type': 'application/json',
    },
    withCredentials: true,
});

/**
 * Add CSRF token to requests
 */
const addCsrfToken = (config) => {
    const token = document.head.querySelector('meta[name="csrf-token"]');
    if (token) {
        config.headers['X-CSRF-TOKEN'] = token.content;
    }
    return config;
};

/**
 * Handle common errors
 */
const handleError = (error) => {
    if (error.response?.status === 401) {
        // Handle unauthorized - redirect to login
        window.location.href = '/login';
    }
    
    if (error.response?.status === 419) {
        // CSRF token mismatch - reload page
        window.location.reload();
    }

    if (error.response?.status === 403) {
        console.error('Forbidden: You do not have permission to perform this action.');
    }

    if (error.response?.status === 422) {
        // Validation errors - return them for the form to handle
        return Promise.reject(error);
    }
    
    return Promise.reject(error);
};

// Apply interceptors to API client
apiClient.interceptors.request.use(addCsrfToken, (error) => Promise.reject(error));
apiClient.interceptors.response.use((response) => response, handleError);

// Apply interceptors to web client
webClient.interceptors.request.use(addCsrfToken, (error) => Promise.reject(error));
webClient.interceptors.response.use((response) => response, handleError);

export default apiClient;
