import { useApi, usePaginatedApi, useMutation } from './useApi';
import projectsService from '@/api/services/projects.service';

/**
 * Hook for fetching all projects with pagination
 */
export function useProjects(initialParams = {}) {
    return usePaginatedApi(
        (params) => projectsService.getAll(params),
        initialParams
    );
}

/**
 * Hook for fetching a single project by slug
 */
export function useProject(slug) {
    return useApi(
        () => projectsService.getBySlug(slug),
        [slug],
        { immediate: !!slug }
    );
}

/**
 * Hook for fetching featured projects
 */
export function useFeaturedProjects(limit = 6) {
    return useApi(
        () => projectsService.getFeatured(limit),
        [limit]
    );
}

/**
 * Hook for creating a project
 */
export function useCreateProject(options = {}) {
    return useMutation(
        (data) => projectsService.create(data),
        options
    );
}

/**
 * Hook for updating a project
 */
export function useUpdateProject(options = {}) {
    return useMutation(
        ({ id, data }) => projectsService.update(id, data),
        options
    );
}

/**
 * Hook for deleting a project
 */
export function useDeleteProject(options = {}) {
    return useMutation(
        (id) => projectsService.delete(id),
        options
    );
}

/**
 * Combined hook for all project operations
 */
export function useProjectActions() {
    const createProject = useCreateProject();
    const updateProject = useUpdateProject();
    const deleteProject = useDeleteProject();

    return {
        create: createProject.mutate,
        update: updateProject.mutate,
        delete: deleteProject.mutate,
        loading: createProject.loading || updateProject.loading || deleteProject.loading,
    };
}
