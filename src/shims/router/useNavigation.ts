/**
 * useNavigation Hook Shim
 * 
 * Current: React Router (react-router)
 * Future: Next.js (next/navigation)
 */

import { useNavigate as useReactRouterNavigate, NavigateOptions } from 'react-router';

// ============================================================================
// CURRENT IMPLEMENTATION: React Router
// ============================================================================

export interface NavigationOptions {
  replace?: boolean;
  scroll?: boolean;
}

export interface UseNavigationReturn {
  push: (href: string, options?: NavigationOptions) => void;
  replace: (href: string, options?: NavigationOptions) => void;
  back: () => void;
  forward: () => void;
  refresh: () => void;
}

export const useNavigation = (): UseNavigationReturn => {
  const navigate = useReactRouterNavigate();

  return {
    push: (href: string, options?: NavigationOptions) => {
      const navigateOptions: NavigateOptions = {
        replace: options?.replace || false,
      };
      navigate(href, navigateOptions);
    },

    replace: (href: string) => {
      navigate(href, { replace: true });
    },

    back: () => {
      navigate(-1);
    },

    forward: () => {
      navigate(1);
    },

    refresh: () => {
      window.location.reload();
    },
  };
};

// ============================================================================
// FUTURE: Next.js Implementation (Commented out)
// ============================================================================

/*
import { useRouter } from 'next/navigation';

export const useNavigation = (): UseNavigationReturn => {
  const router = useRouter();

  return {
    push: (href: string, options?: NavigationOptions) => {
      router.push(href, { scroll: options?.scroll ?? true });
    },

    replace: (href: string, options?: NavigationOptions) => {
      router.replace(href, { scroll: options?.scroll ?? true });
    },

    back: () => {
      router.back();
    },

    forward: () => {
      router.forward();
    },

    refresh: () => {
      router.refresh();
    },
  };
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
 * 3. Update imports in this file only
 * 
 * Usage (SAME in both frameworks):
 * ```typescript
 * const navigation = useNavigation();
 * 
 * // Navigate to page
 * navigation.push('/dashboard');
 * 
 * // Replace current page
 * navigation.replace('/login');
 * 
 * // Go back
 * navigation.back();
 * 
 * // Refresh page
 * navigation.refresh();
 * ```
 * 
 * No changes needed in components using this hook!
 */

export default useNavigation;