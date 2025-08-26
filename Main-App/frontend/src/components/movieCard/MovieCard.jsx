import { useState } from 'react';
import { PlayArrow, Add, Check, ThumbUpAlt, ThumbUp, Remove } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useMyList } from '../../hooks/useMyList.jsx';
import { useLikes } from '../../hooks/useLikes.jsx';
import './movieCard.scss';

const MovieCard = ({ movie, index, showRemoveOption = false }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const navigate = useNavigate();
  const { addToList, removeFromList, isInList, toggleInList } = useMyList();
  const { isLiked, toggleLike } = useLikes();

  // Check if movie is in user's list and liked
  const inMyList = isInList(movie._id);
  const movieIsLiked = isLiked(movie._id);

  const handlePlay = (e) => {
    e.stopPropagation();
    navigate(`/watch?movieId=${movie._id}`);
  };

  const handleAddToList = (e) => {
    e.stopPropagation();
    
    if (showRemoveOption) {
      // If we're on My List page, remove from list
      removeFromList(movie._id);
    } else {
      // Toggle add/remove functionality
      const added = toggleInList(movie);
      if (added) {
        console.log('✅ Added to My List:', movie.title);
        // Could show a toast notification here
      } else {
        console.log('❌ Removed from My List:', movie.title);
      }
    }
  };

  const handleLike = (e) => {
    e.stopPropagation();
    const liked = toggleLike(movie._id);
    if (liked) {
      console.log('👍 Liked:', movie.title);
    } else {
      console.log('👎 Unliked:', movie.title);
    }
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
            className={`action-btn ${inMyList ? 'in-list' : 'secondary'}`} 
            onClick={handleAddToList}
            title={showRemoveOption ? 'Remove from My List' : inMyList ? 'Remove from My List' : 'Add to My List'}
          >
            {showRemoveOption ? <Remove /> : inMyList ? <Check /> : <Add />}
          </button>
          
          <button 
            className={`action-btn ${movieIsLiked ? 'liked' : 'secondary'}`} 
            onClick={handleLike}
            title={movieIsLiked ? 'Unlike' : 'Like'}
          >
            {movieIsLiked ? <ThumbUp /> : <ThumbUpAlt />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MovieCard;
