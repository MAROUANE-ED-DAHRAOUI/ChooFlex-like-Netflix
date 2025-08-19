import { movieCache, listCache, searchCache } from './cache';

/**
 * Performance Monitor and Cache Manager
 * Handles cache cleanup, performance monitoring, and optimization
 */

class PerformanceManager {
  constructor() {
    this.metrics = {
      cacheHits: 0,
      cacheMisses: 0,
      apiCalls: 0,
      loadTimes: []
    };
    
    this.cleanupInterval = null;
    this.metricsInterval = null;
    
    // Start automatic cleanup
    this.startCleanup();
    this.startMetricsCollection();
  }

  // Start automatic cache cleanup (runs every 5 minutes)
  startCleanup() {
    this.cleanupInterval = setInterval(() => {
      this.performCleanup();
    }, 5 * 60 * 1000); // 5 minutes
  }

  // Start metrics collection
  startMetricsCollection() {
    this.metricsInterval = setInterval(() => {
      this.collectMetrics();
    }, 60 * 1000); // 1 minute
  }

  // Perform cache cleanup
  performCleanup() {
    try {
      const movieCleanup = movieCache.cleanup();
      const listCleanup = listCache.cleanup();
      const searchCleanup = searchCache.cleanup();
      
      console.log('Cache cleanup completed:', {
        movies: movieCleanup,
        lists: listCleanup,
        search: searchCleanup
      });

      // If memory usage is high, be more aggressive
      if (this.isMemoryUsageHigh()) {
        this.aggressiveCleanup();
      }
    } catch (error) {
      console.error('Cache cleanup failed:', error);
    }
  }

  // Check if memory usage is high
  isMemoryUsageHigh() {
    if (performance.memory) {
      const usage = performance.memory.usedJSHeapSize / performance.memory.totalJSHeapSize;
      return usage > 0.85; // 85% threshold
    }
    return false;
  }

  // Aggressive cleanup when memory is high
  aggressiveCleanup() {
    console.log('Performing aggressive cache cleanup due to high memory usage');
    
    // Clear search cache completely (least important)
    searchCache.clear();
    
    // Reduce movie cache size
    const movieStats = movieCache.getStats();
    if (movieStats.total > 50) {
      // Clear oldest items
      const keys = Array.from(movieCache.memoryCache.keys());
      const keysToDelete = keys.slice(0, Math.floor(keys.length / 2));
      keysToDelete.forEach(key => movieCache.delete(key));
    }
  }

  // Collect performance metrics
  collectMetrics() {
    const stats = {
      movieCache: movieCache.getStats(),
      listCache: listCache.getStats(),
      searchCache: searchCache.getStats(),
      metrics: this.metrics
    };

    // Log stats in development
    if (process.env.NODE_ENV === 'development') {
      console.log('Performance stats:', stats);
    }

    // Store stats for analysis
    this.storeMetrics(stats);
  }

  // Store metrics for analysis
  storeMetrics(stats) {
    try {
      const existing = JSON.parse(localStorage.getItem('performance_metrics') || '[]');
      existing.push({
        timestamp: Date.now(),
        ...stats
      });

      // Keep only last 100 entries
      if (existing.length > 100) {
        existing.splice(0, existing.length - 100);
      }

      localStorage.setItem('performance_metrics', JSON.stringify(existing));
    } catch (error) {
      console.warn('Failed to store performance metrics:', error);
    }
  }

  // Record cache hit
  recordCacheHit() {
    this.metrics.cacheHits++;
  }

  // Record cache miss
  recordCacheMiss() {
    this.metrics.cacheMisses++;
  }

  // Record API call
  recordApiCall() {
    this.metrics.apiCalls++;
  }

  // Record load time
  recordLoadTime(duration) {
    this.metrics.loadTimes.push(duration);
    
    // Keep only last 50 load times
    if (this.metrics.loadTimes.length > 50) {
      this.metrics.loadTimes.shift();
    }
  }

  // Get average load time
  getAverageLoadTime() {
    if (this.metrics.loadTimes.length === 0) return 0;
    const sum = this.metrics.loadTimes.reduce((a, b) => a + b, 0);
    return sum / this.metrics.loadTimes.length;
  }

  // Get cache hit ratio
  getCacheHitRatio() {
    const total = this.metrics.cacheHits + this.metrics.cacheMisses;
    return total > 0 ? this.metrics.cacheHits / total : 0;
  }

  // Prefetch popular content
  async prefetchPopularContent(apiHooks) {
    try {
      // Prefetch popular movie lists
      await apiHooks.prefetchLists();
      await apiHooks.prefetchLists('movie');
      await apiHooks.prefetchLists('series');
      
      console.log('Popular content prefetched successfully');
    } catch (error) {
      console.error('Failed to prefetch popular content:', error);
    }
  }

  // Optimize images (lazy loading helper)
  optimizeImageLoading() {
    // Create intersection observer for lazy loading
    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            if (img.dataset.src) {
              img.src = img.dataset.src;
              img.removeAttribute('data-src');
              imageObserver.unobserve(img);
            }
          }
        });
      }, {
        rootMargin: '50px 0px',
        threshold: 0.1
      });

      return imageObserver;
    }
    return null;
  }

  // Get performance summary
  getPerformanceSummary() {
    return {
      cacheHitRatio: this.getCacheHitRatio(),
      averageLoadTime: this.getAverageLoadTime(),
      totalApiCalls: this.metrics.apiCalls,
      cacheStats: {
        movies: movieCache.getStats(),
        lists: listCache.getStats(),
        search: searchCache.getStats()
      }
    };
  }

  // Stop all intervals (cleanup)
  destroy() {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
    }
    if (this.metricsInterval) {
      clearInterval(this.metricsInterval);
    }
  }
}

// Create singleton instance
const performanceManager = new PerformanceManager();

// Utility functions for easy access
export const recordCacheHit = () => performanceManager.recordCacheHit();
export const recordCacheMiss = () => performanceManager.recordCacheMiss();
export const recordApiCall = () => performanceManager.recordApiCall();
export const recordLoadTime = (duration) => performanceManager.recordLoadTime(duration);

export const getPerformanceSummary = () => performanceManager.getPerformanceSummary();
export const prefetchPopularContent = (apiHooks) => performanceManager.prefetchPopularContent(apiHooks);
export const createImageObserver = () => performanceManager.optimizeImageLoading();

export default performanceManager;
