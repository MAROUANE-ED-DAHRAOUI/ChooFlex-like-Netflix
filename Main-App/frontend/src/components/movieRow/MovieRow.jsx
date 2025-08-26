import { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';
import MovieCard from '../movieCard/MovieCard';
import { ListContentSkeleton } from '../skeletonLoader/SkeletonLoader';
import './movieRow.scss';

const MovieRow = ({ title, movies, isLoading = false }) => {
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [isScrolling, setIsScrolling] = useState(false);
  const scrollContainerRef = useRef(null);

  useEffect(() => {
    checkScrollButtons();
  }, [movies]);

  const checkScrollButtons = () => {
    const container = scrollContainerRef.current;
    if (container) {
      setCanScrollLeft(container.scrollLeft > 0);
      setCanScrollRight(
        container.scrollLeft < container.scrollWidth - container.clientWidth
      );
    }
  };

  const scroll = (direction) => {
    const container = scrollContainerRef.current;
    if (container && !isScrolling) {
      setIsScrolling(true);
      const scrollAmount = container.clientWidth * 0.8;
      const targetScrollLeft = direction === 'left' 
        ? container.scrollLeft - scrollAmount
        : container.scrollLeft + scrollAmount;

      container.scrollTo({
        left: targetScrollLeft,
        behavior: 'smooth'
      });

      setTimeout(() => {
        setIsScrolling(false);
        checkScrollButtons();
      }, 300);
    }
  };

  const handleScroll = () => {
    if (!isScrolling) {
      checkScrollButtons();
    }
  };

  if (isLoading) {
    return (
      <div className="movie-row">
        <div className="row-title loading-skeleton"></div>
        <div className="row-container">
          <ListContentSkeleton movieCount={6} />
        </div>
      </div>
    );
  }

  if (!movies || movies.length === 0) {
    return (
      <div className="movie-row">
        <h2 className="row-title">{title}</h2>
        <div className="row-container">
          <div className="no-content">
            <p>No movies available</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="movie-row">
      <h2 className="row-title">{title}</h2>
      
      <div className="row-container">
        {canScrollLeft && (
          <button 
            className="scroll-btn scroll-left"
            onClick={() => scroll('left')}
            disabled={isScrolling}
          >
            <ChevronLeft />
          </button>
        )}

        <div 
          className="movies-grid content-fade-in"
          ref={scrollContainerRef}
          onScroll={handleScroll}
        >
          {movies.map((movie, index) => (
            <MovieCard 
              key={movie._id || index} 
              movie={movie} 
              index={index}
            />
          ))}
        </div>

        {canScrollRight && (
          <button 
            className="scroll-btn scroll-right"
            onClick={() => scroll('right')}
            disabled={isScrolling}
          >
            <ChevronRight />
          </button>
        )}
      </div>
    </div>
  );
};

export default MovieRow;
