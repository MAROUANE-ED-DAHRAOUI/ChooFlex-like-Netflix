import { useEffect, useState } from 'react';
import { listsAPI } from '../../services/api';
import Navbar from '../../components/navbar/Navbar';
import Featured from '../../components/featured/Featured';
import List from '../../components/list/List';
import './home.scss';

const Home = ({ type }) => {
  const [lists, setLists] = useState([]);
  const [genre, setGenre] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLists = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await listsAPI.getLists(type, genre);
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

  const handleGenreChange = (selectedGenre) => {
    setGenre(selectedGenre === '' ? null : selectedGenre);
  };

  return (
    <div className="home">
      <Navbar />
      <Featured type={type} setGenre={handleGenreChange} />
      
      <div className="home-content">
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
      </div>
    </div>
  );
};

export default Home;