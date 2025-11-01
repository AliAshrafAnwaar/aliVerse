/**
 * API Module Index
 * Central export point for all API services
 */

export { default as axiosInstance } from './axios';
export { default as API_ENDPOINTS } from './endpoints';

// Services
export { default as profileService } from './services/profile.service';
export { default as projectService } from './services/project.service';

// Export all as a single object for convenience
import profileService from './services/profile.service';
import projectService from './services/project.service';

const API = {
    profile: profileService,
    project: projectService,
};

export default API;
