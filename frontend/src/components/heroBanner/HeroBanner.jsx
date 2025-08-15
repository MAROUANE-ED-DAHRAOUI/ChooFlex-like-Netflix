import { useState, useEffect } from 'react';
import { PlayArrow, Add, ThumbUpAlt, KeyboardArrowDown } from '@mui/icons-material';
import { moviesAPI } from '../../services/api';
import './heroBanner.scss';

const HeroBanner = ({ type, onGenreChange }) => {
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showDescription, setShowDescription] = useState(false);

  useEffect(() => {
    const fetchRandomMovie = async () => {
      try {
        setLoading(true);
        const data = await moviesAPI.getRandomMovie(type);
        setMovie(data);
      } catch (error) {
        console.error('Error fetching random movie:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRandomMovie();
  }, [type]);

  const handlePlay = () => {
    if (movie) {
      // Navigate to watch page with movie data
      window.location.href = `/watch?movieId=${movie._id}`;
    }
  };

  const handleMyList = () => {
    // Add to my list functionality
    console.log('Add to my list:', movie?.title);
  };

  const handleMoreInfo = () => {
    setShowDescription(!showDescription);
  };

  if (loading) {
    return (
      <div className="hero-banner loading">
        <div className="hero-content">
          <div className="loading-skeleton title"></div>
          <div className="loading-skeleton description"></div>
          <div className="loading-skeleton buttons"></div>
        </div>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="hero-banner">
        <div className="hero-content">
          <h1>No content available</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="hero-banner">
      <div 
        className="hero-background"
        style={{
          backgroundImage: `url(${movie.imgtitle || movie.imgSmall || '/placeholder-banner.jpg'})`
        }}
      >
        <div className="hero-overlay"></div>
      </div>
      
      <div className="hero-content">
        <div className="hero-info">
          <h1 className="hero-title">{movie.title}</h1>
          
          <div className="hero-meta">
            <span className="year">{movie.year}</span>
            <span className="age-rating">{movie.limit}+</span>
            <span className="genre">{movie.genre}</span>
            <span className="type">{movie.isSeries ? 'Series' : 'Movie'}</span>
          </div>

          <p className={`hero-description ${showDescription ? 'expanded' : ''}`}>
            {movie.description || 'No description available.'}
          </p>

          <div className="hero-actions">
            <button className="btn btn-primary" onClick={handlePlay}>
              <PlayArrow />
              Play
            </button>
            
            <button className="btn btn-secondary" onClick={handleMyList}>
              <Add />
              My List
            </button>
            
            <button className="btn btn-info" onClick={handleMoreInfo}>
              <ThumbUpAlt />
              More Info
            </button>
          </div>

          {/* Genre filter */}
          {onGenreChange && (
            <div className="genre-filter">
              <select 
                onChange={(e) => onGenreChange(e.target.value)}
                defaultValue=""
              >
                <option value="">All Genres</option>
                <option value="action">Action</option>
                <option value="comedy">Comedy</option>
                <option value="drama">Drama</option>
                <option value="horror">Horror</option>
                <option value="thriller">Thriller</option>
                <option value="romance">Romance</option>
                <option value="sci-fi">Sci-Fi</option>
                <option value="fantasy">Fantasy</option>
                <option value="documentary">Documentary</option>
                <option value="animation">Animation</option>
              </select>
              <KeyboardArrowDown className="select-arrow" />
            </div>
          )}
        </div>
      </div>

      <div className="hero-fade"></div>
    </div>
  );
};

export default HeroBanner;
