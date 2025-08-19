import './skeletonLoader.scss';

// Movie Card Skeleton
export const MovieCardSkeleton = ({ count = 1 }) => {
  return (
    <>
      {[...Array(count)].map((_, index) => (
        <div key={index} className="movie-card-skeleton">
          <div className="skeleton-image">
            <div className="skeleton-shimmer"></div>
          </div>
          <div className="skeleton-content">
            <div className="skeleton-title"></div>
            <div className="skeleton-subtitle"></div>
          </div>
        </div>
      ))}
    </>
  );
};

// Movie Row Skeleton
export const MovieRowSkeleton = ({ count = 4 }) => {
  return (
    <div className="movie-row-skeleton">
      {[...Array(count)].map((_, rowIndex) => (
        <div key={rowIndex} className="skeleton-row">
          <div className="skeleton-row-title"></div>
          <div className="skeleton-movies-container">
            <MovieCardSkeleton count={6} />
          </div>
        </div>
      ))}
    </div>
  );
};

// Featured/Hero Skeleton
export const FeaturedSkeleton = () => {
  return (
    <div className="featured-skeleton">
      <div className="skeleton-hero-background">
        <div className="skeleton-shimmer"></div>
      </div>
      <div className="skeleton-hero-content">
        <div className="skeleton-hero-title"></div>
        <div className="skeleton-hero-description"></div>
        <div className="skeleton-hero-buttons">
          <div className="skeleton-button primary"></div>
          <div className="skeleton-button secondary"></div>
        </div>
      </div>
    </div>
  );
};

// Search Results Skeleton
export const SearchResultsSkeleton = ({ count = 8 }) => {
  return (
    <div className="search-results-skeleton">
      <div className="skeleton-search-header">
        <div className="skeleton-search-title"></div>
        <div className="skeleton-search-count"></div>
      </div>
      <div className="skeleton-search-grid">
        <MovieCardSkeleton count={count} />
      </div>
    </div>
  );
};

// List Content Skeleton (for when individual lists are loading)
export const ListContentSkeleton = ({ movieCount = 6 }) => {
  return (
    <div className="list-content-skeleton">
      <div className="skeleton-movies-grid">
        <MovieCardSkeleton count={movieCount} />
      </div>
    </div>
  );
};

// Loading Dots Animation
export const LoadingDots = ({ size = 'medium', color = 'white' }) => {
  return (
    <div className={`loading-dots ${size} ${color}`}>
      <div className="dot"></div>
      <div className="dot"></div>
      <div className="dot"></div>
    </div>
  );
};

// Pulse Skeleton (generic)
export const PulseSkeleton = ({ 
  width = '100%', 
  height = '20px', 
  borderRadius = '4px',
  className = '' 
}) => {
  return (
    <div 
      className={`pulse-skeleton ${className}`}
      style={{ 
        width, 
        height, 
        borderRadius 
      }}
    >
      <div className="skeleton-shimmer"></div>
    </div>
  );
};

export default {
  MovieCardSkeleton,
  MovieRowSkeleton,
  FeaturedSkeleton,
  SearchResultsSkeleton,
  ListContentSkeleton,
  LoadingDots,
  PulseSkeleton
};
