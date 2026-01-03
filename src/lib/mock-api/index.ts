/**
 * Mock API Implementation for Development
 * Simulates Golang API responses for Figma Make development
 */

import type {
  APIResponse,
  APIPaginatedResponse,
  User,
  LoginResponse,
  RegisterResponse,
  PlatformSettings,
  NavigationItem,
  HealthCheckResponse,
  VersionInfo,
} from '../types/api';

// ============================================================
// Mock Data
// ============================================================

const mockUsers: User[] = [
  {
    id: '507f1f77bcf86cd799439011',
    userId: 'usr_1704276000000',
    emailAddress: 'admin@vhvplatform.com',
    firstName: 'Admin',
    lastName: 'User',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Admin',
    role: 'admin',
    status: 'active',
    preferences: {
      language: 'en',
      theme: 'light',
      notifications: true,
    },
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-03T10:30:00Z',
  },
  {
    id: '507f1f77bcf86cd799439012',
    userId: 'usr_1704276001000',
    emailAddress: 'john.doe@example.com',
    firstName: 'John',
    lastName: 'Doe',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John',
    role: 'user',
    status: 'active',
    preferences: {
      language: 'en',
      theme: 'dark',
      notifications: true,
    },
    createdAt: '2026-01-02T00:00:00Z',
    updatedAt: '2026-01-03T08:15:00Z',
  },
];

const mockPlatformSettings: PlatformSettings = {
  settingsId: 'settings_global',
  platformName: 'VHV Platform',
  platformLogo: 'https://example.com/logo.png',
  supportedLanguages: ['en', 'vi', 'es', 'fr', 'zh', 'ja', 'ko'],
  defaultLanguage: 'en',
  theme: {
    primaryColor: '#6366f1',
    backgroundColor: '#fafafa',
    fontFamily: 'Inter',
  },
  features: {
    authentication: true,
    userManagement: true,
    i18n: true,
    darkMode: true,
  },
  updatedAt: '2026-01-03T10:30:00Z',
};

const mockNavigationItems: NavigationItem[] = [
  {
    navigationId: 'nav_dashboard',
    title: 'Dashboard',
    path: '/dashboard',
    icon: 'LayoutDashboard',
    order: 1,
    isActive: true,
    permission: 'view_dashboard',
    children: [],
  },
  {
    navigationId: 'nav_users',
    title: 'Users',
    path: '/users',
    icon: 'Users',
    order: 2,
    isActive: true,
    permission: 'view_users',
    children: [
      {
        navigationId: 'nav_users_list',
        title: 'User List',
        path: '/users/list',
        icon: 'List',
        order: 1,
        isActive: true,
      },
      {
        navigationId: 'nav_users_roles',
        title: 'Roles & Permissions',
        path: '/users/roles',
        icon: 'Shield',
        order: 2,
        isActive: true,
      },
    ],
  },
  {
    navigationId: 'nav_settings',
    title: 'Settings',
    path: '/settings',
    icon: 'Settings',
    order: 3,
    isActive: true,
    permission: 'view_settings',
    children: [],
  },
];

// ============================================================
// Mock Authentication API
// ============================================================

export class MockAuthAPI {
  private static accessToken = 'mock_access_token_' + Date.now();
  private static refreshToken = 'mock_refresh_token_' + Date.now();
  private static currentUser: User | null = null;

  static async register(data: {
    emailAddress: string;
    password: string;
    firstName: string;
    lastName: string;
    acceptTerms: boolean;
  }): Promise<APIResponse<RegisterResponse>> {
    await this.delay(800);

    // Check if email exists
    const existing = mockUsers.find((u) => u.emailAddress === data.emailAddress);
    if (existing) {
      return {
        success: false,
        error: {
          code: 'EMAIL_ALREADY_EXISTS',
          message: 'Email already registered',
        },
        timestamp: new Date().toISOString(),
      };
    }

    return {
      success: true,
      data: {
        userId: `usr_${Date.now()}`,
        emailAddress: data.emailAddress,
        firstName: data.firstName,
        lastName: data.lastName,
        createdAt: new Date().toISOString(),
      },
      message: 'Registration successful',
      timestamp: new Date().toISOString(),
    };
  }

