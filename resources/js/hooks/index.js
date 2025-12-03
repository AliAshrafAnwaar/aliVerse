/**
 * Hooks Index
 * Central export for all custom hooks
 */

// Core API hooks
export { useApi, usePaginatedApi, useMutation } from './useApi';

// Toast hook
export { useToast, toast } from './use-toast';

// Resource-specific hooks
export {
    usePosts,
    usePost,
    useFeaturedPosts,
    useCreatePost,
    useUpdatePost,
    useDeletePost,
    useToggleFeatured,
    usePublishPost,
    useUnpublishPost,
    usePostActions,
} from './usePosts';

export {
    useProjects,
    useProject,
    useFeaturedProjects,
    useCreateProject,
    useUpdateProject,
    useDeleteProject,
    useProjectActions,
} from './useProjects';

export {
    useSkills,
    useSkill,
    useSkillsByCategory,
    useFeaturedSkills,
    useCreateSkill,
    useUpdateSkill,
    useDeleteSkill,
    useSkillActions,
} from './useSkills';

export {
    useContactSubmit,
    useContactSubmissions,
    useContactSubmission,
    useMarkAsRead,
    useMarkAsUnread,
    useDeleteSubmission,
    useBulkSubmissionActions,
    useSubmissionActions,
} from './useContact';
