/**
 * useSearchParams Hook Shim
 * 
 * Current: React Router (react-router)
 * Future: Next.js (next/navigation)
 */

import { useSearchParams as useReactRouterSearchParams } from 'react-router';

// ============================================================================
// CURRENT IMPLEMENTATION: React Router
// ============================================================================

export type UseSearchParamsReturn = [
  URLSearchParams,
  (params: URLSearchParams | Record<string, string>) => void
];

export const useSearchParams = (): UseSearchParamsReturn => {
  const [searchParams, setSearchParams] = useReactRouterSearchParams();

  const setParams = (params: URLSearchParams | Record<string, string>) => {
    if (params instanceof URLSearchParams) {
      setSearchParams(params);
    } else {
      const newParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          newParams.set(key, value);
        }
      });
      setSearchParams(newParams);
    }
  };

  return [searchParams, setParams];
};

// ============================================================================
// FUTURE: Next.js Implementation (Commented out)
// ============================================================================

/*
import { useSearchParams as useNextSearchParams, useRouter } from 'next/navigation';

export const useSearchParams = (): UseSearchParamsReturn => {
  const searchParams = useNextSearchParams();
  const router = useRouter();

  const setParams = (params: URLSearchParams | Record<string, string>) => {
    const newParams = new URLSearchParams();
    
    if (params instanceof URLSearchParams) {
      params.forEach((value, key) => {
        newParams.set(key, value);
      });
    } else {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          newParams.set(key, value);
        }
      });
    }

    router.push(`?${newParams.toString()}`);
  };

  return [searchParams, setParams];
};
*/

// ============================================================================
// MIGRATION NOTES
// ============================================================================

/**
 * To migrate to Next.js:
 * 
 * 1. Uncomment Next.js implementation above
 * 2. Comment out React Router implementation
 * 
 * Usage (SAME in both frameworks):
 * ```typescript
 * const [searchParams, setSearchParams] = useSearchParams();
 * 
 * // Read params
 * const query = searchParams.get('q');
 * const page = searchParams.get('page') || '1';
 * 
 * // Update params (Object syntax)
 * setSearchParams({ q: 'react', page: '2' });
 * 
 * // Update params (URLSearchParams syntax)
 * const params = new URLSearchParams(searchParams);
 * params.set('filter', 'active');
 * setSearchParams(params);
 * ```
 * 
 * Important differences:
 * - React Router: Updates without navigation
 * - Next.js: May trigger navigation (client-side)
 * 
 * Both preserve other query params when updating!
 */

export default useSearchParams;