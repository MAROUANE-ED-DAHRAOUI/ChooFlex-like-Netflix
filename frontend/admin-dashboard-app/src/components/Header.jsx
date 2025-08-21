import React from 'react';
import { FiBell, FiSun, FiMoon, FiUser } from 'react-icons/fi';
import { useAuth } from '../utils/AuthContext';
import { useTheme } from '../utils/ThemeContext';
import './Header.scss';

const Header = () => {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();

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
        
        <div className="user-menu">
          <FiUser className="user-icon" />
          <span className="user-name">{user?.username || 'Admin'}</span>
        </div>
      </div>
    </header>
  );
};

export default Header;
