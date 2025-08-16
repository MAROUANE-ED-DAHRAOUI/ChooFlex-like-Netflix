import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getRandomMovie } from "../../services/api";
import Navbar from "../../components/navbar/Navbar";
import MovieCard from "../../components/movieCard/MovieCard";
import "./series.scss";

export default function Series() {
  const [series, setSeries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredSeries, setFilteredSeries] = useState([]);
  const [sortBy, setSortBy] = useState("title"); // title, year, rating
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  
  const navigate = useNavigate();
  const ITEMS_PER_PAGE = 20;

  useEffect(() => {
    fetchSeries();
  }, []);

  useEffect(() => {
    filterAndSortSeries();
  }, [series, searchTerm, sortBy]);

  const fetchSeries = async () => {
    try {
      setLoading(true);
      setError(null);
      // Use demo/test endpoint for series
      const demoSeries = await getRandomMovie("series");
      setSeries(demoSeries ? [demoSeries] : []);
    } catch (error) {
      console.error("Failed to fetch series:", error);
      setError("Failed to load series. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortSeries = () => {
    let filtered = series;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.desc?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sort series
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

    setFilteredSeries(filtered);
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

  const loadMore = () => {
    setPage(prev => prev + 1);
  };

  const getCurrentPageItems = () => {
    return filteredSeries.slice(0, page * ITEMS_PER_PAGE);
  };

  const handleSeriesClick = (series) => {
    navigate(`/watch/${series._id}`);
  };

  if (error) {
    return (
      <div className="series">
        <Navbar onSearch={handleSearch} />
        <div className="series__error">
          <h2>Oops! Something went wrong</h2>
          <p>{error}</p>
          <button onClick={fetchSeries} className="series__retry-btn">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="series">
      <Navbar onSearch={handleSearch} />
      
      <div className="series__container">
        {/* Header */}
        <div className="series__header">
          <h1 className="series__title">TV Shows</h1>
          <p className="series__subtitle">
            Discover endless entertainment with our vast collection of TV series
          </p>
        </div>

        {/* Controls */}
        <div className="series__controls">
          <div className="series__stats">
            {loading ? (
              <span>Loading...</span>
            ) : (
              <span>{filteredSeries.length} series found</span>
            )}
          </div>
          
          <div className="series__sort">
            <label htmlFor="sort-select">Sort by:</label>
            <select
              id="sort-select"
              value={sortBy}
              onChange={(e) => handleSortChange(e.target.value)}
              className="series__sort-select"
            >
              <option value="title">Title (A-Z)</option>
              <option value="year">Year (Newest)</option>
              <option value="rating">Rating (Highest)</option>
            </select>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="series__grid">
            {/* Skeleton loading */}
            {[...Array(12)].map((_, index) => (
              <div key={index} className="series__skeleton">
                <div className="series__skeleton-img"></div>
                <div className="series__skeleton-title"></div>
                <div className="series__skeleton-desc"></div>
              </div>
            ))}
          </div>
        ) : filteredSeries.length === 0 ? (
          <div className="series__empty">
            <h3>No series found</h3>
            <p>
              {searchTerm
                ? `No series match your search for "${searchTerm}"`
                : "No series available at the moment"}
            </p>
            {searchTerm && (
              <button 
                onClick={() => handleSearch("")}
                className="series__clear-search"
              >
                Clear search
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="series__grid">
              {getCurrentPageItems().map((item) => (
                <MovieCard
                  key={item._id}
                  movie={item}
                  onClick={() => handleSeriesClick(item)}
                />
              ))}
            </div>

            {/* Load More Button */}
            {hasMore && (
              <div className="series__load-more">
                <button 
                  onClick={loadMore}
                  className="series__load-more-btn"
                >
                  Load More Series
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
