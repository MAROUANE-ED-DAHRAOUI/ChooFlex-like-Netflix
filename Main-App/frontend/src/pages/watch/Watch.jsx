import { ArrowBackOutlined } from "@mui/icons-material";
import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { moviesAPI } from "../../services/api";
import "./watch.scss";

// Helper function to extract YouTube video ID from URL
const getYouTubeVideoId = (url) => {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
};

// Helper function to check if URL is a YouTube link
const isYouTubeUrl = (url) => {
  return url && (url.includes('youtube.com') || url.includes('youtu.be'));
};

// Helper function to check if URL is a direct video file
const isDirectVideoUrl = (url) => {
  if (!url) return false;
  const videoExtensions = ['.mp4', '.webm', '.ogg', '.avi', '.mov'];
  return videoExtensions.some(ext => url.toLowerCase().includes(ext));
};

export default function Watch() {
  const location = useLocation();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Get movieId from query parameters
  const searchParams = new URLSearchParams(location.search);
  const movieId = searchParams.get('movieId');

  useEffect(() => {
    const fetchMovie = async () => {
      // First check if movie data was passed via state
      if (location.state?.movie) {
        setMovie(location.state.movie);
        setLoading(false);
        return;
      }

      // If no state data and no movieId, show error
      if (!movieId) {
        setError("No movie ID provided");
        setLoading(false);
        return;
      }

      // Fetch movie data using movieId
      try {
        setLoading(true);
        
        // Handle mock movie IDs that don't exist in database
        if (movieId.startsWith('mock') || movieId.startsWith('test')) {
          // Create mock movie data for testing
          const mockMovie = {
            _id: movieId,
            title: movieId.includes('series') ? 'Sample Series' : 'Sample Movie',
            desc: 'This is a sample movie for testing the video player.',
            img: 'https://via.placeholder.com/300x450/0066cc/ffffff?text=Movie+Poster',
            video: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
            trailer: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
            year: '2024',
            genre: 'Sample',
            isSeries: movieId.includes('series')
          };
          setMovie(mockMovie);
          setLoading(false);
          return;
        }
        
        const movieData = await moviesAPI.getById(movieId);
        setMovie(movieData);
      } catch (err) {
        console.error("Error fetching movie:", err);
        
        // If API fails, provide fallback mock data
        const fallbackMovie = {
          _id: movieId,
          title: 'Sample Movie',
          desc: 'This is a fallback movie for testing purposes.',
          img: 'https://via.placeholder.com/300x450/ff6b6b/ffffff?text=Fallback+Movie',
          video: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
          trailer: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
          year: '2024',
          genre: 'Action',
          isSeries: false
        };
        setMovie(fallbackMovie);
      } finally {
        setLoading(false);
      }
    };

    fetchMovie();
  }, [movieId, location.state]);

  if (loading) {
    return (
      <div className="watch">
        <Link to="/">
          <div className="back">
            <ArrowBackOutlined />
            Home
          </div>
        </Link>
        <div className="loading">Loading movie...</div>
      </div>
    );
  }

  if (error || !movie) {
    return (
      <div className="watch">
        <Link to="/">
          <div className="back">
            <ArrowBackOutlined />
            Home
          </div>
        </Link>
        <div className="error">
          {error || "Movie not found"}
        </div>
      </div>
    );
  }

  // Render video player based on video type
  const renderVideoPlayer = (videoUrl, title, poster) => {
    if (isYouTubeUrl(videoUrl)) {
      const videoId = getYouTubeVideoId(videoUrl);
      if (videoId) {
        return (
          <iframe
            className="video youtube-player"
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1&controls=1&rel=0`}
            title={title}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        );
      }
    }
    
    if (isDirectVideoUrl(videoUrl)) {
      return (
        <video 
          className="video" 
          autoPlay 
          controls 
          src={videoUrl}
          poster={poster}
        >
          Your browser does not support the video tag.
        </video>
      );
    }
    
    return null;
  };

  return (
    <div className="watch">
      <Link to="/">
        <div className="back">
          <ArrowBackOutlined />
          Home
        </div>
      </Link>
      
      {/* Try to play main video first, then trailer */}
      {movie.video ? (
        renderVideoPlayer(movie.video, movie.title, movie.img) || (
          <div className="video-fallback">
            <h2>{movie.title}</h2>
            <p>Main video format not supported.</p>
            {movie.trailer && (
              <div>
                <p>Playing trailer instead:</p>
                {renderVideoPlayer(movie.trailer, `${movie.title} - Trailer`, movie.img) || (
                  <div className="no-video-available">
                    <p>No compatible video format available.</p>
                    <a href={movie.trailer} target="_blank" rel="noopener noreferrer">
                      Watch on YouTube
                    </a>
                  </div>
                )}
              </div>
            )}
          </div>
        )
      ) : movie.trailer ? (
        <div className="trailer-only">
          <h3>Trailer: {movie.title}</h3>
          {renderVideoPlayer(movie.trailer, `${movie.title} - Trailer`, movie.img) || (
            <div className="no-video-available">
              <p>Trailer format not supported.</p>
              <a href={movie.trailer} target="_blank" rel="noopener noreferrer">
                Watch on YouTube
              </a>
            </div>
          )}
        </div>
      ) : (
        <div className="no-video">
          <h2>{movie.title}</h2>
          <p>No video content available for this title.</p>
          <div className="movie-info">
            <img src={movie.img} alt={movie.title} />
            <div className="details">
              <p><strong>Year:</strong> {movie.year}</p>
              <p><strong>Genre:</strong> {movie.genre}</p>
              <p><strong>Description:</strong> {movie.desc}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}