/**
 * API Shim - Central Export
 */

export { apiClient, ApiError } from './client';
export type { ApiRequestConfig, ApiResponse } from './client';

/**
 * Usage:
 * 
 * ```typescript
 * import { apiClient } from '@/shims/api';
 * 
 * // GET request
 * const { data } = await apiClient.get('/users');
 * 
 * // POST request
 * const { data } = await apiClient.post('/users', {
 *   name: 'John Doe',
 *   email: 'john@example.com',
 * });
 * 
 * // With params
 * const { data } = await apiClient.get('/users', {
 *   params: { page: 1, limit: 10 },
 * });
 * 
 * // Error handling
 * try {
 *   const { data } = await apiClient.get('/users/123');
 * } catch (error) {
 *   if (error instanceof ApiError) {
 *     console.error(error.status, error.message);
 *   }
 * }
 * ```
 */
