import { useCallback } from 'react';
import { useApi, usePaginatedApi, useMutation } from './useApi';
import postsService from '@/api/services/posts.service';

/**
 * Hook for fetching all posts with pagination
 */
export function usePosts(initialParams = {}) {
    return usePaginatedApi(
        (params) => postsService.getAll(params),
        initialParams
    );
}

/**
 * Hook for fetching a single post
 */
export function usePost(id) {
    return useApi(
        () => postsService.getById(id),
        [id],
        { immediate: !!id }
    );
}

/**
 * Hook for fetching featured posts
 */
export function useFeaturedPosts(limit = 5) {
    return useApi(
        () => postsService.getFeatured(limit),
        [limit]
    );
}

/**
 * Hook for creating a post
 */
export function useCreatePost(options = {}) {
    return useMutation(
        (data) => postsService.create(data),
        options
    );
}

/**
 * Hook for updating a post
 */
export function useUpdatePost(options = {}) {
    return useMutation(
        ({ id, data }) => postsService.update(id, data),
        options
    );
}

/**
 * Hook for deleting a post
 */
export function useDeletePost(options = {}) {
    return useMutation(
        (id) => postsService.delete(id),
        options
    );
}

/**
 * Hook for toggling featured status
 */
export function useToggleFeatured(options = {}) {
    return useMutation(
        (id) => postsService.toggleFeatured(id),
        options
    );
}

/**
 * Hook for publishing a post
 */
export function usePublishPost(options = {}) {
    return useMutation(
        (id) => postsService.publish(id),
        options
    );
}

/**
 * Hook for unpublishing a post
 */
export function useUnpublishPost(options = {}) {
    return useMutation(
        (id) => postsService.unpublish(id),
        options
    );
}

/**
 * Combined hook for all post operations
 */
export function usePostActions() {
    const createPost = useCreatePost();
    const updatePost = useUpdatePost();
    const deletePost = useDeletePost();
    const toggleFeatured = useToggleFeatured();
    const publishPost = usePublishPost();
    const unpublishPost = useUnpublishPost();

    return {
        create: createPost.mutate,
        update: updatePost.mutate,
        delete: deletePost.mutate,
        toggleFeatured: toggleFeatured.mutate,
        publish: publishPost.mutate,
        unpublish: unpublishPost.mutate,
        loading: createPost.loading || updatePost.loading || deletePost.loading,
    };
}
