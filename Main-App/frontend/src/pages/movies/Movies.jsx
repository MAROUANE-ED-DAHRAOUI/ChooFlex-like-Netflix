import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Movie } from '@mui/icons-material';
import api from "../../services/api";
import Navbar from "../../components/navbar/Navbar";
import MovieCard from "../../components/movieCard/MovieCard";
import "./movies.scss";

export default function Movies() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredMovies, setFilteredMovies] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedRating, setSelectedRating] = useState("");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  
  const navigate = useNavigate();
  const ITEMS_PER_PAGE = 20;

  // Common movie genres
  const genres = [
    "Action", "Adventure", "Comedy", "Drama", "Horror", 
    "Romance", "Sci-Fi", "Thriller", "Crime", "Fantasy",
    "Animation", "Documentary", "Mystery", "War", "Western"
  ];

  // Get unique years from movies
  const getUniqueYears = () => {
    const years = new Set();
    movies.forEach(movie => {
      if (movie.year) years.add(movie.year);
    });
    return Array.from(years).sort((a, b) => b - a);
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  useEffect(() => {
    filterAndSortMovies();
  }, [movies, searchTerm, selectedGenre, selectedYear, selectedRating]);

  const fetchMovies = async () => {
    try {
      setLoading(true);
      setError(null);
      // Fetch random movies for demo (repeat random endpoint)
      const movies = [];
      for (let i = 0; i < 10; i++) {
        const response = await api.get('/movies/random');
        if (Array.isArray(response.data) && response.data[0]) {
          movies.push(response.data[0]);
        }
      }
      setMovies(movies);
    } catch (error) {
      console.error("Failed to fetch movies:", error);
      setError("Failed to load movies. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortMovies = () => {
    let filtered = movies;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.desc?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by genre
    if (selectedGenre) {
      filtered = filtered.filter(item =>
        item.genre?.toLowerCase().includes(selectedGenre.toLowerCase())
      );
    }

    // Filter by year
    if (selectedYear) {
      filtered = filtered.filter(item => item.year === parseInt(selectedYear));
    }

    // Filter by rating
    if (selectedRating) {
      const minRating = parseFloat(selectedRating);
      filtered = filtered.filter(item => (item.rating || 0) >= minRating);
    }

    setFilteredMovies(filtered);
    setHasMore(filtered.length > page * ITEMS_PER_PAGE);
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
    setPage(1);
  };

  const handleGenreChange = (genre) => {
    setSelectedGenre(genre);
    setPage(1);
  };

  const handleYearChange = (year) => {
    setSelectedYear(year);
    setPage(1);
  };

  const handleRatingChange = (rating) => {
    setSelectedRating(rating);
    setPage(1);
  };

  const loadMore = () => {
    setPage(prev => prev + 1);
  };

  const getCurrentPageItems = () => {
    return filteredMovies.slice(0, page * ITEMS_PER_PAGE);
  };

  const handleMovieClick = (movie) => {
    navigate(`/watch/${movie._id}`);
  };

  if (error) {
    return (
      <div className="movies">
        <Navbar onSearch={handleSearch} />
        <div className="movies__error">
          <h2>Oops! Something went wrong</h2>
          <p>{error}</p>
          <button onClick={fetchMovies} className="movies__retry-btn">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="movies">
      <Navbar onSearch={handleSearch} />
      
      <div className="movies__container">
        {/* Header */}
        <div className="movies__header">
          <h1 className="movies__title">Movies</h1>
          <p className="movies__subtitle">
            Explore our extensive collection of blockbuster movies and hidden gems
          </p>
        </div>

        {/* Compact Controls */}
        <div className="movies__controls">
          <div className="movies__controls-inline">
            {/* Search Input */}
            <div className="movies__search-compact">
              <Search className="movies__search-icon" />
              <input
                type="text"
                placeholder="Search movies..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="movies__search-field-compact"
              />
            </div>

            {/* Genre Filter */}
            <select
              value={selectedGenre}
              onChange={(e) => handleGenreChange(e.target.value)}
              className="movies__filter-select-compact"
            >
              <option value="">All Genres</option>
              {genres.map(genre => (
                <option key={genre} value={genre}>{genre}</option>
              ))}
            </select>

            {/* Year Filter */}
            <select
              value={selectedYear}
              onChange={(e) => handleYearChange(e.target.value)}
              className="movies__filter-select-compact"
            >
              <option value="">All Years</option>
              {getUniqueYears().map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>

            {/* Rating Filter */}
            <select
              value={selectedRating}
              onChange={(e) => handleRatingChange(e.target.value)}
              className="movies__filter-select-compact"
            >
              <option value="">All Ratings</option>
              <option value="8">8+ Stars</option>
              <option value="7">7+ Stars</option>
              <option value="6">6+ Stars</option>
              <option value="5">5+ Stars</option>
            </select>

            {/* Results Count */}
            <div className="movies__results-count">
              <Movie className="movies__results-icon" />
              {loading ? (
                <span>Loading...</span>
              ) : (
                <span><span>{filteredMovies.length}</span> movies found</span>
              )}
            </div>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="movies__grid">
            {/* Skeleton loading */}
            {[...Array(12)].map((_, index) => (
              <div key={index} className="movies__skeleton">
                <div className="movies__skeleton-img"></div>
                <div className="movies__skeleton-title"></div>
                <div className="movies__skeleton-desc"></div>
              </div>
            ))}
          </div>
        ) : filteredMovies.length === 0 ? (
          <div className="movies__empty">
            <h3>No movies found</h3>
            <p>
              {searchTerm || selectedGenre
                ? `No movies match your filters`
                : "No movies available at the moment"}
            </p>
            {(searchTerm || selectedGenre || selectedYear || selectedRating) && (
              <div className="movies__clear-filters">
                <button 
                  onClick={() => {
                    handleSearch("");
                    handleGenreChange("");
                    handleYearChange("");
                    handleRatingChange("");
                  }}
                  className="movies__clear-search"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </div>
        ) : (
          <>
            <div className="movies__grid">
              {getCurrentPageItems().map((item) => (
                <MovieCard
                  key={item._id}
                  movie={item}
                  onClick={() => handleMovieClick(item)}
                />
              ))}
            </div>

            {/* Load More Button */}
            {hasMore && (
              <div className="movies__load-more">
                <button 
                  onClick={loadMore}
                  className="movies__load-more-btn"
                >
                  Load More Movies
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
