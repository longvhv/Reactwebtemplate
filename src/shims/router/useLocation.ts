/**
 * Router Shim - useLocation Hook
 * 
 * Provides location information with a consistent API across React Router and Next.js.
 */

import { useLocation as useReactRouterLocation, Location } from 'react-router';

// ============================================================================
// Types
// ============================================================================

/**
 * Location object structure
 */
export interface LocationState {
  pathname: string;
  search: string;
  hash: string;
  state?: any;
  key?: string;
}

/**
 * Return type for useLocation hook
 */
export type UseLocationReturn = LocationState;

// ============================================================================
// Implementation
// ============================================================================

/**
 * Returns the current location object
 * 
 * **Current (React Router):**
 * ```typescript
 * const location = useLocation();
 * console.log(location.pathname); // "/dashboard/users"
 * console.log(location.search);   // "?page=1&sort=name"
 * console.log(location.hash);     // "#section-1"
 * ```
 * 
 * **Future (Next.js):**
 * ```typescript
 * import { usePathname, useSearchParams } from 'next/navigation';
 * 
 * const pathname = usePathname();
 * const searchParams = useSearchParams();
 * 
 * return {
 *   pathname,
 *   search: searchParams.toString() ? `?${searchParams.toString()}` : '',
 *   hash: typeof window !== 'undefined' ? window.location.hash : '',
 * };
 * ```
 * 
 * @example
 * ```typescript
 * import { useLocation } from '@/shims/router';
 * 
 * function Breadcrumb() {
 *   const location = useLocation();
 *   const pathParts = location.pathname.split('/').filter(Boolean);
 *   
 *   return (
 *     <nav>
 *       {pathParts.map((part, index) => (
 *         <span key={index}>{part}</span>
 *       ))}
 *     </nav>
 *   );
 * }
 * ```
 */
export function useLocation(): UseLocationReturn {
  const location = useReactRouterLocation();
  
  return {
    pathname: location.pathname,
    search: location.search,
    hash: location.hash,
    state: location.state,
    key: location.key,
  };
}
