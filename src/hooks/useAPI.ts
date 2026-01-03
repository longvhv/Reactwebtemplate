/**
 * React Hooks for API Integration
 * Custom hooks for consuming Golang API with TypeScript
 */

import { useState, useEffect, useCallback } from 'react';
import apiClient, { APIError } from './api-client';
import MockAPI from './mock-api';
import type {
  APIResponse,
  APIPaginatedResponse,
  User,
  LoginRequest,
  RegisterRequest,
  PlatformSettings,
  NavigationItem,
} from '../types/api';

// ============================================================
// Configuration
// ============================================================

const USE_MOCK_API = import.meta.env.VITE_USE_MOCK_API === 'true';

// ============================================================
// Hook Types
// ============================================================

interface UseAPIState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

interface UseAPIMutationState {
  loading: boolean;
  error: string | null;
}

// ============================================================
// Authentication Hooks
// ============================================================

export function useLogin() {
  const [state, setState] = useState<UseAPIMutationState>({
    loading: false,
    error: null,
  });

  const login = useCallback(async (credentials: LoginRequest) => {
    setState({ loading: true, error: null });

    try {
      const response = USE_MOCK_API
        ? await MockAPI.auth.login(credentials)
        : await apiClient.login(credentials);

      if (!response.success) {
        throw new Error(response.error?.message || 'Login failed');
      }

      setState({ loading: false, error: null });
      return response.data;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Login failed';
      setState({ loading: false, error: message });
      throw error;
    }
  }, []);

  return { ...state, login };
}

export function useRegister() {
  const [state, setState] = useState<UseAPIMutationState>({
    loading: false,
    error: null,
  });

  const register = useCallback(async (data: RegisterRequest) => {
    setState({ loading: true, error: null });

    try {
      const response = USE_MOCK_API
        ? await MockAPI.auth.register(data)
        : await apiClient.register(data);

      if (!response.success) {
        throw new Error(response.error?.message || 'Registration failed');
      }

      setState({ loading: false, error: null });
      return response.data;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Registration failed';
      setState({ loading: false, error: message });
      throw error;
    }
  }, []);

  return { ...state, register };
}

export function useLogout() {
  const [state, setState] = useState<UseAPIMutationState>({
    loading: false,
    error: null,
  });

  const logout = useCallback(async () => {
    setState({ loading: true, error: null });

    try {
      const response = USE_MOCK_API
        ? await MockAPI.auth.logout()
        : await apiClient.logout();

      if (!response.success) {
        throw new Error(response.error?.message || 'Logout failed');
      }

      setState({ loading: false, error: null });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Logout failed';
      setState({ loading: false, error: message });
      throw error;
    }
  }, []);

  return { ...state, logout };
}

// ============================================================
// User Hooks
// ============================================================

export function useCurrentUser() {
  const [state, setState] = useState<UseAPIState<User>>({
    data: null,
    loading: true,
    error: null,
  });

  const fetchUser = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const response = USE_MOCK_API
        ? await MockAPI.user.getCurrentUser()
        : await apiClient.getCurrentUser();

      if (!response.success) {
        throw new Error(response.error?.message || 'Failed to fetch user');
      }

      setState({ data: response.data || null, loading: false, error: null });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to fetch user';
      setState({ data: null, loading: false, error: message });
    }
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  return { ...state, refetch: fetchUser };
}

export function useUpdateUser() {
  const [state, setState] = useState<UseAPIMutationState>({
    loading: false,
    error: null,
  });

  const updateUser = useCallback(async (data: Partial<User>) => {
    setState({ loading: true, error: null });

    try {
      const response = USE_MOCK_API
        ? await MockAPI.user.updateCurrentUser(data)
        : await apiClient.updateCurrentUser(data);

      if (!response.success) {
        throw new Error(response.error?.message || 'Update failed');
      }

      setState({ loading: false, error: null });
      return response.data;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Update failed';
      setState({ loading: false, error: message });
      throw error;
    }
  }, []);

  return { ...state, updateUser };
}

export function useUsers(params?: {
  page?: number;
  pageSize?: number;
  search?: string;
  role?: string;
}) {
  const [state, setState] = useState<UseAPIState<User[]>>({
    data: null,
    loading: true,
    error: null,
  });
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 20,
    totalItems: 0,
    totalPages: 0,
  });

  const fetchUsers = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const response = USE_MOCK_API
        ? await MockAPI.user.listUsers(params || {})
        : await apiClient.listUsers(params);

      if (!response.success) {
        throw new Error(response.error?.message || 'Failed to fetch users');
      }

      setState({ data: response.data, loading: false, error: null });
      if ('pagination' in response) {
        setPagination(response.pagination);
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to fetch users';
      setState({ data: null, loading: false, error: message });
    }
  }, [params]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return { ...state, pagination, refetch: fetchUsers };
}

