/**
 * Mock Data Adapter
 * 
 * Adapter implementation for development/testing with mock data
 * Implements repository interfaces using in-memory mock data
 */

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

// Mock data storage
let mockUsers: User[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    role: 'Admin',
    department: 'Engineering',
    status: 'active',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    role: 'User',
    department: 'Marketing',
    status: 'active',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

let mockProfile: Profile = {
  id: '1',
  name: 'John Doe',
  email: 'john@example.com',
  role: 'Admin',
  department: 'Engineering',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John',
  bio: 'Senior Software Engineer',
  phone: '+1 234 567 8900',
  location: 'San Francisco, CA',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

/**
 * Mock User Repository Implementation
 */
export class MockUserRepository implements IUserRepository {
  async getUsers(filters?: UserFilters): Promise<UserListResponse> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 300));

    let filtered = [...mockUsers];

    // Apply filters
    if (filters?.search) {
      const search = filters.search.toLowerCase();
      filtered = filtered.filter(
        (user) =>
          user.name.toLowerCase().includes(search) ||
          user.email.toLowerCase().includes(search)
      );
    }

    if (filters?.role) {
      filtered = filtered.filter((user) => user.role === filters.role);
    }

    if (filters?.department) {
      filtered = filtered.filter((user) => user.department === filters.department);
    }

    if (filters?.status) {
      filtered = filtered.filter((user) => user.status === filters.status);
    }

    // Pagination
    const page = filters?.page || 1;
    const limit = filters?.limit || 10;
    const start = (page - 1) * limit;
    const end = start + limit;
    const paginatedData = filtered.slice(start, end);

    return {
      data: paginatedData,
      total: filtered.length,
      page,
      limit,
      totalPages: Math.ceil(filtered.length / limit),
    };
  }

  async getUserById(id: string): Promise<User> {
    await new Promise((resolve) => setTimeout(resolve, 200));

    const user = mockUsers.find((u) => u.id === id);
    if (!user) {
      throw new Error(`User with id ${id} not found`);
    }

    return user;
  }

  async createUser(data: CreateUserInput): Promise<User> {
    await new Promise((resolve) => setTimeout(resolve, 300));

    const newUser: User = {
      id: (mockUsers.length + 1).toString(),
      ...data,
      status: 'active',
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${data.name}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    mockUsers.push(newUser);
    return newUser;
  }

  async updateUser(id: string, data: UpdateUserInput): Promise<User> {
    await new Promise((resolve) => setTimeout(resolve, 300));

    const index = mockUsers.findIndex((u) => u.id === id);
    if (index === -1) {
      throw new Error(`User with id ${id} not found`);
    }

    mockUsers[index] = {
      ...mockUsers[index],
      ...data,
      updatedAt: new Date().toISOString(),
    };

    return mockUsers[index];
  }

  async deleteUser(id: string): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 300));

    const index = mockUsers.findIndex((u) => u.id === id);
    if (index === -1) {
      throw new Error(`User with id ${id} not found`);
    }

    mockUsers.splice(index, 1);
  }

  async bulkDeleteUsers(ids: string[]): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 300));

    mockUsers = mockUsers.filter((u) => !ids.includes(u.id));
  }

  async getUserStats() {
    await new Promise((resolve) => setTimeout(resolve, 200));

    return {
      total: mockUsers.length,
      active: mockUsers.filter((u) => u.status === 'active').length,
      inactive: mockUsers.filter((u) => u.status === 'inactive').length,
      pending: mockUsers.filter((u) => u.status === 'pending').length,
    };
  }
}

/**
 * Mock Profile Repository Implementation
 */
export class MockProfileRepository implements IProfileRepository {
  async getProfile(): Promise<Profile> {
    await new Promise((resolve) => setTimeout(resolve, 200));
    return { ...mockProfile };
  }

  async updateProfile(data: UpdateProfileInput): Promise<Profile> {
    await new Promise((resolve) => setTimeout(resolve, 300));

    mockProfile = {
      ...mockProfile,
      ...data,
      updatedAt: new Date().toISOString(),
    };

    return { ...mockProfile };
  }

  async changePassword(data: ChangePasswordInput): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 300));
    
    // Mock validation
    if (data.currentPassword !== 'password') {
      throw new Error('Current password is incorrect');
    }

    console.log('Password changed successfully (mock)');
  }

  async getActivities(limit: number = 10): Promise<Activity[]> {
    await new Promise((resolve) => setTimeout(resolve, 200));

    const mockActivities: Activity[] = [
      {
        id: '1',
        action: 'profile_updated',
        description: 'Updated profile information',
        timestamp: new Date(Date.now() - 3600000).toISOString(),
      },
      {
        id: '2',
        action: 'password_changed',
        description: 'Changed password',
        timestamp: new Date(Date.now() - 86400000).toISOString(),
      },
      {
        id: '3',
        action: 'login',
        description: 'Logged in from new device',
        timestamp: new Date(Date.now() - 172800000).toISOString(),
      },
    ];

    return mockActivities.slice(0, limit);
  }

  async getNotificationSettings(): Promise<NotificationSettings> {
    await new Promise((resolve) => setTimeout(resolve, 200));

    return {
      email: true,
      push: true,
      sms: false,
      marketing: false,
    };
  }

  async updateNotificationSettings(
    settings: NotificationSettings
  ): Promise<NotificationSettings> {
    await new Promise((resolve) => setTimeout(resolve, 300));

    return { ...settings };
  }

  async uploadAvatar(file: File): Promise<string> {
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Mock avatar upload - return a placeholder URL
    const mockUrl = `https://api.dicebear.com/7.x/avataaars/svg?seed=${file.name}`;
    
    mockProfile.avatar = mockUrl;
    
    return mockUrl;
  }
}
