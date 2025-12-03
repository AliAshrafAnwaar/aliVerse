import { useState, useEffect, useCallback } from 'react';

/**
 * Generic API hook for data fetching
 * 
 * @param {Function} apiFunction - The API service function to call
 * @param {Array} deps - Dependencies array for useEffect
 * @param {Object} options - Hook options
 * @returns {Object} { data, loading, error, refetch, mutate }
 */
export function useApi(apiFunction, deps = [], options = {}) {
    const { 
        immediate = true,  // Fetch immediately on mount
        initialData = null,
        onSuccess = null,
        onError = null,
    } = options;

    const [data, setData] = useState(initialData);
    const [loading, setLoading] = useState(immediate);
    const [error, setError] = useState(null);

    const execute = useCallback(async (...args) => {
        try {
            setLoading(true);
            setError(null);
            const result = await apiFunction(...args);
            setData(result);
            onSuccess?.(result);
            return result;
        } catch (err) {
            const errorMessage = err.response?.data?.message || err.message || 'An error occurred';
            setError(errorMessage);
            onError?.(err);
            throw err;
        } finally {
            setLoading(false);
        }
    }, [apiFunction, onSuccess, onError]);

    useEffect(() => {
        if (immediate) {
            execute();
        }
    }, deps);

    // Manually update data without refetching
    const mutate = useCallback((newData) => {
        setData(typeof newData === 'function' ? newData(data) : newData);
    }, [data]);

    return {
        data,
        loading,
        error,
        refetch: execute,
        mutate,
    };
}

/**
 * Hook for paginated API data
 * 
 * @param {Function} apiFunction - The API service function
 * @param {Object} initialParams - Initial query parameters
 */
export function usePaginatedApi(apiFunction, initialParams = {}) {
    const [params, setParams] = useState({
        page: 1,
        per_page: 12,
        ...initialParams,
    });
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchData = useCallback(async (newParams = {}) => {
        try {
            setLoading(true);
            setError(null);
            const mergedParams = { ...params, ...newParams };
            const result = await apiFunction(mergedParams);
            setData(result);
            setParams(mergedParams);
            return result;
        } catch (err) {
            setError(err.response?.data?.message || err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    }, [apiFunction, params]);

    useEffect(() => {
        fetchData();
    }, []);

    const goToPage = useCallback((page) => {
        return fetchData({ page });
    }, [fetchData]);

    const nextPage = useCallback(() => {
        if (data?.meta?.current_page < data?.meta?.last_page) {
            return goToPage(data.meta.current_page + 1);
        }
    }, [data, goToPage]);

    const prevPage = useCallback(() => {
        if (data?.meta?.current_page > 1) {
            return goToPage(data.meta.current_page - 1);
        }
    }, [data, goToPage]);

    const search = useCallback((searchQuery) => {
        return fetchData({ search: searchQuery, page: 1 });
    }, [fetchData]);

    const filter = useCallback((filters) => {
        return fetchData({ ...filters, page: 1 });
    }, [fetchData]);

    return {
        data: data?.data || [],
        meta: data?.meta || {},
        loading,
        error,
        params,
        refetch: fetchData,
        goToPage,
        nextPage,
        prevPage,
        search,
        filter,
    };
}

/**
 * Hook for mutation operations (create, update, delete)
 * 
 * @param {Function} apiFunction - The API service function
 * @param {Object} options - Hook options
 */
export function useMutation(apiFunction, options = {}) {
    const {
        onSuccess = null,
        onError = null,
    } = options;

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [data, setData] = useState(null);

    const mutate = useCallback(async (...args) => {
        try {
            setLoading(true);
            setError(null);
            const result = await apiFunction(...args);
            setData(result);
            onSuccess?.(result);
            return result;
        } catch (err) {
            const errorMessage = err.response?.data?.message || err.message;
            const validationErrors = err.response?.data?.errors || {};
            setError({ message: errorMessage, errors: validationErrors });
            onError?.(err);
            throw err;
        } finally {
            setLoading(false);
        }
    }, [apiFunction, onSuccess, onError]);

    const reset = useCallback(() => {
        setLoading(false);
        setError(null);
        setData(null);
    }, []);

    return {
        mutate,
        loading,
        error,
        data,
        reset,
    };
}

export default useApi;
