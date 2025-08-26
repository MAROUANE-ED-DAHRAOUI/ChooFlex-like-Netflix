import { useState, useEffect, useContext, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Search, Notifications, ArrowDropDown, AccountCircle, Close, Settings, ExitToApp } from '@mui/icons-material';
import { AuthContext } from '../../authContext/AuthContext';
import { logout } from '../../authContext/apiCalls';
import './navbar.scss';

const Navbar = ({ onSearch, searchQuery, setSearchQuery, clearSearch }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  
  const { user, dispatch } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    document.addEventListener('mousedown', handleClickOutside);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('mousedown', handleClickOutside);
    };
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
            ref={dropdownRef}
          >
            <div 
              className="profile-trigger"
              onClick={() => setShowDropdown(!showDropdown)}
            >
              <div className="profile-avatar">
                <AccountCircle className="profile-icon" />
              </div>
              <ArrowDropDown className={`dropdown-arrow ${showDropdown ? 'rotated' : ''}`} />
            </div>
            
            <div className={`dropdown-menu ${showDropdown ? 'show' : ''}`}>
              <div className="dropdown-header">
                <div className="user-avatar">
                  <AccountCircle />
                </div>
                <div className="user-info">
                  <span className="user-name">{user?.username || 'User'}</span>
                  <span className="user-email">{user?.email || 'user@example.com'}</span>
                </div>
              </div>
              
              <div className="dropdown-divider"></div>
              
              <div className="dropdown-items">
                <button 
                  className="dropdown-item" 
                  onClick={() => {
                    navigate('/settings');
                    setShowDropdown(false);
                  }}
                >
                  <Settings className="dropdown-icon" />
                  <span>Settings</span>
                </button>
                
                <button 
                  className="dropdown-item logout" 
                  onClick={() => {
                    handleLogout();
                    setShowDropdown(false);
                  }}
                >
                  <ExitToApp className="dropdown-icon" />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
