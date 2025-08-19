import { useEffect, useState } from 'react';
import { useLists, useSearch, usePrefetch } from '../../hooks/useApi';
import { usePrefetchService } from '../../hooks/usePrefetch';
import Navbar from '../../components/navbar/Navbar';
import Featured from '../../components/featured/Featured';
import List from '../../components/list/List';
import SearchResults from '../../components/searchResults/SearchResults';
import { MovieRowSkeleton } from '../../components/skeletonLoader/SkeletonLoader';
import { useDebounce } from '../../hooks/useDebounce';
import './home.scss';

const Home = ({ type }) => {
  const [genre, setGenre] = useState(null);
  const [heroKey, setHeroKey] = useState(0); // Key to force hero re-render
  
  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  
  // Debounce search query
  const debouncedSearchQuery = useDebounce(searchQuery, 500);
  
  // Is searching flag
  const isSearching = searchQuery.trim().length > 0;

  // Prefetch hook for background loading
  const { prefetchLists, prefetchRandomMovie } = usePrefetch();
  const { startBackgroundPrefetch } = usePrefetchService();

  // Main lists query with React Query
  const {
    data: lists = [],
    isLoading,
    error,
    refetch
  } = useLists(type, genre, {
    // Keep previous data while loading new data
    keepPreviousData: true,
    // Prefetch on mount
    refetchOnMount: true
  });

  // Search query with React Query
  const {
    data: searchData,
    isLoading: searchLoading,
    error: searchError
  } = useSearch(debouncedSearchQuery, {
    enabled: isSearching
  });

  const searchResults = searchData?.results || [];

  // Force hero re-randomization when coming back to home
  useEffect(() => {
    setHeroKey(prev => prev + 1);
  }, [type]);

  // Start background prefetching for better UX
  useEffect(() => {
    startBackgroundPrefetch();
  }, [startBackgroundPrefetch]);

  // Prefetch data in the background for better UX
  useEffect(() => {
    const prefetchData = async () => {
      try {
        // Prefetch different genre data in background
        const genres = ['action', 'comedy', 'drama', 'thriller'];
        const currentGenre = genre || '';
        
        // Prefetch other genres
        const otherGenres = genres.filter(g => g !== currentGenre);
        if (otherGenres.length > 0) {
          // Prefetch one other genre
          prefetchLists(type, otherGenres[0]);
        }

        // Prefetch random movie for hero
        prefetchRandomMovie(type);
      } catch (error) {
        console.log('Background prefetch failed:', error);
      }
    };

    // Delay prefetch to not interfere with main loading
    const timeoutId = setTimeout(prefetchData, 2000);
    return () => clearTimeout(timeoutId);
  }, [type, genre, prefetchLists, prefetchRandomMovie]);

  // Search functionality is now handled by React Query hook above

  const handleGenreChange = (selectedGenre) => {
    setGenre(selectedGenre === '' ? null : selectedGenre);
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const clearSearch = () => {
    setSearchQuery('');
  };

  const handleRetry = () => {
    refetch();
  };

  return (
    <div className="home">
      <Navbar 
        onSearch={handleSearch}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        clearSearch={clearSearch}
      />
      {!isSearching && <Featured key={heroKey} type={type} setGenre={handleGenreChange} />}
      
      <div className="home-content">
        {isSearching ? (
          // Show search results
          <SearchResults 
            searchResults={searchResults}
            isLoading={searchLoading}
            query={searchQuery}
            error={searchError}
          />
        ) : (
          // Show regular content
          <>
            {error && (
              <div className="error-message">
                <p>Failed to load content</p>
                <button onClick={handleRetry}>
                  Try Again
                </button>
              </div>
            )}

            {isLoading ? (
              // Enhanced loading skeleton
              <div className="loading-lists">
                <MovieRowSkeleton count={4} />
              </div>
            ) : (
              // Actual content with fade-in animation
              <div className="content-lists content-fade-in">
                {lists.length > 0 ? (
                  lists.map((list, index) => (
                    <List key={list._id || index} list={list} />
                  ))
                ) : (
                  <div className="no-content">
                    <h3>No content available</h3>
                    <p>Try changing the genre filter or check back later.</p>
                    <button onClick={handleRetry} className="retry-btn">
                      Refresh Content
                    </button>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Home;