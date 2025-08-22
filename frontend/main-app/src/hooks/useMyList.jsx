import { useState, useEffect, useContext, createContext } from 'react';

// Create MyList Context
const MyListContext = createContext();

// MyList Provider Component
export const MyListProvider = ({ children }) => {
  const [myList, setMyList] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load list from localStorage on mount
  useEffect(() => {
    try {
      const savedList = localStorage.getItem('chooflix-my-list');
      if (savedList) {
        const parsedList = JSON.parse(savedList);
        setMyList(Array.isArray(parsedList) ? parsedList : []);
      }
    } catch (error) {
      console.error('Error loading my list:', error);
      setMyList([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Save list to localStorage whenever it changes
  useEffect(() => {
    if (!loading) {
      try {
        localStorage.setItem('chooflix-my-list', JSON.stringify(myList));
      } catch (error) {
        console.error('Error saving my list:', error);
      }
    }
  }, [myList, loading]);

  // Add movie to list
  const addToList = (movie) => {
    if (!movie || !movie._id) {
      console.error('Invalid movie object');
      return false;
    }

    // Check if movie is already in list
    const isAlreadyInList = myList.some(item => item._id === movie._id);
    if (isAlreadyInList) {
      console.log('Movie already in list:', movie.title);
      return false;
    }

    setMyList(prevList => [...prevList, movie]);
    console.log('Added to list:', movie.title);
    return true;
  };

  // Remove movie from list
  const removeFromList = (movieId) => {
    setMyList(prevList => prevList.filter(item => item._id !== movieId));
    console.log('Removed from list:', movieId);
  };

  // Check if movie is in list
  const isInList = (movieId) => {
    return myList.some(item => item._id === movieId);
  };

  // Clear entire list
  const clearList = () => {
    setMyList([]);
    console.log('Cleared entire list');
  };

  // Toggle movie in/out of list
  const toggleInList = (movie) => {
    if (isInList(movie._id)) {
      removeFromList(movie._id);
      return false; // removed
    } else {
      return addToList(movie); // added
    }
  };

  const value = {
    myList,
    loading,
    addToList,
    removeFromList,
    isInList,
    clearList,
    toggleInList,
    count: myList.length
  };

  return (
    <MyListContext.Provider value={value}>
      {children}
    </MyListContext.Provider>
  );
};

// Custom hook to use MyList context
export const useMyList = () => {
  const context = useContext(MyListContext);
  if (!context) {
    throw new Error('useMyList must be used within a MyListProvider');
  }
  return context;
};

export default MyListContext;
