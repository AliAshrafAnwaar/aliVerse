import axios from 'axios';

/**
 * Axios instance with default configuration
 */
const axiosInstance = axios.create({
    baseURL: '/',
    headers: {
        'X-Requested-With': 'XMLHttpRequest',
        'Accept': 'application/json',
        'Content-Type': 'application/json',
    },
    withCredentials: true,
});

/**
 * Request interceptor
 */
axiosInstance.interceptors.request.use(
    (config) => {
        // Add CSRF token to requests
        const token = document.head.querySelector('meta[name="csrf-token"]');
        if (token) {
            config.headers['X-CSRF-TOKEN'] = token.content;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

/**
 * Response interceptor
 */
axiosInstance.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response?.status === 401) {
            // Handle unauthorized
            window.location.href = '/login';
        }
        
        if (error.response?.status === 419) {
            // CSRF token mismatch - reload page
            window.location.reload();
        }
        
        return Promise.reject(error);
    }
);

export default axiosInstance;
