/**
 * API Client for Golang Backend
 * Production-ready HTTP client with TypeScript support
 */

import type {
  APIResponse,
  APIPaginatedResponse,
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
  User,
  PlatformSettings,
  NavigationItem,
  HealthCheckResponse,
  VersionInfo,
} from '../types/api';

// ============================================================
// Configuration
// ============================================================

interface APIClientConfig {
  baseURL: string;
  timeout?: number;
  headers?: Record<string, string>;
}

const defaultConfig: APIClientConfig = {
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api/v1',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
};

// ============================================================
// HTTP Client
// ============================================================

class HTTPClient {
  private config: APIClientConfig;
  private accessToken: string | null = null;

  constructor(config: APIClientConfig = defaultConfig) {
    this.config = { ...defaultConfig, ...config };
  }

  setAccessToken(token: string | null): void {
    this.accessToken = token;
  }

  getAccessToken(): string | null {
    return this.accessToken;
  }

  private getHeaders(): Record<string, string> {
    const headers = { ...this.config.headers };
    
    if (this.accessToken) {
      headers['Authorization'] = `Bearer ${this.accessToken}`;
    }

    return headers;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.config.baseURL}${endpoint}`;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.config.timeout);

    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          ...this.getHeaders(),
          ...options.headers,
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      const data = await response.json();

      if (!response.ok) {
        throw new APIError(
          data.error?.message || 'Request failed',
          response.status,
          data.error?.code
        );
      }

      return data;
    } catch (error) {
      clearTimeout(timeoutId);

      if (error instanceof APIError) {
        throw error;
      }

      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new APIError('Request timeout', 408, 'TIMEOUT');
        }
        throw new APIError(error.message, 500, 'NETWORK_ERROR');
      }

      throw new APIError('Unknown error', 500, 'UNKNOWN_ERROR');
    }
  }

  async get<T>(endpoint: string, params?: Record<string, string | number>): Promise<T> {
    const query = params
      ? '?' + new URLSearchParams(params as Record<string, string>).toString()
      : '';
    return this.request<T>(`${endpoint}${query}`, { method: 'GET' });
  }

  async post<T>(endpoint: string, data?: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put<T>(endpoint: string, data?: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }
}

// ============================================================
// API Error Class
// ============================================================

export class APIError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public code?: string
  ) {
    super(message);
    this.name = 'APIError';
  }
}

// ============================================================
// API Client Class
// ============================================================

export class APIClient {
  private http: HTTPClient;

  constructor(config?: APIClientConfig) {
    this.http = new HTTPClient(config);
  }

  // ============================================================
  // Authentication Methods
  // ============================================================

  async register(data: RegisterRequest): Promise<APIResponse<RegisterResponse>> {
    return this.http.post<APIResponse<RegisterResponse>>('/auth/register', data);
  }

  async login(data: LoginRequest): Promise<APIResponse<LoginResponse>> {
    const response = await this.http.post<APIResponse<LoginResponse>>('/auth/login', data);
    
    if (response.success && response.data) {
      this.http.setAccessToken(response.data.accessToken);
      // Store tokens in localStorage
      localStorage.setItem('accessToken', response.data.accessToken);
      localStorage.setItem('refreshToken', response.data.refreshToken);
    }

    return response;
  }

  async refreshToken(refreshToken: string): Promise<APIResponse<{
    accessToken: string;
    expiresIn: number;
    tokenType: string;
  }>> {
    const response = await this.http.post<APIResponse<{
      accessToken: string;
      expiresIn: number;
      tokenType: string;
    }>>('/auth/refresh', { refreshToken });

    if (response.success && response.data) {
      this.http.setAccessToken(response.data.accessToken);
      localStorage.setItem('accessToken', response.data.accessToken);
    }

    return response;
  }

  async logout(): Promise<APIResponse> {
    const response = await this.http.post<APIResponse>('/auth/logout');
    
    // Clear tokens
    this.http.setAccessToken(null);
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');

    return response;
  }

  async forgotPassword(emailAddress: string): Promise<APIResponse> {
    return this.http.post<APIResponse>('/auth/forgot-password', { emailAddress });
  }

  async resetPassword(token: string, newPassword: string): Promise<APIResponse> {
    return this.http.post<APIResponse>('/auth/reset-password', { token, newPassword });
  }

  // ============================================================
  // User Methods
  // ============================================================

  async getCurrentUser(): Promise<APIResponse<User>> {
    return this.http.get<APIResponse<User>>('/users/me');
  }

  async updateCurrentUser(data: Partial<User>): Promise<APIResponse<User>> {
    return this.http.put<APIResponse<User>>('/users/me', data);
  }

  async changePassword(currentPassword: string, newPassword: string): Promise<APIResponse> {
    return this.http.put<APIResponse>('/users/me/password', {
      currentPassword,
      newPassword,
    });
  }

  async listUsers(params?: {
    page?: number;
    pageSize?: number;
    search?: string;
    role?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }): Promise<APIPaginatedResponse<User>> {
    return this.http.get<APIPaginatedResponse<User>>('/users', params);
  }

  async getUser(userId: string): Promise<APIResponse<User>> {
    return this.http.get<APIResponse<User>>(`/users/${userId}`);
  }

  async updateUser(userId: string, data: Partial<User>): Promise<APIResponse<User>> {
    return this.http.put<APIResponse<User>>(`/users/${userId}`, data);
  }

  async deleteUser(userId: string): Promise<APIResponse> {
    return this.http.delete<APIResponse>(`/users/${userId}`);
  }

  // ============================================================
  // Platform Methods
  // ============================================================

  async getPlatformSettings(): Promise<APIResponse<PlatformSettings>> {
    return this.http.get<APIResponse<PlatformSettings>>('/platform/settings');
  }

  async updatePlatformSettings(
    data: Partial<PlatformSettings>
  ): Promise<APIResponse<PlatformSettings>> {
    return this.http.put<APIResponse<PlatformSettings>>('/platform/settings', data);
  }

  async getNavigation(): Promise<APIResponse<NavigationItem[]>> {
    return this.http.get<APIResponse<NavigationItem[]>>('/platform/navigation');
  }

  async createNavigation(
    data: Omit<NavigationItem, 'navigationId' | 'createdAt' | 'updatedAt'>
  ): Promise<APIResponse<NavigationItem>> {
    return this.http.post<APIResponse<NavigationItem>>('/platform/navigation', data);
  }

  async updateNavigation(
    navigationId: string,
    data: Partial<NavigationItem>
  ): Promise<APIResponse<NavigationItem>> {
    return this.http.put<APIResponse<NavigationItem>>(
      `/platform/navigation/${navigationId}`,
      data
    );
  }

  async deleteNavigation(navigationId: string): Promise<APIResponse> {
    return this.http.delete<APIResponse>(`/platform/navigation/${navigationId}`);
  }

  // ============================================================
  // System Methods
  // ============================================================

  async healthCheck(): Promise<APIResponse<HealthCheckResponse>> {
    return this.http.get<APIResponse<HealthCheckResponse>>('/health');
  }

  async getVersion(): Promise<APIResponse<VersionInfo>> {
    return this.http.get<APIResponse<VersionInfo>>('/version');
  }

  // ============================================================
  // Token Management
  // ============================================================

  setAccessToken(token: string | null): void {
    this.http.setAccessToken(token);
    if (token) {
      localStorage.setItem('accessToken', token);
    } else {
      localStorage.removeItem('accessToken');
    }
  }

  getAccessToken(): string | null {
    return this.http.getAccessToken();
  }

  loadTokenFromStorage(): void {
    const token = localStorage.getItem('accessToken');
    if (token) {
      this.http.setAccessToken(token);
    }
  }
}

// ============================================================
// Default Export
// ============================================================

export const apiClient = new APIClient();
export default apiClient;
