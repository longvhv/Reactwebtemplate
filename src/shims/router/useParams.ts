/**
 * useParams Hook Shim
 * 
 * Current: React Router (react-router)
 * Future: Next.js (next/navigation)
 */

import { useParams as useReactRouterParams } from 'react-router';

// ============================================================================
// CURRENT IMPLEMENTATION: React Router
// ============================================================================

export const useParams = <T extends Record<string, string | undefined> = Record<string, string>>(): T => {
  return useReactRouterParams() as T;
};

// ============================================================================
// FUTURE: Next.js Implementation (Commented out)
// ============================================================================

/*
import { useParams as useNextParams } from 'next/navigation';

export const useParams = <T extends Record<string, string | undefined> = Record<string, string>>(): T => {
  return useNextParams() as T;
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
 * // In component
 * const { id } = useParams<{ id: string }>();
 * 
 * // With multiple params
 * const { userId, postId } = useParams<{ userId: string; postId: string }>();
 * ```
 * 
 * Route definitions differ:
 * 
 * React Router:
 * ```typescript
 * <Route path="/user/:userId/post/:postId" element={<Post />} />
 * ```
 * 
 * Next.js (file structure):
 * ```
 * app/user/[userId]/post/[postId]/page.tsx
 * ```
 */

export default useParams;