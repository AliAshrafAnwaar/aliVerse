/**
 * API Module Index
 * Central export point for all API services and utilities
 */

// Axios clients
export { default as apiClient, webClient, API_VERSION, API_BASE_URL } from './axios';

// Endpoints
export { API_ENDPOINTS, WEB_ENDPOINTS } from './endpoints';

// Services
export { default as postsService } from './services/posts.service';
export { default as projectsService } from './services/projects.service';
export { default as usersService } from './services/users.service';
export { default as skillsService } from './services/skills.service';
export { default as experiencesService } from './services/experiences.service';
export { default as educationsService } from './services/educations.service';
export { default as testimonialsService } from './services/testimonials.service';
export { default as contactService } from './services/contact.service';

// Legacy services (for backward compatibility)
export { default as profileService } from './services/profile.service';

// Import all services for the API object
import postsService from './services/posts.service';
import projectsService from './services/projects.service';
import usersService from './services/users.service';
import skillsService from './services/skills.service';
import experiencesService from './services/experiences.service';
import educationsService from './services/educations.service';
import testimonialsService from './services/testimonials.service';
import contactService from './services/contact.service';
import profileService from './services/profile.service';

/**
 * API object with all services
 * 
 * Usage:
 * import API from '@/api';
 * 
 * // Fetch posts
 * const posts = await API.posts.getAll();
 * 
 * // Create project
 * const project = await API.projects.create(data);
 */
const API = {
    posts: postsService,
    projects: projectsService,
    users: usersService,
    skills: skillsService,
    experiences: experiencesService,
    educations: educationsService,
    testimonials: testimonialsService,
    contact: contactService,
    profile: profileService,
};

export default API;
