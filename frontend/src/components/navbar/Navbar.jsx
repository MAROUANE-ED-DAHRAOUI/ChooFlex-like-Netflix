import { useState, useEffect, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Search, Notifications, ArrowDropDown, AccountCircle, Close } from '@mui/icons-material';
import { AuthContext } from '../../authContext/AuthContext';
import { logout } from '../../authContext/apiCalls';
import './navbar.scss';

const Navbar = ({ onSearch, searchQuery, setSearchQuery, clearSearch }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  
  const { dispatch } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout(dispatch);
    navigate('/login');
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onSearch && onSearch(searchQuery.trim());
    }
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    if (onSearch) {
      onSearch(value);
    }
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setShowSearch(false);
    if (clearSearch) {
      clearSearch();
    }
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
      <div className="navbar-content">
        {/* Logo */}
        <div className="navbar-left">
          <div className="logo" onClick={() => navigate('/')}>
            <span>ChooFlex</span>
          </div>
          
          {/* Navigation Links */}
          <ul className="nav-links">
            <li>
              <a 
                href="/" 
                className={isActive('/') ? 'active' : ''}
                onClick={(e) => {
                  e.preventDefault();
                  navigate('/');
                }}
              >
                Home
              </a>
            </li>
            <li>
              <a 
                href="/series" 
                className={isActive('/series') ? 'active' : ''}
                onClick={(e) => {
                  e.preventDefault();
                  navigate('/series');
                }}
              >
                TV Shows
              </a>
            </li>
            <li>
              <a 
                href="/movies" 
                className={isActive('/movies') ? 'active' : ''}
                onClick={(e) => {
                  e.preventDefault();
                  navigate('/movies');
                }}
              >
                Movies
              </a>
            </li>
            <li>
              <a 
                href="/my-list" 
                className={isActive('/my-list') ? 'active' : ''}
                onClick={(e) => {
                  e.preventDefault();
                  navigate('/my-list');
                }}
              >
                My List
              </a>
            </li>
          </ul>
        </div>

        {/* Right side */}
        <div className="navbar-right">
          {/* Search */}
          <div className={`search-container ${showSearch || searchQuery ? 'active' : ''}`}>
            <Search 
              className="search-icon" 
              onClick={() => setShowSearch(!showSearch)}
            />
            {(showSearch || searchQuery) && (
              <form onSubmit={handleSearchSubmit} className="search-form">
                <input
                  type="text"
                  placeholder="Search movies, TV shows..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  autoFocus
                />
                {searchQuery && (
                  <Close 
                    className="clear-search" 
                    onClick={handleClearSearch}
                  />
                )}
              </form>
            )}
          </div>

          {/* Notifications */}
          <div className="notifications">
            <Notifications className="icon" />
          </div>

          {/* Profile Dropdown */}
          <div 
            className="profile-dropdown"
            onMouseEnter={() => setShowDropdown(true)}
            onMouseLeave={() => setShowDropdown(false)}
          >
            <div className="profile-trigger">
              <AccountCircle className="profile-icon" />
              <ArrowDropDown className="dropdown-arrow" />
            </div>
            
            {showDropdown && (
              <div className="dropdown-menu">
                <div className="dropdown-item" onClick={() => navigate('/profile')}>
                  <AccountCircle className="dropdown-icon" />
                  Profile
                </div>
                <div className="dropdown-item" onClick={() => navigate('/settings')}>
                  Settings
                </div>
                <div className="dropdown-divider"></div>
                <div className="dropdown-item" onClick={handleLogout}>
                  Sign out
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
