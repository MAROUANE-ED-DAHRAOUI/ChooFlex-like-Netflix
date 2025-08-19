/**
 * Cache utility for storing and retrieving movie data
 * Implements memory cache with optional localStorage persistence
 */

class Cache {
  constructor(options = {}) {
    this.memoryCache = new Map();
    this.maxSize = options.maxSize || 100;
    this.ttl = options.ttl || 5 * 60 * 1000; // 5 minutes default
    this.persistToStorage = options.persistToStorage || false;
    this.storageKey = options.storageKey || 'chooflex_cache';
    
    // Load from localStorage if enabled
    if (this.persistToStorage) {
      this.loadFromStorage();
    }
  }

  generateKey(endpoint, params = {}) {
    const sortedParams = Object.keys(params)
      .sort()
      .reduce((result, key) => {
        result[key] = params[key];
        return result;
      }, {});
    
    return `${endpoint}_${JSON.stringify(sortedParams)}`;
  }

  set(key, data, customTtl = null) {
    const ttl = customTtl || this.ttl;
    const item = {
      data,
      timestamp: Date.now(),
      ttl
    };

    // Remove oldest items if cache is full
    if (this.memoryCache.size >= this.maxSize) {
      const oldestKey = this.memoryCache.keys().next().value;
      this.memoryCache.delete(oldestKey);
    }

    this.memoryCache.set(key, item);

    // Persist to localStorage if enabled
    if (this.persistToStorage) {
      this.saveToStorage();
    }
  }

  get(key) {
    const item = this.memoryCache.get(key);
    
    if (!item) {
      return null;
    }

    // Check if item has expired
    if (Date.now() - item.timestamp > item.ttl) {
      this.memoryCache.delete(key);
      if (this.persistToStorage) {
        this.saveToStorage();
      }
      return null;
    }

    return item.data;
  }

  has(key) {
    return this.get(key) !== null;
  }

  delete(key) {
    const result = this.memoryCache.delete(key);
    if (this.persistToStorage) {
      this.saveToStorage();
    }
    return result;
  }

  clear() {
    this.memoryCache.clear();
    if (this.persistToStorage) {
      localStorage.removeItem(this.storageKey);
    }
  }

  // Get cache statistics
  getStats() {
    const now = Date.now();
    let validItems = 0;
    let expiredItems = 0;

    for (const [key, item] of this.memoryCache) {
      if (now - item.timestamp > item.ttl) {
        expiredItems++;
      } else {
        validItems++;
      }
    }

    return {
      total: this.memoryCache.size,
      valid: validItems,
      expired: expiredItems,
      maxSize: this.maxSize
    };
  }

  // Clean expired items
  cleanup() {
    const now = Date.now();
    const keysToDelete = [];

    for (const [key, item] of this.memoryCache) {
      if (now - item.timestamp > item.ttl) {
        keysToDelete.push(key);
      }
    }

    keysToDelete.forEach(key => this.memoryCache.delete(key));

    if (this.persistToStorage && keysToDelete.length > 0) {
      this.saveToStorage();
    }

    return keysToDelete.length;
  }

  // Load cache from localStorage
  loadFromStorage() {
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (stored) {
        const data = JSON.parse(stored);
        this.memoryCache = new Map(data);
        // Clean up expired items after loading
        this.cleanup();
      }
    } catch (error) {
      console.warn('Failed to load cache from localStorage:', error);
    }
  }

  // Save cache to localStorage
  saveToStorage() {
    try {
      // Only save valid (non-expired) items
      this.cleanup();
      const data = Array.from(this.memoryCache.entries());
      localStorage.setItem(this.storageKey, JSON.stringify(data));
    } catch (error) {
      console.warn('Failed to save cache to localStorage:', error);
    }
  }

  // Prefetch data
  async prefetch(key, fetchFunction) {
    if (this.has(key)) {
      return this.get(key);
    }

    try {
      const data = await fetchFunction();
      this.set(key, data);
      return data;
    } catch (error) {
      console.error('Prefetch failed for key:', key, error);
      throw error;
    }
  }

  // Cache or fetch pattern
  async cacheOrFetch(key, fetchFunction, options = {}) {
    // Check cache first
    const cachedData = this.get(key);
    if (cachedData) {
      return cachedData;
    }

    // Fetch and cache
    try {
      const data = await fetchFunction();
      this.set(key, data, options.ttl);
      return data;
    } catch (error) {
      console.error('Cache or fetch failed for key:', key, error);
      throw error;
    }
  }
}

// Create default cache instances
export const movieCache = new Cache({
  maxSize: 200,
  ttl: 10 * 60 * 1000, // 10 minutes for movies
  persistToStorage: true,
  storageKey: 'chooflex_movies'
});

export const listCache = new Cache({
  maxSize: 50,
  ttl: 5 * 60 * 1000, // 5 minutes for lists
  persistToStorage: true,
  storageKey: 'chooflex_lists'
});

export const searchCache = new Cache({
  maxSize: 100,
  ttl: 2 * 60 * 1000, // 2 minutes for search results
  persistToStorage: false // Don't persist search results
});

// Export the Cache class for custom instances
export default Cache;
