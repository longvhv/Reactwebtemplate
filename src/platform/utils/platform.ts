/**
 * Platform Detection Utilities
 * Provides cross-platform detection and utilities
 */

// Platform type
export type PlatformType = 'web' | 'ios' | 'android' | 'windows' | 'macos';

// Platform select specifics type
export type PlatformSelectSpecifics<T> = {
  web?: T;
  native?: T;
  ios?: T;
  android?: T;
  default?: T;
};

/**
 * Platform select function
 */
function platformSelect<T>(specifics: PlatformSelectSpecifics<T>): T {
  const os = Platform.OS;
  
  if (os === 'web' && specifics.web !== undefined) {
    return specifics.web;
  }
  if ((os === 'ios' || os === 'android') && specifics.native !== undefined) {
    return specifics.native;
  }
  if (os === 'ios' && specifics.ios !== undefined) {
    return specifics.ios;
  }
  if (os === 'android' && specifics.android !== undefined) {
    return specifics.android;
  }
  return specifics.default as T;
}

/**
 * Detect current platform
 * This will be overridden in native builds
 */
export const Platform = {
  OS: (typeof window !== 'undefined' ? 'web' : 'web') as PlatformType,
  
  select: platformSelect,
  
  isWeb: () => Platform.OS === 'web',
  isNative: () => Platform.OS === 'ios' || Platform.OS === 'android',
  isIOS: () => Platform.OS === 'ios',
  isAndroid: () => Platform.OS === 'android',
};

/**
 * Dimensions utilities (cross-platform)
 */
export const Dimensions = {
  get: (dimension: 'window' | 'screen') => {
    if (typeof window === 'undefined') {
      return { width: 0, height: 0, scale: 1, fontScale: 1 };
    }
    
    return {
      width: window.innerWidth,
      height: window.innerHeight,
      scale: window.devicePixelRatio || 1,
      fontScale: 1,
    };
  },
  
  addEventListener: (type: 'change', handler: (dims: any) => void) => {
    if (typeof window === 'undefined') return { remove: () => {} };
    
    const listener = () => {
      handler({
        window: Dimensions.get('window'),
        screen: Dimensions.get('screen'),
      });
    };
    
    window.addEventListener('resize', listener);
    
    return {
      remove: () => window.removeEventListener('resize', listener),
    };
  },
};

/**
 * StyleSheet utilities (cross-platform)
 */
function createStyleSheet<T extends { [key: string]: any }>(styles: T): T {
  return styles;
}

export const StyleSheet = {
  create: createStyleSheet,
  
  flatten: (style: any): any => {
    if (Array.isArray(style)) {
      return Object.assign({}, ...style.filter(Boolean));
    }
    return style;
  },
  
  hairlineWidth: 1,
};

/**
 * Pixel ratio utilities
 */
export const PixelRatio = {
  get: () => (typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1),
  getFontScale: () => 1,
  getPixelSizeForLayoutSize: (layoutSize: number) => Math.round(layoutSize * PixelRatio.get()),
  roundToNearestPixel: (layoutSize: number) => {
    const ratio = PixelRatio.get();
    return Math.round(layoutSize * ratio) / ratio;
  },
};
