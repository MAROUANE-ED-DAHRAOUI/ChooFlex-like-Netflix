import { useEffect, useState } from 'react';
import { getLists, searchContent } from '../../services/api';
import Navbar from '../../components/navbar/Navbar';
import Featured from '../../components/featured/Featured';
import List from '../../components/list/List';
import SearchResults from '../../components/searchResults/SearchResults';
import { useDebounce } from '../../hooks/useDebounce';
import './home.scss';

const Home = ({ type }) => {
  const [lists, setLists] = useState([]);
  const [genre, setGenre] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState(null);
  
  // Debounce search query
  const debouncedSearchQuery = useDebounce(searchQuery, 500);
  
  // Is searching flag
  const isSearching = searchQuery.trim().length > 0;

  useEffect(() => {
    const fetchLists = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getLists(type, genre);
        setLists(data || []);
      } catch (err) {
        console.error('Error fetching lists:', err);
        setError('Failed to load content');
      } finally {
        setLoading(false);
      }
    };

    fetchLists();
  }, [type, genre]);

  // Search functionality
  useEffect(() => {
    const performSearch = async () => {
      if (debouncedSearchQuery.trim() === '') {
        setSearchResults([]);
        setSearchLoading(false);
        setSearchError(null);
        return;
      }

      try {
        setSearchLoading(true);
        setSearchError(null);
        const results = await searchContent(debouncedSearchQuery.trim());
        setSearchResults(results.results || []);
      } catch (err) {
        console.error('Search error:', err);
        setSearchError('Failed to search content');
        setSearchResults([]);
      } finally {
        setSearchLoading(false);
      }
    };

    performSearch();
  }, [debouncedSearchQuery]);

  const handleGenreChange = (selectedGenre) => {
    setGenre(selectedGenre === '' ? null : selectedGenre);
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
    setSearchError(null);
  };

  return (
    <div className="home">
      <Navbar 
        onSearch={handleSearch}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        clearSearch={clearSearch}
      />
      {!isSearching && <Featured type={type} setGenre={handleGenreChange} />}
      
      <div className="home-content">
        {isSearching ? (
          // Show search results
          <SearchResults 
            searchResults={searchResults}
            isLoading={searchLoading}
            query={searchQuery}
            error={searchError}
          />
        ) : (
          // Show regular content
          <>
            {error && (
              <div className="error-message">
                <p>{error}</p>
                <button onClick={() => window.location.reload()}>
                  Try Again
                </button>
              </div>
            )}

            {loading ? (
              // Loading skeleton
              <div className="loading-lists">
                {[...Array(4)].map((_, index) => (
                  <List key={index} list={{ title: '', content: [] }} />
                ))}
              </div>
            ) : (
              // Actual content
              <div className="content-lists">
                {lists.length > 0 ? (
                  lists.map((list, index) => (
                    <List key={list._id || index} list={list} />
                  ))
                ) : (
                  <div className="no-content">
                    <h3>No content available</h3>
                    <p>Try changing the genre filter or check back later.</p>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Home;