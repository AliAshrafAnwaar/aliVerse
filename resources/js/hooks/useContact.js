import { useApi, usePaginatedApi, useMutation } from './useApi';
import contactService from '@/api/services/contact.service';

/**
 * Hook for submitting contact form
 */
export function useContactSubmit(options = {}) {
    return useMutation(
        (data) => contactService.submit(data),
        options
    );
}

/**
 * Hook for fetching contact submissions (admin)
 */
export function useContactSubmissions(initialParams = {}) {
    return usePaginatedApi(
        (params) => contactService.getSubmissions(params),
        initialParams
    );
}

/**
 * Hook for fetching a single submission (admin)
 */
export function useContactSubmission(id) {
    return useApi(
        () => contactService.getSubmissionById(id),
        [id],
        { immediate: !!id }
    );
}

/**
 * Hook for marking submission as read
 */
export function useMarkAsRead(options = {}) {
    return useMutation(
        (id) => contactService.markAsRead(id),
        options
    );
}

/**
 * Hook for marking submission as unread
 */
export function useMarkAsUnread(options = {}) {
    return useMutation(
        (id) => contactService.markAsUnread(id),
        options
    );
}

/**
 * Hook for deleting a submission
 */
export function useDeleteSubmission(options = {}) {
    return useMutation(
        (id) => contactService.deleteSubmission(id),
        options
    );
}

/**
 * Hook for bulk operations
 */
export function useBulkSubmissionActions() {
    const bulkDelete = useMutation((ids) => contactService.bulkDelete(ids));
    const bulkMarkRead = useMutation((ids) => contactService.bulkMarkAsRead(ids));
    const bulkMarkUnread = useMutation((ids) => contactService.bulkMarkAsUnread(ids));

    return {
        bulkDelete: bulkDelete.mutate,
        bulkMarkRead: bulkMarkRead.mutate,
        bulkMarkUnread: bulkMarkUnread.mutate,
        loading: bulkDelete.loading || bulkMarkRead.loading || bulkMarkUnread.loading,
    };
}

/**
 * Combined hook for all contact submission actions
 */
export function useSubmissionActions() {
    const markRead = useMarkAsRead();
    const markUnread = useMarkAsUnread();
    const deleteSubmission = useDeleteSubmission();
    const bulk = useBulkSubmissionActions();

    return {
        markAsRead: markRead.mutate,
        markAsUnread: markUnread.mutate,
        delete: deleteSubmission.mutate,
        ...bulk,
        loading: markRead.loading || markUnread.loading || deleteSubmission.loading || bulk.loading,
    };
}
