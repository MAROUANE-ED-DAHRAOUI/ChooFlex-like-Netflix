import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, FilterList, Tv } from "@mui/icons-material";
import api from "../../services/api";
import Navbar from "../../components/navbar/Navbar";
import MovieRow from "../../components/movieRow/MovieRow";
import "./series.scss";

export default function Series() {
  const [series, setSeries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredSeries, setFilteredSeries] = useState([]);
  const [filterGenre, setFilterGenre] = useState("");
  const [filterYear, setFilterYear] = useState("");
  const [filterRating, setFilterRating] = useState("");
  
  const navigate = useNavigate();

  // Get unique values for filter options
  const getUniqueGenres = () => {
    const genres = new Set();
    series.forEach(item => {
      if (item.genre) {
        if (Array.isArray(item.genre)) {
          item.genre.forEach(g => genres.add(g));
        } else {
          genres.add(item.genre);
        }
      }
    });
    return Array.from(genres).sort();
  };

  const getUniqueYears = () => {
    const years = new Set();
    series.forEach(item => {
      if (item.year) years.add(item.year);
    });
    return Array.from(years).sort((a, b) => b - a);
  };

  useEffect(() => {
    fetchSeries();
  }, []);

  useEffect(() => {
    filterAndSortSeries();
  }, [series, searchTerm, filterGenre, filterYear, filterRating]);

  const fetchSeries = async () => {
    try {
      setLoading(true);
      setError(null);
      // Fetch all series from backend
      const response = await api.get('/series');
      setSeries(Array.isArray(response.data) ? response.data : []);
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

    // Filter by genre
    if (filterGenre) {
      filtered = filtered.filter(item => {
        if (Array.isArray(item.genre)) {
          return item.genre.some(g => g.toLowerCase().includes(filterGenre.toLowerCase()));
        }
        return item.genre?.toLowerCase().includes(filterGenre.toLowerCase());
      });
    }

    // Filter by year
    if (filterYear) {
      filtered = filtered.filter(item => item.year?.toString() === filterYear);
    }

    // Filter by rating
    if (filterRating) {
      const minRating = parseFloat(filterRating);
      filtered = filtered.filter(item => (item.rating || 0) >= minRating);
    }

    // Sort series by title by default
    filtered.sort((a, b) => {
      return (a.title || "").localeCompare(b.title || "");
    });

    setFilteredSeries(filtered);
  };

  const handleLocalSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleFilterChange = (type, value) => {
    switch (type) {
      case 'genre':
        setFilterGenre(value);
        break;
      case 'year':
        setFilterYear(value);
        break;
      case 'rating':
        setFilterRating(value);
        break;
      default:
        break;
    }
  };

  const clearAllFilters = () => {
    setSearchTerm("");
    setFilterGenre("");
    setFilterYear("");
    setFilterRating("");
  };

  // Get all series as a flat list for row display without genre grouping
  const getSeriesForDisplay = () => {
    // Return all filtered series as one group
    return filteredSeries;
  };

  const handleSeriesClick = (series) => {
    navigate(`/watch/${series._id}`);
  };

  if (error) {
    return (
      <div className="series">
        <Navbar />
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
      <Navbar />
      
      <div className="series__container">
        {/* Header */}
        <div className="series__header">
          <h1 className="series__title">Series</h1>
          <p className="series__subtitle">
            Discover endless entertainment with our vast collection of TV series
          </p>
        </div>

        {/* Enhanced Controls - Compact Single Line */}
        <div className="series__controls">
          <div className="series__controls-inline">
            {/* Results Count */}
            <div className="series__results-count">
              <Tv className="series__results-icon" />
              {loading ? (
                <span>Loading...</span>
              ) : (
                <span><span>{filteredSeries.length}</span> series found</span>
              )}
            </div>

            {/* Search Bar */}
            <div className="series__search-compact">
              <Search className="series__search-icon" />
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={handleLocalSearch}
                className="series__search-field-compact"
              />
            </div>

            {/* Genre Filter */}
            <select
              value={filterGenre}
              onChange={(e) => handleFilterChange('genre', e.target.value)}
              className="series__filter-select-compact"
            >
              <option value="">All Genres</option>
              {getUniqueGenres().map(genre => (
                <option key={genre} value={genre}>{genre}</option>
              ))}
            </select>

            {/* Year Filter */}
            <select
              value={filterYear}
              onChange={(e) => handleFilterChange('year', e.target.value)}
              className="series__filter-select-compact"
            >
              <option value="">All Years</option>
              {getUniqueYears().map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>

            {/* Rating Filter */}
            <select
              value={filterRating}
              onChange={(e) => handleFilterChange('rating', e.target.value)}
              className="series__filter-select-compact"
            >
              <option value="">All Ratings</option>
              <option value="8">8+ Stars</option>
              <option value="7">7+ Stars</option>
              <option value="6">6+ Stars</option>
              <option value="5">5+ Stars</option>
            </select>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="series__loading">
            {/* Skeleton loading */}
            {[...Array(4)].map((_, index) => (
              <div key={index} className="series__skeleton-row">
                <div className="series__skeleton-title"></div>
                <div className="series__skeleton-content">
                  {[...Array(6)].map((_, cardIndex) => (
                    <div key={cardIndex} className="series__skeleton-card">
                      <div className="series__skeleton-img"></div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : filteredSeries.length === 0 ? (
          <div className="series__empty">
            <h3>No series found</h3>
            <p>
              {searchTerm || filterGenre || filterYear || filterRating
                ? `No series match your current filters`
                : "No series available at the moment"}
            </p>
            {(searchTerm || filterGenre || filterYear || filterRating) && (
              <button 
                onClick={clearAllFilters}
                className="series__clear-search"
              >
                Clear all filters
              </button>
            )}
          </div>
        ) : (
          <div className="series__rows">
            {(() => {
              const allSeries = getSeriesForDisplay();
              const chunkSize = 8; // Number of series per row
              const chunks = [];
              
              // Split series into chunks for multiple rows
              for (let i = 0; i < allSeries.length; i += chunkSize) {
                chunks.push(allSeries.slice(i, i + chunkSize));
              }
              
              return chunks.map((seriesChunk, index) => (
                <MovieRow
                  key={`series-row-${index}`}
                  title="" // No title for professional look
                  movies={seriesChunk}
                  isLoading={false}
                />
              ));
            })()}
          </div>
        )}
      </div>
    </div>
  );
}
