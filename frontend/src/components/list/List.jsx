import { useMemo } from 'react';
import { useMovies } from '../../hooks/useApi';
import MovieRow from '../movieRow/MovieRow';
import './list.scss';

const List = ({ list }) => {
  // Extract movie IDs from list content
  const movieIds = useMemo(() => {
    if (!list?.content || list.content.length === 0) {
      return [];
    }

    // Check if content is already populated with full movie objects
    const firstItem = list.content[0];
    if (firstItem && typeof firstItem === 'object' && firstItem.title) {
      // Content is already populated, no need to fetch
      return [];
    }
    
    // Content contains only IDs, return them for fetching
    return list.content;
  }, [list?.content]);

  // Use React Query to fetch movies if needed
  const {
    data: fetchedMovies = [],
    isLoading: moviesLoading
  } = useMovies(movieIds, {
    enabled: movieIds.length > 0
  });

  // Determine final movies array
  const movies = useMemo(() => {
    if (!list?.content || list.content.length === 0) {
      return [];
    }

    // If content is already populated with movie objects
    const firstItem = list.content[0];
    if (firstItem && typeof firstItem === 'object' && firstItem.title) {
      return list.content;
    }

    // Use fetched movies
    return fetchedMovies;
  }, [list?.content, fetchedMovies]);

  // Loading state: show loading if we need to fetch movies and they're loading
  const isLoading = movieIds.length > 0 && moviesLoading;

  return (
    <div className="list">
      <MovieRow 
        title={list?.title || 'Untitled List'}
        movies={movies}
        isLoading={isLoading}
      />
    </div>
  );
};

export default List;
