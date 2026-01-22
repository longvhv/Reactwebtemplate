/**
 * Image Component Shim
 * 
 * Current: Standard HTML img with fallback
 * Future: Next.js Image optimization
 * 
 * Purpose: Abstract image loading for easy migration + optimization
 */

import React, { useState } from 'react';

// ============================================================================
// CURRENT IMPLEMENTATION: Vite + Standard img
// ============================================================================

export interface ImageProps {
  src: string;
  alt: string;
  width?: number | string;
  height?: number | string;
  className?: string;
  priority?: boolean;  // Next.js compat - ignored in current impl
  quality?: number;    // Next.js compat - ignored in current impl
  fill?: boolean;      // Next.js compat - ignored in current impl
  sizes?: string;      // Next.js compat - ignored in current impl
  loading?: 'lazy' | 'eager';
  onError?: () => void;
  fallbackSrc?: string;
  style?: React.CSSProperties;
}

export const Image: React.FC<ImageProps> = ({
  src,
  alt,
  width,
  height,
  className,
  priority,     // eslint-disable-line @typescript-eslint/no-unused-vars
  quality,      // eslint-disable-line @typescript-eslint/no-unused-vars
  fill,
  sizes,        // eslint-disable-line @typescript-eslint/no-unused-vars
  loading = 'lazy',
  onError,
  fallbackSrc = '/images/placeholder.png',
  style,
}) => {
  const [imgSrc, setImgSrc] = useState(src);
  const [hasError, setHasError] = useState(false);

  const handleError = () => {
    if (!hasError) {
      setHasError(true);
      setImgSrc(fallbackSrc);
      onError?.();
    }
  };

  // Fill mode (absolute positioning)
  if (fill) {
    return (
      <img
        src={imgSrc}
        alt={alt}
        className={className}
        loading={loading}
        onError={handleError}
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          ...style,
        }}
      />
    );
  }

  // Standard mode
  return (
    <img
      src={imgSrc}
      alt={alt}
      width={width}
      height={height}
      className={className}
      loading={loading}
      onError={handleError}
      style={style}
    />
  );
};

// ============================================================================
// FUTURE: Next.js Implementation (Commented out)
// ============================================================================

/*
import NextImage from 'next/image';

export const Image: React.FC<ImageProps> = ({
  src,
  alt,
  width,
  height,
  className,
  priority = false,
  quality = 75,
  fill = false,
  sizes,
  loading = 'lazy',
  onError,
  fallbackSrc = '/images/placeholder.png',
  style,
}) => {
  const [imgSrc, setImgSrc] = useState(src);

  const handleError = () => {
    setImgSrc(fallbackSrc);
    onError?.();
  };

  if (fill) {
    return (
      <NextImage
        src={imgSrc}
        alt={alt}
        fill
        className={className}
        priority={priority}
        quality={quality}
        sizes={sizes}
        onError={handleError}
        style={style}
      />
    );
  }

  return (
    <NextImage
      src={imgSrc}
      alt={alt}
      width={Number(width) || 500}
      height={Number(height) || 500}
      className={className}
      priority={priority}
      quality={quality}
      loading={loading}
      onError={handleError}
      style={style}
    />
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
 * 2. Comment out current implementation
 * 3. Add to next.config.js:
 * ```javascript
 * module.exports = {
 *   images: {
 *     domains: ['your-cdn-domain.com'],
 *     formats: ['image/avif', 'image/webp'],
 *   },
 * }
 * ```
 * 
 * Benefits after migration:
 * - ✅ Automatic image optimization
 * - ✅ WebP/AVIF conversion
 * - ✅ Responsive images
 * - ✅ Lazy loading by default
 * - ✅ CDN caching
 * 
 * Usage (SAME in both):
 * ```typescript
 * <Image 
 *   src="/images/hero.jpg" 
 *   alt="Hero"
 *   width={800}
 *   height={600}
 *   priority
 * />
 * ```
 */

export default Image;
