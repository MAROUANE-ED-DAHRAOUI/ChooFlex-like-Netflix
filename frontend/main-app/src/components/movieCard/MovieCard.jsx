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
    setImageError(false);
    console.log(`✅ Image loaded for ${movie.title}`);
  };

  const handleImageError = () => {
    setImageError(true);
    setImageLoaded(false);
    console.log(`❌ Image failed for ${movie.title}, URL: ${imageUrl}`);
  };

  // Use the correct field names from the backend: img, imgSm, imgTitle
  // Priority: imgSm (small poster) -> img (main poster) -> imgTitle (backdrop)
  const imageUrl = movie.imgSm || movie.img || movie.imgTitle;
  
  // Handle case where no image is available
  const hasValidImage = imageUrl && imageUrl.trim() !== '';
  
  console.log(`MovieCard ${movie.title}:`, {
    hasValidImage,
    imageUrl,
    imageLoaded,
    imageError
  });

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
        {!imageLoaded && hasValidImage && (
          <div className="image-placeholder">
            <div className="loading-spinner"></div>
          </div>
        )}
        
        {hasValidImage ? (
          <img 
            src={imageUrl}
            alt={movie.title || 'Movie poster'}
            onLoad={handleImageLoad}
            onError={handleImageError}
            style={{ 
              display: imageLoaded && !imageError ? 'block' : 'none',
              width: '100%',
              height: '100%',
              objectFit: 'cover'
            }}
          />
        ) : null}
        
        {(!hasValidImage || imageError) && (
          <div className="image-fallback">
            <span>{movie.title?.charAt(0)?.toUpperCase() || '?'}</span>
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
            {movie.desc?.substring(0, 100)}
            {movie.desc?.length > 100 ? '...' : ''}
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
