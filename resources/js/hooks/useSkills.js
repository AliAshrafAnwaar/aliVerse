import { useApi, usePaginatedApi, useMutation } from './useApi';
import skillsService from '@/api/services/skills.service';

/**
 * Hook for fetching all skills with pagination
 */
export function useSkills(initialParams = {}) {
    return usePaginatedApi(
        (params) => skillsService.getAll(params),
        initialParams
    );
}

/**
 * Hook for fetching a single skill
 */
export function useSkill(id) {
    return useApi(
        () => skillsService.getById(id),
        [id],
        { immediate: !!id }
    );
}

/**
 * Hook for fetching skills by category
 */
export function useSkillsByCategory(category) {
    return useApi(
        () => skillsService.getByCategory(category),
        [category],
        { immediate: !!category }
    );
}

/**
 * Hook for fetching featured skills
 */
export function useFeaturedSkills() {
    return useApi(
        () => skillsService.getFeatured(),
        []
    );
}

/**
 * Hook for creating a skill
 */
export function useCreateSkill(options = {}) {
    return useMutation(
        (data) => skillsService.create(data),
        options
    );
}

/**
 * Hook for updating a skill
 */
export function useUpdateSkill(options = {}) {
    return useMutation(
        ({ id, data }) => skillsService.update(id, data),
        options
    );
}

/**
 * Hook for deleting a skill
 */
export function useDeleteSkill(options = {}) {
    return useMutation(
        (id) => skillsService.delete(id),
        options
    );
}

/**
 * Combined hook for all skill operations
 */
export function useSkillActions() {
    const createSkill = useCreateSkill();
    const updateSkill = useUpdateSkill();
    const deleteSkill = useDeleteSkill();

    return {
        create: createSkill.mutate,
        update: updateSkill.mutate,
        delete: deleteSkill.mutate,
        loading: createSkill.loading || updateSkill.loading || deleteSkill.loading,
    };
}
