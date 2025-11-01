import api from '../index';
import ENDPOINTS from '../endpoints';

export interface PostFilters {
  search?: string;
  category?: number;
  status?: string;
  featured?: boolean;
  page?: number;
}

export interface PostFormData {
  title: string;
  excerpt?: string;
  content: string;
  category_id?: number;
  featured_image?: File;
  meta_description?: string;
  meta_keywords?: string;
  status: 'draft' | 'published' | 'scheduled' | 'archived';
  featured?: boolean;
  published_at?: string;
  tags?: number[];
}

export const postService = {
  // Get all posts with filters
  getAll: (filters?: PostFilters) => {
    return api.get('/api/blog', { params: filters });
  },

  // Get single post by ID
  getById: (id: number) => {
    return api.get(`/api/blog/${id}`);
  },

  // Create new post
  create: (data: PostFormData) => {
    const formData = new FormData();
    
    // Append all form data
    Object.keys(data).forEach(key => {
      if (key === 'featured_image' && data[key] instanceof File) {
        formData.append(key, data[key]);
      } else if (key === 'tags' && Array.isArray(data[key])) {
        formData.append(key, JSON.stringify(data[key]));
      } else if (data[key] !== undefined && data[key] !== null) {
        formData.append(key, data[key].toString());
      }
    });

    return api.post('/api/blog', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  // Update existing post
  update: (id: number, data: PostFormData) => {
    const formData = new FormData();
    
    // Append all form data
    Object.keys(data).forEach(key => {
      if (key === 'featured_image' && data[key] instanceof File) {
        formData.append(key, data[key]);
      } else if (key === 'tags' && Array.isArray(data[key])) {
        formData.append(key, JSON.stringify(data[key]));
      } else if (data[key] !== undefined && data[key] !== null) {
        formData.append(key, data[key].toString());
      }
    });

    // Add _method for PUT request
    formData.append('_method', 'PUT');

    return api.post(`/api/blog/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  // Delete post
  delete: (id: number) => {
    return api.delete(`/api/blog/${id}`);
  },

  // Toggle featured status
  toggleFeatured: (id: number) => {
    return api.post(`/api/blog/${id}/toggle-featured`);
  },

  // Publish post
  publish: (id: number) => {
    return api.post(`/api/blog/${id}/publish`);
  },

  // Unpublish post
  unpublish: (id: number) => {
    return api.post(`/api/blog/${id}/unpublish`);
  },

  // Get posts by category
  getByCategory: (categoryId: number, filters?: Omit<PostFilters, 'category'>) => {
    return api.get('/api/blog', { 
      params: { 
        ...filters, 
        category: categoryId 
      } 
    });
  },

  // Get featured posts
  getFeatured: (filters?: Omit<PostFilters, 'featured'>) => {
    return api.get('/api/blog', { 
      params: { 
        ...filters, 
        featured: true 
      } 
    });
  },

  // Search posts
  search: (query: string, filters?: Omit<PostFilters, 'search'>) => {
    return api.get('/api/blog', { 
      params: { 
        ...filters, 
        search: query 
      } 
    });
  },

  // Get recent posts
  getRecent: (limit: number = 5) => {
    return api.get('/api/blog', { 
      params: { 
        limit,
        status: 'published'
      } 
    });
  },

  // Get popular posts (by views)
  getPopular: (limit: number = 5) => {
    return api.get('/api/blog', { 
      params: { 
        limit,
        status: 'published',
        sort: 'views_count',
        order: 'desc'
      } 
    });
  },
};
