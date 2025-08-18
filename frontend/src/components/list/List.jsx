import { useState, useEffect } from 'react';
import { getMovieById } from '../../services/api';
import MovieRow from '../movieRow/MovieRow';
import './list.scss';

const List = ({ list }) => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMovies = async () => {
      if (!list?.content || list.content.length === 0) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        
        // Check if content is already populated with full movie objects
        const firstItem = list.content[0];
        if (firstItem && typeof firstItem === 'object' && firstItem.title) {
          // Content is already populated
          setMovies(list.content);
          setLoading(false);
          return;
        }
        
        // Content contains only IDs, need to fetch movie details
        const moviePromises = list.content.map(async (movieId) => {
          try {
            return await getMovieById(movieId);
          } catch (error) {
            console.error(`Error fetching movie ${movieId}:`, error);
            return null;
          }
        });

        const movieResults = await Promise.all(moviePromises);
        const validMovies = movieResults.filter(movie => movie !== null);
        setMovies(validMovies);
      } catch (error) {
        console.error('Error fetching movies for list:', error);
        setMovies([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, [list]);

  return (
    <div className="list">
      <MovieRow 
        title={list?.title || 'Untitled List'}
        movies={movies}
        isLoading={loading}
      />
    </div>
  );
};

export default List;
