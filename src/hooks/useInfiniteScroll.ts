/**
 * useInfiniteScroll Hook
 * Infinite scrolling with loading state
 */

import { useEffect, useRef, useState, useCallback } from 'react';

interface UseInfiniteScrollOptions {
  threshold?: number;
  rootMargin?: string;
  hasMore: boolean;
  isLoading: boolean;
  onLoadMore: () => void | Promise<void>;
}

export function useInfiniteScroll({
  threshold = 1.0,
  rootMargin = '100px',
  hasMore,
  isLoading,
  onLoadMore,
}: UseInfiniteScrollOptions) {
  const observerTarget = useRef<HTMLDivElement>(null);
  const [isIntersecting, setIsIntersecting] = useState(false);

  const handleLoadMore = useCallback(async () => {
    if (!isLoading && hasMore) {
      await onLoadMore();
    }
  }, [isLoading, hasMore, onLoadMore]);

  useEffect(() => {
    const target = observerTarget.current;
    if (!target) return;
    
    // ✅ Guard for React Native - IntersectionObserver is web-only
    if (typeof window === 'undefined' || typeof IntersectionObserver === 'undefined') {
      // Fallback: assume always intersecting in non-browser environments
      setIsIntersecting(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        setIsIntersecting(entry.isIntersecting);
      },
      {
        threshold,
        rootMargin,
      }
    );

    observer.observe(target);

    return () => {
      observer.unobserve(target);
    };
  }, [threshold, rootMargin]);

  useEffect(() => {
    if (isIntersecting) {
      handleLoadMore();
    }
  }, [isIntersecting, handleLoadMore]);

  return {
    observerTarget,
    isIntersecting,
  };
}