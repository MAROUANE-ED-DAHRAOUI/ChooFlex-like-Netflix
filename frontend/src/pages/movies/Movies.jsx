import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getRandomMovie } from "../../services/api";
import Navbar from "../../components/navbar/Navbar";
import MovieCard from "../../components/movieCard/MovieCard";
import "./movies.scss";

export default function Movies() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredMovies, setFilteredMovies] = useState([]);
  const [sortBy, setSortBy] = useState("title"); // title, year, rating
  const [selectedGenre, setSelectedGenre] = useState("");
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

  useEffect(() => {
    fetchMovies();
  }, []);

  useEffect(() => {
    filterAndSortMovies();
  }, [movies, searchTerm, sortBy, selectedGenre]);

  const fetchMovies = async () => {
    try {
      setLoading(true);
      setError(null);
      // Use demo/test endpoint for movies
      const demoMovie = await getRandomMovie("movie");
      setMovies(demoMovie ? [demoMovie] : []);
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

    // Sort movies
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "year":
          return (b.year || 0) - (a.year || 0);
        case "rating":
          return (b.rating || 0) - (a.rating || 0);
        case "title":
        default:
          return (a.title || "").localeCompare(b.title || "");
      }
    });

    setFilteredMovies(filtered);
    setHasMore(filtered.length > page * ITEMS_PER_PAGE);
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
    setPage(1);
  };

  const handleSortChange = (newSortBy) => {
    setSortBy(newSortBy);
    setPage(1);
  };

  const handleGenreChange = (genre) => {
    setSelectedGenre(genre);
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

        {/* Filters */}
        <div className="movies__filters">
          <div className="movies__genre-filter">
            <label htmlFor="genre-select">Genre:</label>
            <select
              id="genre-select"
              value={selectedGenre}
              onChange={(e) => handleGenreChange(e.target.value)}
              className="movies__genre-select"
            >
              <option value="">All Genres</option>
              {genres.map(genre => (
                <option key={genre} value={genre}>{genre}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Controls */}
        <div className="movies__controls">
          <div className="movies__stats">
            {loading ? (
              <span>Loading...</span>
            ) : (
              <span>
                {filteredMovies.length} movies found
                {selectedGenre && ` in ${selectedGenre}`}
                {searchTerm && ` for "${searchTerm}"`}
              </span>
            )}
          </div>
          
          <div className="movies__sort">
            <label htmlFor="sort-select">Sort by:</label>
            <select
              id="sort-select"
              value={sortBy}
              onChange={(e) => handleSortChange(e.target.value)}
              className="movies__sort-select"
            >
              <option value="title">Title (A-Z)</option>
              <option value="year">Year (Newest)</option>
              <option value="rating">Rating (Highest)</option>
            </select>
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
            {(searchTerm || selectedGenre) && (
              <div className="movies__clear-filters">
                <button 
                  onClick={() => {
                    handleSearch("");
                    handleGenreChange("");
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
