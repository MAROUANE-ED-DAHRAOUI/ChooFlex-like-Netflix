import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { 
  getLists, 
  getMovieById, 
  getRandomMovie, 
  searchContent,
  moviesAPI,
  listsAPI
} from '../services/api';
import { movieCache, listCache, searchCache } from '../utils/cache';
import { recordCacheHit, recordCacheMiss, recordApiCall, recordLoadTime } from '../utils/performance';

// Query keys
export const QUERY_KEYS = {
  LISTS: 'lists',
  MOVIES: 'movies',
  MOVIE: 'movie',
  RANDOM_MOVIE: 'randomMovie',
  SEARCH: 'search'
};

// Custom hook for fetching lists with caching and performance optimization
export const useLists = (type = null, genre = null, options = {}) => {
  const cacheKey = listCache.generateKey('lists', { type, genre });
  
  return useQuery({
    queryKey: [QUERY_KEYS.LISTS, type, genre],
    queryFn: async () => {
      const startTime = performance.now();
      
      // Try cache first
      const cached = listCache.get(cacheKey);
      if (cached) {
        recordCacheHit();
        recordLoadTime(performance.now() - startTime);
        return cached;
      }

      recordCacheMiss();
      recordApiCall();

      // Fetch from API with optimized parameters
      const data = await getLists(type, genre, false); // Don't populate initially for faster load
      
      // Cache the result
      listCache.set(cacheKey, data);
      
      recordLoadTime(performance.now() - startTime);
      return data;
    },
    staleTime: 2 * 60 * 1000, // Reduced to 2 minutes for faster refresh
    cacheTime: 5 * 60 * 1000, // Reduced cache time
    retry: 1, // Reduced retry attempts for faster failure detection
    refetchOnWindowFocus: false,
    // Enable faster loading
    suspense: false,
    useErrorBoundary: false,
    ...options
  });
};

// Custom hook for fetching a single movie
export const useMovie = (movieId, options = {}) => {
  const cacheKey = movieCache.generateKey('movie', { id: movieId });
  
  return useQuery({
    queryKey: [QUERY_KEYS.MOVIE, movieId],
    queryFn: async () => {
      if (!movieId) return null;
      
      // Try cache first
      const cached = movieCache.get(cacheKey);
      if (cached) {
        return cached;
      }

      // Fetch from API
      const data = await getMovieById(movieId);
      
      // Cache the result
      movieCache.set(cacheKey, data);
      
      return data;
    },
    enabled: !!movieId,
    staleTime: 10 * 60 * 1000, // 10 minutes
    cacheTime: 30 * 60 * 1000, // 30 minutes
    retry: 2,
    refetchOnWindowFocus: false,
    ...options
  });
};

// Custom hook for fetching multiple movies (batch)
export const useMovies = (movieIds = [], options = {}) => {
  return useQuery({
    queryKey: [QUERY_KEYS.MOVIES, movieIds.sort().join(',')],
    queryFn: async () => {
      if (!movieIds.length) return [];
      
      const movies = await Promise.all(
        movieIds.map(async (id) => {
          const cacheKey = movieCache.generateKey('movie', { id });
          
          // Try cache first
          const cached = movieCache.get(cacheKey);
          if (cached) {
            return cached;
          }

          try {
            const movie = await getMovieById(id);
            movieCache.set(cacheKey, movie);
            return movie;
          } catch (error) {
            console.error(`Error fetching movie ${id}:`, error);
            return null;
          }
        })
      );
      
      return movies.filter(movie => movie !== null);
    },
    enabled: movieIds.length > 0,
    staleTime: 10 * 60 * 1000,
    cacheTime: 30 * 60 * 1000,
    retry: 2,
    refetchOnWindowFocus: false,
    ...options
  });
};

// Custom hook for random/featured movie
export const useRandomMovie = (type = null, options = {}) => {
  return useQuery({
    queryKey: [QUERY_KEYS.RANDOM_MOVIE, type],
    queryFn: () => getRandomMovie(type),
    staleTime: 2 * 60 * 1000, // 2 minutes (random should refresh more often)
    cacheTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
    refetchOnWindowFocus: false,
    ...options
  });
};

// Custom hook for search with debouncing and caching
export const useSearch = (query, options = {}) => {
  const cacheKey = searchCache.generateKey('search', { query: query.trim() });
  
  return useQuery({
    queryKey: [QUERY_KEYS.SEARCH, query.trim()],
    queryFn: async () => {
      const trimmedQuery = query.trim();
      if (!trimmedQuery) return { results: [] };
      
      // Try cache first
      const cached = searchCache.get(cacheKey);
      if (cached) {
        return cached;
      }

      // Fetch from API
      const data = await searchContent(trimmedQuery);
      
      // Cache the result
      searchCache.set(cacheKey, data);
      
      return data;
    },
    enabled: !!query.trim(),
    staleTime: 2 * 60 * 1000, // 2 minutes
    cacheTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
    refetchOnWindowFocus: false,
    ...options
  });
};

// Hook for prefetching data
export const usePrefetch = () => {
  const queryClient = useQueryClient();

  const prefetchLists = async (type = null, genre = null) => {
    await queryClient.prefetchQuery({
      queryKey: [QUERY_KEYS.LISTS, type, genre],
      queryFn: () => getLists(type, genre),
      staleTime: 5 * 60 * 1000
    });
  };

  const prefetchMovie = async (movieId) => {
    if (!movieId) return;
    
    await queryClient.prefetchQuery({
      queryKey: [QUERY_KEYS.MOVIE, movieId],
      queryFn: () => getMovieById(movieId),
      staleTime: 10 * 60 * 1000
    });
  };

  const prefetchRandomMovie = async (type = null) => {
    await queryClient.prefetchQuery({
      queryKey: [QUERY_KEYS.RANDOM_MOVIE, type],
      queryFn: () => getRandomMovie(type),
      staleTime: 2 * 60 * 1000
    });
  };

  const prefetchMovies = async (movieIds) => {
    if (!movieIds?.length) return;
    
    const promises = movieIds.map(id => prefetchMovie(id));
    await Promise.all(promises);
  };

  return {
    prefetchLists,
    prefetchMovie,
    prefetchMovies,
    prefetchRandomMovie
  };
};

// Hook for cache management
export const useCache = () => {
  const queryClient = useQueryClient();

  const clearAllCache = () => {
    movieCache.clear();
    listCache.clear();
    searchCache.clear();
    queryClient.clear();
  };

  const clearMovieCache = () => {
    movieCache.clear();
    queryClient.removeQueries({ queryKey: [QUERY_KEYS.MOVIES] });
    queryClient.removeQueries({ queryKey: [QUERY_KEYS.MOVIE] });
  };

  const clearListCache = () => {
    listCache.clear();
    queryClient.removeQueries({ queryKey: [QUERY_KEYS.LISTS] });
  };

  const clearSearchCache = () => {
    searchCache.clear();
    queryClient.removeQueries({ queryKey: [QUERY_KEYS.SEARCH] });
  };

  const getCacheStats = () => ({
    movies: movieCache.getStats(),
    lists: listCache.getStats(),
    search: searchCache.getStats()
  });

  const cleanupCache = () => {
    const moviesCleanedUp = movieCache.cleanup();
    const listsCleanedUp = listCache.cleanup();
    const searchCleanedUp = searchCache.cleanup();
    
    return {
      moviesCleanedUp,
      listsCleanedUp,
      searchCleanedUp
    };
  };

  return {
    clearAllCache,
    clearMovieCache,
    clearListCache,
    clearSearchCache,
    getCacheStats,
    cleanupCache
  };
};
