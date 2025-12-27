/**
 * Performance Optimization Utilities
 * 
 * Các công cụ tối ưu hóa hiệu năng
 */

/**
 * Debounce function - Giảm số lần gọi hàm
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };

    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(later, wait);
  };
}

/**
 * Throttle function - Giới hạn tần suất gọi hàm
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  
  return function executedFunction(...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

/**
 * Lazy load component với retry mechanism
 */
export function lazyWithRetry<T extends React.ComponentType<any>>(
  componentImport: () => Promise<{ default: T }>,
  retries = 3,
  interval = 1000
): React.LazyExoticComponent<T> {
  return React.lazy(() =>
    new Promise<{ default: T }>((resolve, reject) => {
      const attemptLoad = (retriesLeft: number) => {
        componentImport()
          .then(resolve)
          .catch((error) => {
            if (retriesLeft === 0) {
              reject(error);
              return;
            }
            setTimeout(() => {
              console.log(`Retrying import... (${retriesLeft} attempts left)`);
              attemptLoad(retriesLeft - 1);
            }, interval);
          });
      };
      attemptLoad(retries);
    })
  );
}

/**
 * Performance monitoring
 */
export class PerformanceMonitor {
  private static marks: Map<string, number> = new Map();

  static start(label: string): void {
    this.marks.set(label, performance.now());
  }

  static end(label: string, log = true): number {
    const start = this.marks.get(label);
    if (!start) {
      console.warn(`No start mark found for "${label}"`);
      return 0;
    }

    const duration = performance.now() - start;
    this.marks.delete(label);

    if (log) {
      console.log(`⚡ ${label}: ${duration.toFixed(2)}ms`);
    }

    return duration;
  }

  static measure(label: string, fn: () => void): number {
    this.start(label);
    fn();
    return this.end(label);
  }

  static async measureAsync(label: string, fn: () => Promise<void>): Promise<number> {
    this.start(label);
    await fn();
    return this.end(label);
  }
}

/**
 * Check if should use reduced motion
 */
export function prefersReducedMotion(): boolean {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * Optimize event listener with passive flag
 */
export function addPassiveEventListener(
  element: HTMLElement | Window,
  event: string,
  handler: EventListener
): void {
  element.addEventListener(event, handler, { passive: true });
}

/**
 * Request idle callback wrapper với fallback
 */
export function requestIdleCallback(callback: () => void): void {
  if ("requestIdleCallback" in window) {
    window.requestIdleCallback(callback);
  } else {
    setTimeout(callback, 1);
  }
}

/**
 * Virtual scroll helper - Tính toán items visible trong viewport
 */
export function getVisibleRange(
  scrollTop: number,
  containerHeight: number,
  itemHeight: number,
  totalItems: number,
  overscan = 3
): { start: number; end: number } {
  const start = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
  const visibleCount = Math.ceil(containerHeight / itemHeight);
  const end = Math.min(totalItems, start + visibleCount + overscan * 2);

  return { start, end };
}

/**
 * Memoize expensive calculations
 */
export function memoize<T extends (...args: any[]) => any>(fn: T): T {
  const cache = new Map<string, ReturnType<T>>();

  return ((...args: Parameters<T>): ReturnType<T> => {
    const key = JSON.stringify(args);
    
    if (cache.has(key)) {
      return cache.get(key)!;
    }

    const result = fn(...args);
    cache.set(key, result);
    return result;
  }) as T;
}

/**
 * Batch updates để giảm re-renders
 */
export function batchUpdates<T>(
  updates: Array<() => void>,
  callback?: () => void
): void {
  // React 18+ tự động batch updates trong event handlers
  // Nhưng vẫn hữu ích cho non-event scenarios
  if (typeof React !== "undefined" && "startTransition" in React) {
    React.startTransition(() => {
      updates.forEach((update) => update());
      callback?.();
    });
  } else {
    updates.forEach((update) => update());
    callback?.();
  }
}

// Re-export React for lazyWithRetry
import * as React from "react";
