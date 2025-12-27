/**
 * Enhanced API Service
 * Axios-style API client with interceptors for microservice integration
 */

import { env } from '../config/env';
import { logger } from '../utils/logger';

interface RequestConfig extends RequestInit {
  params?: Record<string, string>;
  timeout?: number;
  baseURL?: string;
}

interface ApiResponse<T = any> {
  data: T;
  status: number;
  statusText: string;
  headers: Headers;
  config: RequestConfig;
}

interface ApiError extends Error {
  response?: {
    data: any;
    status: number;
    statusText: string;
  };
  request?: RequestConfig;
  config?: RequestConfig;
}

type RequestInterceptor = (config: RequestConfig) => RequestConfig | Promise<RequestConfig>;
type ResponseInterceptor = (response: ApiResponse) => ApiResponse | Promise<ApiResponse>;
type ErrorInterceptor = (error: ApiError) => any;

class ApiService {
  private baseURL: string;
  private defaultTimeout: number;
  private defaultHeaders: Record<string, string>;
  private requestInterceptors: RequestInterceptor[] = [];
  private responseInterceptors: ResponseInterceptor[] = [];
  private errorInterceptors: ErrorInterceptor[] = [];
  private authToken: string | null = null;

  constructor(baseURL?: string) {
    this.baseURL = baseURL || env.apiGatewayUrl;
    this.defaultTimeout = env.apiTimeout;
    this.defaultHeaders = {
      'Content-Type': 'application/json',
      'X-Service-Name': env.serviceName,
      'X-Service-Version': env.serviceVersion,
    };

    // Setup default interceptors
    this.setupDefaultInterceptors();
  }

  /**
   * Setup default request/response interceptors
   */
  private setupDefaultInterceptors(): void {
    // Request interceptor: Add auth token
    this.requestInterceptors.push((config) => {
      if (this.authToken) {
        config.headers = {
          ...config.headers,
          Authorization: `Bearer ${this.authToken}`,
        };
      }
      return config;
    });

    // Request interceptor: Log requests
    this.requestInterceptors.push((config) => {
      logger.logRequest(
        config.method || 'GET',
        this.buildURL(config.baseURL || this.baseURL, '', config.params),
        config.body
      );
      return config;
    });

    // Response interceptor: Log responses
    this.responseInterceptors.push((response) => {
      logger.logResponse(
        response.config.method || 'GET',
        this.buildURL(response.config.baseURL || this.baseURL, '', response.config.params),
        response.status
      );
      return response;
    });

    // Error interceptor: Log errors
    this.errorInterceptors.push((error) => {
      logger.logApiError(
        error.config?.method || 'UNKNOWN',
        error.config?.baseURL || 'UNKNOWN',
        error
      );
      throw error;
    });
  }

  /**
   * Add request interceptor
   */
  addRequestInterceptor(interceptor: RequestInterceptor): void {
    this.requestInterceptors.push(interceptor);
  }

  /**
   * Add response interceptor
   */
  addResponseInterceptor(interceptor: ResponseInterceptor): void {
    this.responseInterceptors.push(interceptor);
  }

  /**
   * Add error interceptor
   */
  addErrorInterceptor(interceptor: ErrorInterceptor): void {
    this.errorInterceptors.push(interceptor);
  }

  /**
   * Build full URL with query parameters
   */
  private buildURL(
    baseURL: string,
    endpoint: string,
    params?: Record<string, string>
  ): string {
    const base = baseURL.endsWith('/') ? baseURL.slice(0, -1) : baseURL;
    const path = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    const url = new URL(path, base.startsWith('http') ? base : `${window.location.origin}${base}`);

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        url.searchParams.append(key, value);
      });
    }

    return url.toString();
  }

  /**
   * Apply request interceptors
   */
  private async applyRequestInterceptors(config: RequestConfig): Promise<RequestConfig> {
    let modifiedConfig = config;
    for (const interceptor of this.requestInterceptors) {
      modifiedConfig = await interceptor(modifiedConfig);
    }
    return modifiedConfig;
  }

  /**
   * Apply response interceptors
   */
  private async applyResponseInterceptors(response: ApiResponse): Promise<ApiResponse> {
    let modifiedResponse = response;
    for (const interceptor of this.responseInterceptors) {
      modifiedResponse = await interceptor(modifiedResponse);
    }
    return modifiedResponse;
  }

  /**
   * Apply error interceptors
   */
  private async applyErrorInterceptors(error: ApiError): Promise<any> {
    let modifiedError = error;
    for (const interceptor of this.errorInterceptors) {
      try {
        modifiedError = await interceptor(modifiedError);
      } catch (e) {
        modifiedError = e as ApiError;
      }
    }
    throw modifiedError;
  }

  /**
   * Make HTTP request
   */
  private async request<T>(
    endpoint: string,
    config: RequestConfig = {}
  ): Promise<ApiResponse<T>> {
    const {
      params,
      timeout = this.defaultTimeout,
      baseURL = this.baseURL,
      ...fetchConfig
    } = config;

    // Apply request interceptors
    const interceptedConfig = await this.applyRequestInterceptors({
      ...config,
      baseURL,
    });

    const url = this.buildURL(baseURL, endpoint, params);
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(url, {
        ...fetchConfig,
        headers: {
          ...this.defaultHeaders,
          ...fetchConfig.headers,
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      let data: T;
      const contentType = response.headers.get('content-type');
      
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        data = (await response.text()) as any;
      }

      if (!response.ok) {
        const error: ApiError = new Error(`HTTP ${response.status}: ${response.statusText}`) as ApiError;
        error.response = {
          data,
          status: response.status,
          statusText: response.statusText,
        };
        error.config = interceptedConfig;
        throw error;
      }

      const apiResponse: ApiResponse<T> = {
        data,
        status: response.status,
        statusText: response.statusText,
        headers: response.headers,
        config: interceptedConfig,
      };

      // Apply response interceptors
      return await this.applyResponseInterceptors(apiResponse);
    } catch (error) {
      clearTimeout(timeoutId);

      const apiError = error as ApiError;
      if (!apiError.config) {
        apiError.config = interceptedConfig;
      }

      if (apiError.name === 'AbortError') {
        apiError.message = 'Request timeout';
      }

      // Apply error interceptors
      return await this.applyErrorInterceptors(apiError);
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
   * Set authentication token
   */
  setAuthToken(token: string): void {
    this.authToken = token;
    logger.info('Auth token set');
  }

  /**
   * Clear authentication token
   */
  clearAuthToken(): void {
    this.authToken = null;
    logger.info('Auth token cleared');
  }

  /**
   * Get authentication token
   */
  getAuthToken(): string | null {
    return this.authToken;
  }
}

// Export singleton instance
export const api = new ApiService();
export default api;
