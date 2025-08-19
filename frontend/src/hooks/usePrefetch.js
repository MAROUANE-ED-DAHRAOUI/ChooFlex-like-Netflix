import React from 'react';
import { usePrefetch } from '../hooks/useApi';
import { prefetchPopularContent } from '../utils/performance';

/**
 * Background Prefetch Service
 * Prefetches commonly accessed data to improve perceived performance
 */

export const usePrefetchService = () => {
  const prefetchHooks = usePrefetch();

  // Prefetch data after user interaction or idle time
  const startBackgroundPrefetch = async () => {
    try {
      // Wait a bit to not interfere with initial page load
      await new Promise(resolve => setTimeout(resolve, 3000));

      console.log('Starting background prefetch...');

      // Prefetch popular content
      await prefetchPopularContent(prefetchHooks);

      // Prefetch different content types
      const prefetchPromises = [
        prefetchHooks.prefetchLists(),
        prefetchHooks.prefetchLists('movie'),
        prefetchHooks.prefetchLists('series'),
        prefetchHooks.prefetchRandomMovie(),
        prefetchHooks.prefetchRandomMovie('movie'),
        prefetchHooks.prefetchRandomMovie('series')
      ];

      await Promise.allSettled(prefetchPromises);
      console.log('Background prefetch completed');

    } catch (error) {
      console.log('Background prefetch failed:', error);
    }
  };

  // Prefetch on user interaction (hover, focus, etc.)
  const prefetchOnInteraction = async (type, genre = null) => {
    try {
      await prefetchHooks.prefetchLists(type, genre);
    } catch (error) {
      console.log('Interaction prefetch failed:', error);
    }
  };

  // Prefetch specific movie when user hovers over card
  const prefetchMovie = async (movieId) => {
    try {
      await prefetchHooks.prefetchMovie(movieId);
    } catch (error) {
      console.log('Movie prefetch failed:', error);
    }
  };

  return {
    startBackgroundPrefetch,
    prefetchOnInteraction,
    prefetchMovie
  };
};

// Hook for auto-prefetching after login
export const useAutoPreetch = () => {
  const { startBackgroundPrefetch } = usePrefetchService();

  // Start prefetching when component mounts
  React.useEffect(() => {
    // Use requestIdleCallback if available, otherwise setTimeout
    if (window.requestIdleCallback) {
      window.requestIdleCallback(() => {
        startBackgroundPrefetch();
      }, { timeout: 5000 });
    } else {
      setTimeout(startBackgroundPrefetch, 2000);
    }
  }, [startBackgroundPrefetch]);
};

export default usePrefetchService;
