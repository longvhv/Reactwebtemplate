/**
 * Head/Metadata Component Shim
 * 
 * Current: react-helmet-async
 * Future: Next.js Metadata API
 * 
 * Purpose: Abstract document head management for easy migration
 */

import React from 'react';
import { Helmet } from 'react-helmet-async';

// ============================================================================
// CURRENT IMPLEMENTATION: react-helmet-async
// ============================================================================

export interface HeadProps {
  title?: string;
  description?: string;
  keywords?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogUrl?: string;
  twitterCard?: 'summary' | 'summary_large_image' | 'app' | 'player';
  canonical?: string;
  noindex?: boolean;
  children?: React.ReactNode;
}

export const Head: React.FC<HeadProps> = ({
  title,
  description,
  keywords,
  ogTitle,
  ogDescription,
  ogImage,
  ogUrl,
  twitterCard = 'summary_large_image',
  canonical,
  noindex = false,
  children,
}) => {
  const fullTitle = title ? `${title} | VHV Platform` : 'VHV Platform';

  return (
    <Helmet>
      {/* Basic Meta */}
      {title && <title>{fullTitle}</title>}
      {description && <meta name="description" content={description} />}
      {keywords && <meta name="keywords" content={keywords} />}
      {canonical && <link rel="canonical" href={canonical} />}
      {noindex && <meta name="robots" content="noindex,nofollow" />}

      {/* Open Graph */}
      {ogTitle && <meta property="og:title" content={ogTitle} />}
      {ogDescription && <meta property="og:description" content={ogDescription} />}
      {ogImage && <meta property="og:image" content={ogImage} />}
      {ogUrl && <meta property="og:url" content={ogUrl} />}
      <meta property="og:type" content="website" />

      {/* Twitter Card */}
      <meta name="twitter:card" content={twitterCard} />
      {ogTitle && <meta name="twitter:title" content={ogTitle} />}
      {ogDescription && <meta name="twitter:description" content={ogDescription} />}
      {ogImage && <meta name="twitter:image" content={ogImage} />}

      {/* Custom children */}
      {children}
    </Helmet>
  );
};

// ============================================================================
// FUTURE: Next.js Metadata API (Commented out)
// ============================================================================

/*
// NOTE: In Next.js, metadata is typically exported from page.tsx, not a component
// But we can still provide a component wrapper for dynamic metadata

import { Metadata } from 'next';

// Export for static metadata in page.tsx
export const generateMetadata = (props: HeadProps): Metadata => {
  const fullTitle = props.title ? `${props.title} | VHV Platform` : 'VHV Platform';

  return {
    title: fullTitle,
    description: props.description,
    keywords: props.keywords?.split(',').map(k => k.trim()),
    
    openGraph: {
      title: props.ogTitle || props.title,
      description: props.ogDescription || props.description,
      images: props.ogImage ? [{ url: props.ogImage }] : undefined,
      url: props.ogUrl,
      type: 'website',
    },
    
    twitter: {
      card: props.twitterCard || 'summary_large_image',
      title: props.ogTitle || props.title,
      description: props.ogDescription || props.description,
      images: props.ogImage ? [props.ogImage] : undefined,
    },
    
    alternates: {
      canonical: props.canonical,
    },
    
    robots: props.noindex ? 'noindex,nofollow' : 'index,follow',
  };
};

// For client components that need dynamic metadata
export const Head: React.FC<HeadProps> = (props) => {
  // In Next.js 13+, use generateMetadata in page.tsx instead
  // This component would be removed or simplified
  return null;
};
*/

// ============================================================================
// MIGRATION NOTES
// ============================================================================

/**
 * To migrate to Next.js:
 * 
 * OPTION 1 - Static Metadata (Recommended):
 * ```typescript
 * // app/dashboard/page.tsx
 * import type { Metadata } from 'next';
 * 
 * export const metadata: Metadata = {
 *   title: 'Dashboard | VHV Platform',
 *   description: 'Your dashboard overview',
 * };
 * 
 * export default function DashboardPage() {
 *   return <div>Dashboard</div>;
 * }
 * ```
 * 
 * OPTION 2 - Dynamic Metadata:
 * ```typescript
 * // app/user/[id]/page.tsx
 * export async function generateMetadata({ params }): Promise<Metadata> {
 *   const user = await fetchUser(params.id);
 *   return {
 *     title: `${user.name} | VHV Platform`,
 *     description: user.bio,
 *   };
 * }
 * ```
 * 
 * Current usage (Component-based):
 * ```typescript
 * <Head 
 *   title="Dashboard"
 *   description="Your dashboard"
 *   ogImage="/og-image.jpg"
 * />
 * ```
 */

export default Head;
