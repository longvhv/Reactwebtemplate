/**
 * API Client Shim
 * 
 * Current: Fetch API / Axios
 * Future: Next.js with Server Actions support
 * 
 * Purpose: Abstract API calls for easy migration
 */

import { env } from '../env';

// ============================================================================
// CURRENT IMPLEMENTATION: Client-side fetch
// ============================================================================

export interface ApiRequestConfig {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  headers?: Record<string, string>;
  body?: unknown;
  params?: Record<string, string | number | boolean>;
  timeout?: number;
}

export interface ApiResponse<T = unknown> {
  data: T;
  status: number;
  statusText: string;
  headers: Headers;
}

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public statusText: string,
    public data?: unknown
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

class ApiClient {
  private baseURL: string;
  private timeout: number;
  private defaultHeaders: Record<string, string>;

  constructor() {
    this.baseURL = env.API_URL;
    this.timeout = env.API_TIMEOUT;
    this.defaultHeaders = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };
  }

  private getAuthToken(): string | null {
    // Get from localStorage or cookies
    return localStorage.getItem('auth_token');
  }

  private buildUrl(endpoint: string, params?: Record<string, string | number | boolean>): string {
    const url = new URL(endpoint, this.baseURL);
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        url.searchParams.append(key, String(value));
      });
    }
    return url.toString();
  }

  async request<T = unknown>(
    endpoint: string,
    config: ApiRequestConfig = {}
  ): Promise<ApiResponse<T>> {
    const {
      method = 'GET',
      headers = {},
      body,
      params,
      timeout = this.timeout,
    } = config;

    const url = this.buildUrl(endpoint, params);
    const token = this.getAuthToken();

    const requestHeaders: Record<string, string> = {
      ...this.defaultHeaders,
      ...headers,
    };

    if (token) {
      requestHeaders['Authorization'] = `Bearer ${token}`;
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(url, {
        method,
        headers: requestHeaders,
        body: body ? JSON.stringify(body) : undefined,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new ApiError(
          data?.message || response.statusText,
          response.status,
          response.statusText,
          data
        );
      }

      return {
        data: data as T,
        status: response.status,
        statusText: response.statusText,
        headers: response.headers,
      };
    } catch (error) {
      clearTimeout(timeoutId);
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(
        error instanceof Error ? error.message : 'Network error',
        0,
        'Network Error'
      );
    }
  }

  // Convenience methods
  get<T = unknown>(endpoint: string, config?: Omit<ApiRequestConfig, 'method' | 'body'>) {
    return this.request<T>(endpoint, { ...config, method: 'GET' });
  }

  post<T = unknown>(endpoint: string, body?: unknown, config?: Omit<ApiRequestConfig, 'method' | 'body'>) {
    return this.request<T>(endpoint, { ...config, method: 'POST', body });
  }

  put<T = unknown>(endpoint: string, body?: unknown, config?: Omit<ApiRequestConfig, 'method' | 'body'>) {
    return this.request<T>(endpoint, { ...config, method: 'PUT', body });
  }

  patch<T = unknown>(endpoint: string, body?: unknown, config?: Omit<ApiRequestConfig, 'method' | 'body'>) {
    return this.request<T>(endpoint, { ...config, method: 'PATCH', body });
  }

  delete<T = unknown>(endpoint: string, config?: Omit<ApiRequestConfig, 'method' | 'body'>) {
    return this.request<T>(endpoint, { ...config, method: 'DELETE' });
  }
}

export const apiClient = new ApiClient();

// ============================================================================
// FUTURE: Next.js with Server Actions (Commented out)
// ============================================================================

/*
// For client components, same implementation works!
// But you can also use Server Actions for better security:

// app/actions/user.ts (Server Action)
'use server';

export async function getUser(id: string) {
  const response = await fetch(`${process.env.API_URL}/users/${id}`, {
    headers: {
      'Authorization': `Bearer ${process.env.API_SECRET}`, // Server-only secret
    },
  });
  return response.json();
}

// app/components/UserProfile.tsx (Client Component)
'use client';

import { getUser } from '@/app/actions/user';

export function UserProfile({ userId }: { userId: string }) {
  const [user, setUser] = useState(null);
  
  useEffect(() => {
    getUser(userId).then(setUser);
  }, [userId]);
  
  return <div>{user?.name}</div>;
}
*/

// ============================================================================
// MIGRATION NOTES
// ============================================================================

/**
 * To migrate to Next.js:
 * 
 * OPTION 1 - Keep current implementation (Client-side):
 * - Works perfectly in Next.js client components
 * - No changes needed
 * - API calls from browser
 * 
 * OPTION 2 - Use Server Actions (Recommended):
 * - More secure (secrets never exposed to browser)
 * - Better performance (server-to-server calls)
 * - Automatic caching
 * 
 * Example Server Action:
 * ```typescript
 * // app/actions/users.ts
 * 'use server';
 * 
 * export async function fetchUsers() {
 *   const res = await fetch(`${process.env.API_URL}/users`);
 *   return res.json();
 * }
 * ```
 * 
 * Usage in component:
 * ```typescript
 * 'use client';
 * 
 * import { fetchUsers } from '@/app/actions/users';
 * 
 * export function UserList() {
 *   const [users, setUsers] = useState([]);
 *   
 *   useEffect(() => {
 *     fetchUsers().then(setUsers);
 *   }, []);
 *   
 *   return <ul>{users.map(u => <li key={u.id}>{u.name}</li>)}</ul>;
 * }
 * ```
 */

export default apiClient;
