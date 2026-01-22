/**
 * Router Shim - Central Export
 * 
 * Import routing utilities from here for easy Next.js migration
 */

export { Link } from './Link';
export type { LinkProps } from './Link';

export { useNavigation } from './useNavigation';
export type { UseNavigationReturn, NavigationOptions } from './useNavigation';

export { useParams } from './useParams';

export { useSearchParams } from './useSearchParams';
export type { UseSearchParamsReturn } from './useSearchParams';

export { useLocation } from './useLocation';
export type { UseLocationReturn, LocationState } from './useLocation';

/**
 * Usage in components:
 * 
 * ```typescript
 * import { Link, useNavigation, useParams, useSearchParams, useLocation } from '@/shims/router';
 * 
 * function MyComponent() {
 *   const navigation = useNavigation();
 *   const { id } = useParams<{ id: string }>();
 *   const [searchParams] = useSearchParams();
 *   const location = useLocation();
 *   
 *   return (
 *     <div>
 *       <Link href="/dashboard">Dashboard</Link>
 *       <button onClick={() => navigation.push('/profile')}>
 *         Go to Profile
 *       </button>
 *       <p>Current path: {location.pathname}</p>
 *     </div>
 *   );
 * }
 * ```
 */