import { useState } from 'react';
import { PlayArrow, Add, ThumbUpAlt, KeyboardArrowDown } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import './movieCard.scss';

const MovieCard = ({ movie, index }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const navigate = useNavigate();

  const handlePlay = (e) => {
    e.stopPropagation();
    navigate(`/watch?movieId=${movie._id}`);
  };

  const handleAddToList = (e) => {
    e.stopPropagation();
    // Add to list functionality
    console.log('Add to list:', movie.title);
  };

  const handleLike = (e) => {
    e.stopPropagation();
    // Like functionality
    console.log('Like:', movie.title);
  };

  const handleMoreInfo = (e) => {
    e.stopPropagation();
    // More info functionality - could open a modal or navigate to details
    console.log('More info:', movie.title);
  };

  const handleCardClick = () => {
    navigate(`/watch?movieId=${movie._id}`);
  };

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  const handleImageError = () => {
    setImageError(true);
    setImageLoaded(true);
  };

  const imageUrl = movie.imgSmall || movie.imgtitle || '/placeholder-movie.jpg';

  return (
    <div 
      className={`movie-card ${isHovered ? 'hovered' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleCardClick}
      style={{ 
        animationDelay: `${index * 0.1}s`
      }}
    >
      <div className="card-image">
        {!imageLoaded && (
          <div className="image-placeholder">
            <div className="loading-spinner"></div>
          </div>
        )}
        
        {!imageError ? (
          <img 
            src={imageUrl}
            alt={movie.title}
            onLoad={handleImageLoad}
            onError={handleImageError}
            style={{ display: imageLoaded && !imageError ? 'block' : 'none' }}
          />
        ) : (
          <div className="image-fallback">
            <span>{movie.title?.charAt(0) || '?'}</span>
          </div>
        )}

        <div className="card-overlay">
          <div className="play-button" onClick={handlePlay}>
            <PlayArrow />
          </div>
        </div>
      </div>

      <div className="card-content">
        <div className="card-info">
          <h4 className="card-title">{movie.title}</h4>
          
          <div className="card-meta">
            <span className="year">{movie.year}</span>
            <span className="age-rating">{movie.limit}+</span>
            <span className="duration">
              {movie.isSeries ? 'Series' : 'Movie'}
            </span>
          </div>

          <p className="card-description">
            {movie.description?.substring(0, 100)}
            {movie.description?.length > 100 ? '...' : ''}
          </p>

          <div className="card-genre">
            {movie.genre && (
              <span className="genre-tag">{movie.genre}</span>
            )}
          </div>
        </div>

        <div className="card-actions">
          <button 
            className="action-btn primary" 
            onClick={handlePlay}
            title="Play"
          >
            <PlayArrow />
          </button>
          
          <button 
            className="action-btn secondary" 
            onClick={handleAddToList}
            title="Add to My List"
          >
            <Add />
          </button>
          
          <button 
            className="action-btn secondary" 
            onClick={handleLike}
            title="Like"
          >
            <ThumbUpAlt />
          </button>
          
          <button 
            className="action-btn secondary" 
            onClick={handleMoreInfo}
            title="More Info"
          >
            <KeyboardArrowDown />
          </button>
        </div>
      </div>
    </div>
  );
};

export default MovieCard;
