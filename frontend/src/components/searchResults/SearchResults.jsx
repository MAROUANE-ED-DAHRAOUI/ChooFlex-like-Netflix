import React from 'react';
import MovieCard from '../movieCard/MovieCard';
import { SearchResultsSkeleton } from '../skeletonLoader/SkeletonLoader';
import './searchResults.scss';

const SearchResults = ({ searchResults, isLoading, query, error }) => {
  if (isLoading) {
    return <SearchResultsSkeleton count={8} />;
  }

  if (error) {
    return (
      <div className="search-results">
        <div className="search-header">
          <h2>Search Results</h2>
        </div>
        <div className="search-error">
          <p>Something went wrong while searching. Please try again.</p>
        </div>
      </div>
    );
  }

  if (!searchResults || searchResults.length === 0) {
    return (
      <div className="search-results">
        <div className="search-header">
          <h2>Search Results for "{query}"</h2>
        </div>
        <div className="no-results">
          <p>No movies or TV shows found for "{query}"</p>
          <p>Try searching with different keywords.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="search-results">
      <div className="search-header">
        <h2>Search Results for "{query}"</h2>
        <span className="results-count">
          {searchResults.length} result{searchResults.length !== 1 ? 's' : ''}
        </span>
      </div>
      <div className="search-grid">
        {searchResults.map((item, index) => (
          <MovieCard 
            key={item._id || `search_${index}`} 
            movie={item} 
            index={index}
          />
        ))}
      </div>
    </div>
  );
};

export default SearchResults;
