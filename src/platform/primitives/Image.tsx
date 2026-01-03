/**
 * Cross-platform Image Component (Web Implementation)
 * 
 * This is the web implementation using img.
 * For React Native, use Image.native.tsx
 */

import React, { useState } from 'react';

export interface ImageProps {
  source: { uri: string } | string;
  className?: string;
  style?: React.CSSProperties;
  alt?: string;
  resizeMode?: 'cover' | 'contain' | 'stretch' | 'repeat' | 'center';
  onLoad?: () => void;
  onError?: () => void;
  testID?: string;
  accessibilityLabel?: string;
}

export const Image: React.FC<ImageProps> = ({
  source,
  className,
  style,
  alt = '',
  resizeMode = 'cover',
  onLoad,
  onError,
  testID,
  accessibilityLabel,
}) => {
  const [loaded, setLoaded] = useState(false);

  const uri = typeof source === 'string' ? source : source.uri;

  const resizeModeToObjectFit: Record<string, string> = {
    cover: 'cover',
    contain: 'contain',
    stretch: 'fill',
    repeat: 'repeat',
    center: 'none',
  };

  const computedStyle: React.CSSProperties = {
    ...style,
    objectFit: resizeModeToObjectFit[resizeMode] as any,
    opacity: loaded ? 1 : 0,
    transition: 'opacity 0.2s ease',
  };

  const handleLoad = () => {
    setLoaded(true);
    onLoad?.();
  };

  return (
    <img
      data-testid={testID}
      className={className}
      style={computedStyle}
      src={uri}
      alt={alt || accessibilityLabel}
      onLoad={handleLoad}
      onError={onError}
      aria-label={accessibilityLabel}
    />
  );
};

Image.displayName = 'Image';
