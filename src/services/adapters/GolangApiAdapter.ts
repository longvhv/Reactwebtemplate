/**
 * Golang API Adapter
 * 
 * Adapter implementation for Golang Backend API
 * Implements repository interfaces using Golang API endpoints
 */

import { apiClient } from '../api/client';
import type {
  IUserRepository,
  User,
  UserFilters,
  UserListResponse,
  CreateUserInput,
  UpdateUserInput,
} from '../repositories/IUserRepository';
import type {
  IProfileRepository,
  Profile,
  UpdateProfileInput,
  ChangePasswordInput,
  Activity,
  NotificationSettings,
} from '../repositories/IProfileRepository';

/**
 * Golang API User Repository Implementation
 */
export class GolangUserRepository implements IUserRepository {
  async getUsers(filters?: UserFilters): Promise<UserListResponse> {
    const params = new URLSearchParams();
    
    if (filters?.search) params.append('search', filters.search);
    if (filters?.role) params.append('role', filters.role);
    if (filters?.department) params.append('department', filters.department);
    if (filters?.status) params.append('status', filters.status);
    if (filters?.page) params.append('page', filters.page.toString());
    if (filters?.limit) params.append('limit', filters.limit.toString());

    const response = await apiClient.get<UserListResponse>(
      `/users?${params.toString()}`
    );
    
    return response;
  }

  async getUserById(id: string): Promise<User> {
    const response = await apiClient.get<User>(`/users/${id}`);
    return response;
  }

  async createUser(data: CreateUserInput): Promise<User> {
    const response = await apiClient.post<User>('/users', data);
    return response;
  }

  async updateUser(id: string, data: UpdateUserInput): Promise<User> {
    const response = await apiClient.put<User>(`/users/${id}`, data);
    return response;
  }

  async deleteUser(id: string): Promise<void> {
    await apiClient.delete(`/users/${id}`);
  }

  async bulkDeleteUsers(ids: string[]): Promise<void> {
    await apiClient.post('/users/bulk-delete', { ids });
  }

  async getUserStats() {
    const response = await apiClient.get<{
      total: number;
      active: number;
      inactive: number;
      pending: number;
    }>('/users/stats');
    
    return response;
  }
}

/**
 * Golang API Profile Repository Implementation
 */
export class GolangProfileRepository implements IProfileRepository {
  async getProfile(): Promise<Profile> {
    const response = await apiClient.get<Profile>('/profile');
    return response;
  }

  async updateProfile(data: UpdateProfileInput): Promise<Profile> {
    const response = await apiClient.put<Profile>('/profile', data);
    return response;
  }

  async changePassword(data: ChangePasswordInput): Promise<void> {
    await apiClient.post('/profile/change-password', data);
  }

  async getActivities(limit: number = 10): Promise<Activity[]> {
    const response = await apiClient.get<Activity[]>(
      `/profile/activities?limit=${limit}`
    );
    return response;
  }

  async getNotificationSettings(): Promise<NotificationSettings> {
    const response = await apiClient.get<NotificationSettings>(
      '/profile/notification-settings'
    );
    return response;
  }

  async updateNotificationSettings(
    settings: NotificationSettings
  ): Promise<NotificationSettings> {
    const response = await apiClient.put<NotificationSettings>(
      '/profile/notification-settings',
      settings
    );
    return response;
  }

  async uploadAvatar(file: File): Promise<string> {
    const formData = new FormData();
    formData.append('avatar', file);

    const response = await apiClient.post<{ url: string }>(
      '/profile/avatar',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    return response.url;
  }
}