// ============================================================
// Platform Hooks
// ============================================================

export function usePlatformSettings() {
  const [state, setState] = useState<UseAPIState<PlatformSettings>>({
    data: null,
    loading: true,
    error: null,
  });

  const fetchSettings = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const response = USE_MOCK_API
        ? await MockAPI.platform.getSettings()
        : await apiClient.getPlatformSettings();

      if (!response.success) {
        throw new Error(response.error?.message || 'Failed to fetch settings');
      }

      setState({ data: response.data || null, loading: false, error: null });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to fetch settings';
      setState({ data: null, loading: false, error: message });
    }
  }, []);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  return { ...state, refetch: fetchSettings };
}

export function useUpdatePlatformSettings() {
  const [state, setState] = useState<UseAPIMutationState>({
    loading: false,
    error: null,
  });

  const updateSettings = useCallback(async (data: Partial<PlatformSettings>) => {
    setState({ loading: true, error: null });

    try {
      const response = USE_MOCK_API
        ? await MockAPI.platform.updateSettings(data)
        : await apiClient.updatePlatformSettings(data);

      if (!response.success) {
        throw new Error(response.error?.message || 'Update failed');
      }

      setState({ loading: false, error: null });
      return response.data;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Update failed';
      setState({ loading: false, error: message });
      throw error;
    }
  }, []);

  return { ...state, updateSettings };
}

export function useNavigation() {
  const [state, setState] = useState<UseAPIState<NavigationItem[]>>({
    data: null,
    loading: true,
    error: null,
  });

  const fetchNavigation = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const response = USE_MOCK_API
        ? await MockAPI.platform.getNavigation()
        : await apiClient.getNavigation();

      if (!response.success) {
        throw new Error(response.error?.message || 'Failed to fetch navigation');
      }

      setState({ data: response.data || null, loading: false, error: null });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to fetch navigation';
      setState({ data: null, loading: false, error: message });
    }
  }, []);

  useEffect(() => {
    fetchNavigation();
  }, [fetchNavigation]);

  return { ...state, refetch: fetchNavigation };
}

export function useCreateNavigation() {
  const [state, setState] = useState<UseAPIMutationState>({
    loading: false,
    error: null,
  });

  const createNavigation = useCallback(
    async (data: Omit<NavigationItem, 'navigationId' | 'createdAt' | 'updatedAt'>) => {
      setState({ loading: true, error: null });

      try {
        const response = USE_MOCK_API
          ? await MockAPI.platform.createNavigation(data)
          : await apiClient.createNavigation(data);

        if (!response.success) {
          throw new Error(response.error?.message || 'Create failed');
        }

        setState({ loading: false, error: null });
        return response.data;
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Create failed';
        setState({ loading: false, error: message });
        throw error;
      }
    },
    []
  );

  return { ...state, createNavigation };
}

export function useUpdateNavigation() {
  const [state, setState] = useState<UseAPIMutationState>({
    loading: false,
    error: null,
  });

  const updateNavigation = useCallback(
    async (navigationId: string, data: Partial<NavigationItem>) => {
      setState({ loading: true, error: null });

      try {
        const response = USE_MOCK_API
          ? await MockAPI.platform.updateNavigation(navigationId, data)
          : await apiClient.updateNavigation(navigationId, data);

        if (!response.success) {
          throw new Error(response.error?.message || 'Update failed');
        }

        setState({ loading: false, error: null });
        return response.data;
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Update failed';
        setState({ loading: false, error: message });
        throw error;
      }
    },
    []
  );

  return { ...state, updateNavigation };
}

export function useDeleteNavigation() {
  const [state, setState] = useState<UseAPIMutationState>({
    loading: false,
    error: null,
  });

  const deleteNavigation = useCallback(async (navigationId: string) => {
    setState({ loading: true, error: null });

    try {
      const response = USE_MOCK_API
        ? await MockAPI.platform.deleteNavigation(navigationId)
        : await apiClient.deleteNavigation(navigationId);

      if (!response.success) {
        throw new Error(response.error?.message || 'Delete failed');
      }

      setState({ loading: false, error: null });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Delete failed';
      setState({ loading: false, error: message });
      throw error;
    }
  }, []);

  return { ...state, deleteNavigation };
}