  static async login(data: {
    emailAddress: string;
    password: string;
  }): Promise<APIResponse<LoginResponse>> {
    await this.delay(800);

    const user = mockUsers.find((u) => u.emailAddress === data.emailAddress);

    if (!user || data.password !== 'password123') {
      return {
        success: false,
        error: {
          code: 'INVALID_CREDENTIALS',
          message: 'Invalid email or password',
        },
        timestamp: new Date().toISOString(),
      };
    }

    this.currentUser = user;
    this.accessToken = 'mock_access_token_' + Date.now();
    this.refreshToken = 'mock_refresh_token_' + Date.now();

    return {
      success: true,
      data: {
        accessToken: this.accessToken,
        refreshToken: this.refreshToken,
        expiresIn: 86400,
        tokenType: 'Bearer',
        user,
      },
      timestamp: new Date().toISOString(),
    };
  }

  static async refreshToken(refreshToken: string): Promise<
    APIResponse<{
      accessToken: string;
      expiresIn: number;
      tokenType: string;
    }>
  > {
    await this.delay(500);

    if (refreshToken !== this.refreshToken) {
      return {
        success: false,
        error: {
          code: 'INVALID_REFRESH_TOKEN',
          message: 'Invalid or expired refresh token',
        },
        timestamp: new Date().toISOString(),
      };
    }

    this.accessToken = 'mock_access_token_' + Date.now();

    return {
      success: true,
      data: {
        accessToken: this.accessToken,
        expiresIn: 86400,
        tokenType: 'Bearer',
      },
      timestamp: new Date().toISOString(),
    };
  }

  static async logout(): Promise<APIResponse> {
    await this.delay(300);
    this.currentUser = null;
    return {
      success: true,
      message: 'Logout successful',
      timestamp: new Date().toISOString(),
    };
  }

  static async forgotPassword(emailAddress: string): Promise<APIResponse> {
    await this.delay(800);
    return {
      success: true,
      message: 'Password reset email sent',
      timestamp: new Date().toISOString(),
    };
  }

  static async resetPassword(token: string, newPassword: string): Promise<APIResponse> {
    await this.delay(800);
    return {
      success: true,
      message: 'Password reset successful',
      timestamp: new Date().toISOString(),
    };
  }

  static getCurrentUser(): User | null {
    return this.currentUser;
  }

  static getAccessToken(): string {
    return this.accessToken;
  }

  private static delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

// ============================================================
// Mock User API
// ============================================================

export class MockUserAPI {
  static async getCurrentUser(): Promise<APIResponse<User>> {
    await this.delay(500);

    const user = MockAuthAPI.getCurrentUser();
    if (!user) {
      return {
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          message: 'User not authenticated',
        },
        timestamp: new Date().toISOString(),
      };
    }

    return {
      success: true,
      data: user,
      timestamp: new Date().toISOString(),
    };
  }

  static async updateCurrentUser(data: Partial<User>): Promise<APIResponse<User>> {
    await this.delay(800);

    const user = MockAuthAPI.getCurrentUser();
    if (!user) {
      return {
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          message: 'User not authenticated',
        },
        timestamp: new Date().toISOString(),
      };
    }

    const updatedUser = { ...user, ...data, updatedAt: new Date().toISOString() };

