/**
 * Platform-agnostic fetch abstraction
 * 
 * This provides a unified API for making HTTP requests that works on both
 * web and React Native environments.
 * 
 * Usage:
 * ```tsx
 * import { platformFetch } from './platform/network/fetch';
 * 
 * const response = await platformFetch('/api/users');
 * const data = await response.json();
 * ```
 */

/**
 * Platform-agnostic fetch function
 * 
 * On web: Uses native fetch API
 * On React Native: Uses fetch (available globally in RN)
 * 
 * @param url - The URL to fetch
 * @param options - Fetch options (same as native fetch)
 * @returns Promise<Response>
 */
export async function platformFetch(
  url: string | Request,
  options?: RequestInit
): Promise<Response> {
  // Check if fetch is available
  if (typeof fetch === 'undefined') {
    throw new Error(
      'fetch is not available. Make sure you are running in a supported environment.'
    );
  }

  return fetch(url, options);
}

/**
 * Type-safe fetch wrapper with automatic JSON parsing
 * 
 * @param url - The URL to fetch
 * @param options - Fetch options
 * @returns Promise<T> - Parsed JSON response
 */
export async function fetchJSON<T = any>(
  url: string,
  options?: RequestInit
): Promise<T> {
  const response = await platformFetch(url, options);
  
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }
  
  return response.json();
}

/**
 * Fetch with timeout support
 * 
 * @param url - The URL to fetch  
 * @param options - Fetch options
 * @param timeout - Timeout in milliseconds (default: 10000)
 * @returns Promise<Response>
 */
export async function fetchWithTimeout(
  url: string,
  options?: RequestInit,
  timeout: number = 10000
): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await platformFetch(url, {
      ...options,
      signal: controller.signal,
    });
    return response;
  } finally {
    clearTimeout(timeoutId);
  }
}

/**
 * Check if fetch is available in current environment
 * 
 * @returns boolean
 */
export function isFetchAvailable(): boolean {
  return typeof fetch !== 'undefined';
}

// Re-export fetch as default for easy migration
export default platformFetch;
