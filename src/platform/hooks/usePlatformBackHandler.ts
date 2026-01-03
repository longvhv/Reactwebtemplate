/**
 * Cross-platform Back Handler Hook
 * 
 * Web: Uses browser history
 * Native: Uses BackHandler from react-native
 */

import { useEffect } from 'react';
import { Platform } from '../utils/platform';

export function usePlatformBackHandler(
  handler: () => boolean,
  enabled: boolean = true
) {
  useEffect(() => {
    if (!enabled) return;

    if (Platform.isWeb()) {
      // Web implementation using browser history
      const handlePopState = (event: PopStateEvent) => {
        const shouldPreventDefault = handler();
        if (shouldPreventDefault) {
          event.preventDefault();
          // Push state back to prevent navigation
          window.history.pushState(null, '', window.location.href);
        }
      };

      // Push initial state
      window.history.pushState(null, '', window.location.href);
      window.addEventListener('popstate', handlePopState);

      return () => {
        window.removeEventListener('popstate', handlePopState);
      };
    } else {
      // Native implementation would use BackHandler from react-native
      // For now, this is a placeholder
      console.log('BackHandler not implemented for native platform');
    }
  }, [handler, enabled]);
}
