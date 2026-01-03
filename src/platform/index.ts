/**
 * Platform Abstraction Layer
 * 
 * Provides unified APIs that work across web and React Native
 */

// Network
export { 
  platformFetch, 
  fetchJSON, 
  fetchWithTimeout, 
  isFetchAvailable 
} from './network/fetch';

// Storage (re-export from lib/storage which already has platform guards)
export { 
  getFromStorage, 
  setToStorage, 
  removeFromStorage, 
  clearStorage, 
  isStorageAvailable 
} from '../lib/storage';

// Platform detection
export const Platform = {
  isWeb: typeof window !== 'undefined' && typeof document !== 'undefined',
  isNative: typeof navigator !== 'undefined' && navigator.product === 'ReactNative',
  isBrowser: typeof window !== 'undefined',
};

/**
 * Safe platform check utilities
 */
export const guards = {
  hasWindow: () => typeof window !== 'undefined',
  hasDocument: () => typeof document !== 'undefined',
  hasNavigator: () => typeof navigator !== 'undefined',
  hasLocalStorage: () => typeof localStorage !== 'undefined',
  hasSessionStorage: () => typeof sessionStorage !== 'undefined',
};
