import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/navbar/Navbar';
import MovieCard from '../../components/movieCard/MovieCard';
import { MovieRowSkeleton } from '../../components/skeletonLoader/SkeletonLoader';
import { useMyList } from '../../hooks/useMyList.jsx';
import './myList.scss';

const MyList = () => {
  const navigate = useNavigate();
  const { myList, loading, removeFromList, clearList } = useMyList();
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredMovies, setFilteredMovies] = useState([]);

  // Filter movies based on search
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredMovies(myList);
    } else {
      const filtered = myList.filter(movie =>
        movie.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        movie.genre?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredMovies(filtered);
    }
  }, [myList, searchQuery]);

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const handleClearList = () => {
    if (window.confirm('Are you sure you want to clear your entire list?')) {
      clearList();
    }
  };

  const handleBackToHome = () => {
    navigate('/');
  };

  if (loading) {
    return (
      <div className="my-list">
        <Navbar onSearch={handleSearch} />
        <div className="my-list__container">
          <div className="my-list__header">
            <h1>My List</h1>
          </div>
          <MovieRowSkeleton count={8} />
        </div>
      </div>
    );
  }

  return (
    <div className="my-list">
      <Navbar 
        onSearch={handleSearch}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />
      
      <div className="my-list__container">
        <div className="my-list__header">
          <div className="header-content">
            <h1>My List</h1>
            <p className="list-count">
              {myList.length} {myList.length === 1 ? 'title' : 'titles'} in your list
            </p>
          </div>
          
          <div className="header-actions">
            {myList.length > 0 && (
              <button 
                className="clear-list-btn"
                onClick={handleClearList}
              >
                Clear List
              </button>
            )}
            <button 
              className="back-btn"
              onClick={handleBackToHome}
            >
              Back to Home
            </button>
          </div>
        </div>

        {filteredMovies.length === 0 ? (
          <div className="my-list__empty">
            {myList.length === 0 ? (
              <>
                <div className="empty-icon">📺</div>
                <h2>Your list is empty</h2>
                <p>Add movies and series you want to watch later.</p>
                <button 
                  className="browse-btn"
                  onClick={handleBackToHome}
                >
                  Browse Content
                </button>
              </>
            ) : (
              <>
                <div className="empty-icon">🔍</div>
                <h2>No results found</h2>
                <p>Try adjusting your search terms.</p>
                <button 
                  className="clear-search-btn"
                  onClick={() => setSearchQuery('')}
                >
                  Clear Search
                </button>
              </>
            )}
          </div>
        ) : (
          <div className="my-list__grid">
            {filteredMovies.map((movie, index) => (
              <div key={movie._id} className="my-list__item">
                <MovieCard 
                  movie={movie} 
                  index={index}
                  showRemoveOption={true}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyList;