    return {
      success: true,
      data: updatedUser,
      message: 'Profile updated successfully',
      timestamp: new Date().toISOString(),
    };
  }

  static async changePassword(
    currentPassword: string,
    newPassword: string
  ): Promise<APIResponse> {
    await this.delay(800);

    if (currentPassword !== 'password123') {
      return {
        success: false,
        error: {
          code: 'INVALID_CURRENT_PASSWORD',
          message: 'Current password is incorrect',
        },
        timestamp: new Date().toISOString(),
      };
    }

    return {
      success: true,
      message: 'Password changed successfully',
      timestamp: new Date().toISOString(),
    };
  }

  static async listUsers(params: {
    page?: number;
    pageSize?: number;
    search?: string;
    role?: string;
  }): Promise<APIPaginatedResponse<User>> {
    await this.delay(600);

    const page = params.page || 1;
    const pageSize = params.pageSize || 20;
    let filteredUsers = [...mockUsers];

    if (params.search) {
      const searchLower = params.search.toLowerCase();
      filteredUsers = filteredUsers.filter(
        (u) =>
          u.firstName.toLowerCase().includes(searchLower) ||
          u.lastName.toLowerCase().includes(searchLower) ||
          u.emailAddress.toLowerCase().includes(searchLower)
      );
    }

    if (params.role) {
      filteredUsers = filteredUsers.filter((u) => u.role === params.role);
    }

    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    const paginatedUsers = filteredUsers.slice(start, end);

    return {
      success: true,
      data: paginatedUsers,
      pagination: {
        page,
        pageSize,
        totalItems: filteredUsers.length,
        totalPages: Math.ceil(filteredUsers.length / pageSize),
      },
      timestamp: new Date().toISOString(),
    };
  }

  private static delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

// ============================================================
// Mock Platform API
// ============================================================

export class MockPlatformAPI {
  static async getSettings(): Promise<APIResponse<PlatformSettings>> {
    await this.delay(500);

    return {
      success: true,
      data: mockPlatformSettings,
      timestamp: new Date().toISOString(),
    };
  }

  static async updateSettings(
    data: Partial<PlatformSettings>
  ): Promise<APIResponse<PlatformSettings>> {
    await this.delay(800);

    const updatedSettings = {
      ...mockPlatformSettings,
      ...data,
      updatedAt: new Date().toISOString(),
    };

    return {
      success: true,
      data: updatedSettings,
      message: 'Settings updated successfully',
      timestamp: new Date().toISOString(),
    };
  }

  static async getNavigation(): Promise<APIResponse<NavigationItem[]>> {
    await this.delay(500);

    return {
      success: true,
      data: mockNavigationItems,
      timestamp: new Date().toISOString(),
    };
  }

  static async createNavigation(
    data: Omit<NavigationItem, 'navigationId' | 'createdAt' | 'updatedAt'>
  ): Promise<APIResponse<NavigationItem>> {
    await this.delay(800);

    const newItem: NavigationItem = {
      ...data,
      navigationId: `nav_${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    return {
      success: true,
      data: newItem,
      message: 'Navigation item created',
      timestamp: new Date().toISOString(),
    };
  }

  static async updateNavigation(
    id: string,
    data: Partial<NavigationItem>
  ): Promise<APIResponse<NavigationItem>> {
    await this.delay(800);

    const item = mockNavigationItems.find((n) => n.navigationId === id);
    if (!item) {
      return {
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Navigation item not found',
        },
        timestamp: new Date().toISOString(),
      };
    }

    const updatedItem = {
      ...item,
      ...data,
      updatedAt: new Date().toISOString(),
    };

    return {
      success: true,
      data: updatedItem,
      message: 'Navigation item updated',
      timestamp: new Date().toISOString(),
    };
  }

  static async deleteNavigation(id: string): Promise<APIResponse> {
    await this.delay(600);

    return {
      success: true,
      message: 'Navigation item deleted',
      timestamp: new Date().toISOString(),
    };
  }

  private static delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

// ============================================================
// Mock System API
// ============================================================

export class MockSystemAPI {
  static async healthCheck(): Promise<APIResponse<HealthCheckResponse>> {
    await this.delay(200);

    return {
      success: true,
      data: {
        status: 'healthy',
        timestamp: new Date().toISOString(),
        version: '1.0.0',
        services: {
          database: 'healthy',
          cache: 'healthy',
        },
      },
      timestamp: new Date().toISOString(),
    };
  }

  static async getVersion(): Promise<APIResponse<VersionInfo>> {
    await this.delay(200);

    return {
      success: true,
      data: {
        version: '1.0.0',
        buildDate: '2026-01-03',
        environment: 'development',
        goVersion: 'go1.21.5',
      },
      timestamp: new Date().toISOString(),
    };
  }

  private static delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

// ============================================================
// Unified Mock API
// ============================================================

export const MockAPI = {
  auth: MockAuthAPI,
  user: MockUserAPI,
  platform: MockPlatformAPI,
  system: MockSystemAPI,
};

export default MockAPI;
