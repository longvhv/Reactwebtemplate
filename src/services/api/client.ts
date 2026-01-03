/**
 * API Client
 * Centralized API communication layer
 */

import { platformFetch } from '../../platform/network/fetch';

interface RequestConfig extends RequestInit {
  params?: Record<string, string>;
  timeout?: number;
}

interface ApiResponse<T = any> {
  data: T;
  status: number;
  message?: string;
}

class ApiClient {
  private baseURL: string;
  private defaultTimeout: number = 30000;
  private defaultHeaders: HeadersInit = {
    'Content-Type': 'application/json',
  };

  constructor(baseURL: string = '/api') {
    this.baseURL = baseURL;
  }

  /**
   * Build URL with query parameters
   */
  private buildURL(endpoint: string, params?: Record<string, string>): string {
    // ✅ Guard: URL constructor not available on React Native
    if (typeof URL === 'undefined') {
      // Fallback: Manual URL building
      let url = endpoint.startsWith('http') ? endpoint : this.baseURL + endpoint;
      if (params && Object.keys(params).length > 0) {
        const queryString = Object.entries(params)
          .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
          .join('&');
        url += (url.includes('?') ? '&' : '?') + queryString;
      }
      return url;
    }
    
    // Handle absolute URLs
    if (endpoint.startsWith('http://') || endpoint.startsWith('https://')) {
      const url = new URL(endpoint);
      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          url.searchParams.append(key, value);
        });
      }
      return url.toString();
    }
    
    // Handle relative URLs
    const baseUrl = typeof window !== 'undefined' 
      ? window.location.origin + this.baseURL
      : this.baseURL;
    const url = new URL(endpoint, baseUrl);
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        url.searchParams.append(key, value);
      });
    }
    
    return url.toString();
  }

  /**
   * Make HTTP request with timeout
   */
  private async request<T>(
    endpoint: string,
    config: RequestConfig = {}
  ): Promise<ApiResponse<T>> {
    const { params, timeout = this.defaultTimeout, ...fetchConfig } = config;
    
    const url = this.buildURL(endpoint, params);
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await platformFetch(url, {
        ...fetchConfig,
        headers: {
          ...this.defaultHeaders,
          ...fetchConfig.headers,
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();

      return {
        data,
        status: response.status,
      };
    } catch (error) {
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new Error('Request timeout');
        }
        throw error;
      }
      throw new Error('Unknown error occurred');
    }
  }

  /**
   * GET request
   */
  async get<T>(endpoint: string, config?: RequestConfig): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...config, method: 'GET' });
  }

  /**
   * POST request
   */
  async post<T>(endpoint: string, data?: any, config?: RequestConfig): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      ...config,
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  /**
   * PUT request
   */
  async put<T>(endpoint: string, data?: any, config?: RequestConfig): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      ...config,
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  /**
   * PATCH request
   */
  async patch<T>(endpoint: string, data?: any, config?: RequestConfig): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      ...config,
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  /**
   * DELETE request
   */
  async delete<T>(endpoint: string, config?: RequestConfig): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...config, method: 'DELETE' });
  }

  /**
   * Set authorization token
   */
  setAuthToken(token: string) {
    this.defaultHeaders = {
      ...this.defaultHeaders,
      Authorization: `Bearer ${token}`,
    };
  }

  /**
   * Clear authorization token
   */
  clearAuthToken() {
    const { Authorization, ...rest } = this.defaultHeaders as any;
    this.defaultHeaders = rest;
  }
}

// Export singleton instance
export const apiClient = new ApiClient();