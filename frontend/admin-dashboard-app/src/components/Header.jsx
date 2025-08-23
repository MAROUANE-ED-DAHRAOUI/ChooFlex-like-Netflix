import React, { useState, useRef, useEffect } from 'react';
import { FiBell, FiSun, FiMoon, FiUser, FiChevronDown, FiBarChart, FiUsers, FiPlay, FiSettings } from 'react-icons/fi';
import { useAuth } from '../utils/AuthContext';
import { useTheme } from '../utils/ThemeContext';
import { useNavigate, useLocation } from 'react-router-dom';
import './Header.scss';

const Header = () => {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const menuRef = useRef(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const menuItems = [
    { icon: FiBarChart, label: 'Dashboard', path: '/dashboard' },
    { icon: FiUsers, label: 'Users', path: '/users' },
    { icon: FiPlay, label: 'Content', path: '/content' },
    { icon: FiBarChart, label: 'Analytics', path: '/analytics' },
    { icon: FiSettings, label: 'Settings', path: '/settings' },
  ];

  const handleMenuItemClick = (path) => {
    navigate(path);
    setShowProfileMenu(false);
  };

  return (
    <header className="header">
      <div className="header-left">
        <h1 className="page-title">Admin Dashboard</h1>
      </div>
      
      <div className="header-right">
        <button 
          onClick={toggleTheme} 
          className="icon-btn"
          title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        >
          {theme === 'light' ? <FiMoon /> : <FiSun />}
        </button>
        
        <button className="icon-btn" title="Notifications">
          <FiBell />
        </button>
        
        <div className="user-menu" ref={menuRef}>
          <button 
            className="user-profile-btn"
            onClick={() => setShowProfileMenu(!showProfileMenu)}
          >
            <FiUser className="user-icon" />
            <span className="user-name">{user?.username || 'Admin'}</span>
            <FiChevronDown className={`chevron ${showProfileMenu ? 'open' : ''}`} />
          </button>
          
          {showProfileMenu && (
            <div className="profile-dropdown">
              {menuItems.map((item, index) => {
                const IconComponent = item.icon;
                const isActive = location.pathname === item.path;
                
                return (
                  <button
                    key={index}
                    className={`menu-item ${isActive ? 'active' : ''}`}
                    onClick={() => handleMenuItemClick(item.path)}
                  >
                    <IconComponent className="menu-icon" />
                    <span className="menu-label">{item.label}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
