import { useState, useEffect } from 'react';
import { moviesAPI } from '../../services/api';
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
        // Fetch movie details for each ID in the list
        const moviePromises = list.content.map(async (movieId) => {
          try {
            return await moviesAPI.getMovieById(movieId);
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
