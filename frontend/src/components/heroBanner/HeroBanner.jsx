import { useState, useEffect } from 'react';
import { PlayArrow, KeyboardArrowDown } from '@mui/icons-material';
import { moviesAPI } from '../../services/api';
import './heroBanner.scss';

const HeroBanner = ({ type, onGenreChange }) => {
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRandomMovie = async () => {
      try {
        setLoading(true);
        // Simply use the random endpoint which doesn't require auth
        const data = await moviesAPI.getRandom(type);
        console.log('Fetched movie data:', data);
        setMovie(data);
      } catch (error) {
        console.error('Error fetching random movie:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRandomMovie();
  }, [type]);

  // Re-randomize when component mounts (navigation back to home)
  useEffect(() => {
    const fetchRandomMovie = async () => {
      try {
        const data = await moviesAPI.getRandom(type);
        setMovie(data);
      } catch (error) {
        console.error('Error fetching random movie:', error);
      }
    };

    // Only fetch if we already have a movie (to avoid double fetch on first load)
    if (movie) {
      fetchRandomMovie();
    }
  }, []); // Empty dependency array for mount-only effect

  const handlePlay = () => {
    if (movie) {
      // Navigate to watch page with movie data
      window.location.href = `/watch?movieId=${movie._id}`;
    }
  };

  // Function to get background image
  const getBackgroundImage = () => {
    // Priority: imgTitle (backdrop) > img (poster) > imgSm (small) > TMDB paths > fallback
    if (movie.imgTitle) {
      console.log('Using imgTitle:', movie.imgTitle);
      return movie.imgTitle;
    } else if (movie.img) {
      console.log('Using img:', movie.img);
      return movie.img;
    } else if (movie.imgSm) {
      console.log('Using imgSm:', movie.imgSm);
      return movie.imgSm;
    } else if (movie.backdrop_path) {
      console.log('Using backdrop_path:', movie.backdrop_path);
      return `https://image.tmdb.org/t/p/original${movie.backdrop_path}`;
    } else if (movie.poster_path) {
      console.log('Using poster_path:', movie.poster_path);
      return `https://image.tmdb.org/t/p/original${movie.poster_path}`;
    }
    
    console.log('No image found, using fallback');
    return '/placeholder-banner.jpg';
  };

  // Function to format genres
  const formatGenres = () => {
    if (movie.genres && Array.isArray(movie.genres)) {
      return movie.genres.slice(0, 3).join(' • ');
    } else if (movie.genre) {
      return movie.genre;
    }
    return '';
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
          backgroundImage: `url(${getBackgroundImage()})`
        }}
      >
        <div className="hero-overlay"></div>
      </div>
      
      <div className="hero-content">
        <div className="hero-info">
          <h1 className="hero-title">{movie.title || movie.name}</h1>
          
          <div className="hero-meta">
            {movie.release_date && (
              <span className="year">{new Date(movie.release_date).getFullYear()}</span>
            )}
            {movie.year && <span className="year">{movie.year}</span>}
            {movie.limit && <span className="age-rating">{movie.limit}+</span>}
            {formatGenres() && <span className="genre">{formatGenres()}</span>}
            <span className="type">{movie.isSeries ? 'Series' : 'Movie'}</span>
          </div>

          <p className="hero-description">
            {movie.desc || movie.overview || movie.description || 'Description not available.'}
          </p>

          <div className="hero-actions">
            <button className="btn btn-primary" onClick={handlePlay}>
              <PlayArrow />
              Play
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
