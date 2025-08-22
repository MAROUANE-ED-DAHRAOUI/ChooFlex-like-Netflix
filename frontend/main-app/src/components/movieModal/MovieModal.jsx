import { useState } from 'react';
import { Close, PlayArrow, Add, Check, ThumbUpAlt, ThumbUp } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useMyList } from '../../hooks/useMyList.jsx';
import { useLikes } from '../../hooks/useLikes.jsx';
import './movieModal.scss';

const MovieModal = ({ movie, isOpen, onClose }) => {
  const navigate = useNavigate();
  const { addToList, removeFromList, isInList, toggleInList } = useMyList();
  const { isLiked, toggleLike } = useLikes();
  
  const inMyList = isInList(movie?._id);
  const movieIsLiked = isLiked(movie?._id);

  const handlePlay = (e) => {
    e.stopPropagation();
    onClose();
    navigate(`/watch?movieId=${movie._id}`);
  };

  const handleAddToList = (e) => {
    e.stopPropagation();
    const added = toggleInList(movie);
    if (added) {
      console.log('✅ Added to My List:', movie.title);
    } else {
      console.log('❌ Removed from My List:', movie.title);
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

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const getBackgroundImage = () => {
    return movie?.imgTitle || movie?.img || movie?.imgSm || '/placeholder-banner.jpg';
  };

  const formatGenres = () => {
    if (movie?.genres && Array.isArray(movie.genres)) {
      return movie.genres.slice(0, 3).join(' • ');
    } else if (movie?.genre) {
      return movie.genre;
    }
    return '';
  };

  if (!isOpen || !movie) return null;

  return (
    <div className="movie-modal-overlay" onClick={handleOverlayClick}>
      <div className="movie-modal">
        <button className="modal-close" onClick={onClose}>
          <Close />
        </button>

        <div className="modal-hero">
          <div 
            className="modal-background"
            style={{
              backgroundImage: `url(${getBackgroundImage()})`
            }}
          >
            <div className="modal-overlay"></div>
          </div>
          
          <div className="modal-content">
            <div className="modal-info">
              <h1 className="modal-title">{movie.title || movie.name}</h1>
              
              <div className="modal-meta">
                {movie.release_date && (
                  <span className="year">{new Date(movie.release_date).getFullYear()}</span>
                )}
                {movie.year && <span className="year">{movie.year}</span>}
                {movie.limit && <span className="age-rating">{movie.limit}+</span>}
                {formatGenres() && <span className="genre">{formatGenres()}</span>}
                <span className="type">{movie.isSeries ? 'Series' : 'Movie'}</span>
              </div>

              <p className="modal-description">
                {movie.desc || movie.overview || movie.description || 'No description available.'}
              </p>

              <div className="modal-actions">
                <button className="btn btn-primary" onClick={handlePlay}>
                  <PlayArrow />
                  Play
                </button>
                
                <button 
                  className={`btn btn-secondary ${inMyList ? 'in-list' : ''}`} 
                  onClick={handleAddToList}
                  title={inMyList ? 'Remove from My List' : 'Add to My List'}
                >
                  {inMyList ? <Check /> : <Add />}
                </button>
                
                <button 
                  className={`btn btn-secondary ${movieIsLiked ? 'liked' : ''}`} 
                  onClick={handleLike}
                  title={movieIsLiked ? 'Unlike' : 'Like'}
                >
                  {movieIsLiked ? <ThumbUp /> : <ThumbUpAlt />}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="modal-details">
          <div className="details-grid">
            <div className="details-main">
              <h3>About this {movie.isSeries ? 'Series' : 'Movie'}</h3>
              
              <div className="detail-item">
                <span className="detail-label">Genre:</span>
                <span className="detail-value">{formatGenres() || 'Not specified'}</span>
              </div>
              
              {movie.year && (
                <div className="detail-item">
                  <span className="detail-label">Release Year:</span>
                  <span className="detail-value">{movie.year}</span>
                </div>
              )}
              
              {movie.duration && (
                <div className="detail-item">
                  <span className="detail-label">Duration:</span>
                  <span className="detail-value">{movie.duration}</span>
                </div>
              )}
              
              {movie.limit && (
                <div className="detail-item">
                  <span className="detail-label">Age Rating:</span>
                  <span className="detail-value">{movie.limit}+</span>
                </div>
              )}
            </div>
            
            <div className="details-sidebar">
              <h4>More Details</h4>
              
              {movie.director && (
                <div className="detail-item">
                  <span className="detail-label">Director:</span>
                  <span className="detail-value">{movie.director}</span>
                </div>
              )}
              
              {movie.cast && (
                <div className="detail-item">
                  <span className="detail-label">Cast:</span>
                  <span className="detail-value">{movie.cast}</span>
                </div>
              )}
              
              <div className="detail-item">
                <span className="detail-label">Type:</span>
                <span className="detail-value">{movie.isSeries ? 'TV Series' : 'Movie'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieModal;
