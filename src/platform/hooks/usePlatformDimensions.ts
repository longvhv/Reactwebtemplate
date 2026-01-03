/**
 * Cross-platform Dimensions Hook
 * 
 * Provides responsive dimensions that work on both web and native
 */

import { useState, useEffect } from 'react';
import { Dimensions } from '../utils/platform';

export interface WindowDimensions {
  width: number;
  height: number;
  scale: number;
  fontScale: number;
}

export function usePlatformDimensions() {
  const [dimensions, setDimensions] = useState<WindowDimensions>(
    () => Dimensions.get('window')
  );

  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setDimensions(window);
    });

    return () => {
      subscription.remove();
    };
  }, []);

  return dimensions;
}

/**
 * Breakpoint hook for responsive design
 */
export function useBreakpoint() {
  const { width } = usePlatformDimensions();

  return {
    isMobile: width < 768,
    isTablet: width >= 768 && width < 1024,
    isDesktop: width >= 1024,
    isLargeDesktop: width >= 1280,
    width,
  };
}

/**
 * Orientation hook
 */
export function useOrientation() {
  const { width, height } = usePlatformDimensions();

  return {
    isPortrait: height > width,
    isLandscape: width > height,
  };
}
