import { useState, useEffect, useContext, createContext } from 'react';

// Create Likes Context
const LikesContext = createContext();

// Likes Provider Component
export const LikesProvider = ({ children }) => {
  const [likedMovies, setLikedMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load likes from localStorage on mount
  useEffect(() => {
    try {
      const savedLikes = localStorage.getItem('chooflix-likes');
      if (savedLikes) {
        const parsedLikes = JSON.parse(savedLikes);
        setLikedMovies(Array.isArray(parsedLikes) ? parsedLikes : []);
      }
    } catch (error) {
      console.error('Error loading likes:', error);
      setLikedMovies([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Save likes to localStorage whenever they change
  useEffect(() => {
    if (!loading) {
      try {
        localStorage.setItem('chooflix-likes', JSON.stringify(likedMovies));
      } catch (error) {
        console.error('Error saving likes:', error);
      }
    }
  }, [likedMovies, loading]);

  // Like a movie
  const likeMovie = (movieId) => {
    if (!movieId) {
      console.error('Invalid movie ID');
      return false;
    }

    // Check if movie is already liked
    const isAlreadyLiked = likedMovies.includes(movieId);
    if (isAlreadyLiked) {
      console.log('Movie already liked:', movieId);
      return false;
    }

    setLikedMovies(prevLikes => [...prevLikes, movieId]);
    console.log('Liked movie:', movieId);
    return true;
  };

  // Unlike a movie
  const unlikeMovie = (movieId) => {
    setLikedMovies(prevLikes => prevLikes.filter(id => id !== movieId));
    console.log('Unliked movie:', movieId);
  };

  // Check if movie is liked
  const isLiked = (movieId) => {
    return likedMovies.includes(movieId);
  };

  // Toggle like status
  const toggleLike = (movieId) => {
    if (isLiked(movieId)) {
      unlikeMovie(movieId);
      return false; // unliked
    } else {
      return likeMovie(movieId); // liked
    }
  };

  // Clear all likes
  const clearLikes = () => {
    setLikedMovies([]);
    console.log('Cleared all likes');
  };

  const value = {
    likedMovies,
    loading,
    likeMovie,
    unlikeMovie,
    isLiked,
    toggleLike,
    clearLikes,
    count: likedMovies.length
  };

  return (
    <LikesContext.Provider value={value}>
      {children}
    </LikesContext.Provider>
  );
};

// Custom hook to use Likes context
export const useLikes = () => {
  const context = useContext(LikesContext);
  if (!context) {
    throw new Error('useLikes must be used within a LikesProvider');
  }
  return context;
};

export default LikesContext;
