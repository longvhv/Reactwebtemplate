/**
 * Link Component Shim
 * 
 * Current: React Router (react-router)
 * Future: Next.js (next/link)
 */

import React from 'react';
import { Link as ReactRouterLink, LinkProps as ReactRouterLinkProps } from 'react-router';

// ============================================================================
// CURRENT IMPLEMENTATION: React Router
// ============================================================================

export interface LinkProps extends Omit<ReactRouterLinkProps, 'to'> {
  href: string;
  children: React.ReactNode;
  className?: string;
  prefetch?: boolean; // Next.js compat - ignored in React Router
  scroll?: boolean;   // Next.js compat - ignored in React Router
  replace?: boolean;
}

export const Link: React.FC<LinkProps> = ({ 
  href, 
  children, 
  prefetch, // eslint-disable-line @typescript-eslint/no-unused-vars
  scroll,   // eslint-disable-line @typescript-eslint/no-unused-vars
  replace,
  ...props 
}) => {
  return (
    <ReactRouterLink 
      to={href} 
      replace={replace}
      {...props}
    >
      {children}
    </ReactRouterLink>
  );
};

// ============================================================================
// FUTURE: Next.js Implementation (Commented out)
// ============================================================================

/*
import NextLink from 'next/link';

export const Link: React.FC<LinkProps> = ({ 
  href, 
  children, 
  prefetch = true,
  scroll = true,
  replace = false,
  ...props 
}) => {
  return (
    <NextLink 
      href={href} 
      prefetch={prefetch}
      scroll={scroll}
      replace={replace}
      {...props}
    >
      {children}
    </NextLink>
  );
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
 * 3. Update package.json dependencies:
 *    - Remove: react-router-dom
 *    - Add: Next.js (already includes routing)
 * 
 * 4. Find & Replace in codebase:
 *    - Keep: import { Link } from '@/shims/router'
 *    - No changes needed in components!
 * 
 * Features preserved:
 * - ✅ href prop (works in both)
 * - ✅ className prop (works in both)
 * - ✅ replace prop (works in both)
 * - ✅ prefetch prop (Next.js only, ignored in React Router)
 * - ✅ scroll prop (Next.js only, ignored in React Router)
 */

export default Link;