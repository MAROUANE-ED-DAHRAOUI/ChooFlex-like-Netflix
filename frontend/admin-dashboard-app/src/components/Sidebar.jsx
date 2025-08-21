import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  FiHome, 
  FiUsers, 
  FiPlay, 
  FiBarChart3, 
  FiSettings, 
  FiLogOut 
} from 'react-icons/fi';
import { useAuth } from '../utils/AuthContext';
import { useTheme } from '../utils/ThemeContext';
import './Sidebar.scss';

const Sidebar = () => {
  const { logout } = useAuth();
  const { theme } = useTheme();
  const navigate = useNavigate();

  const navItems = [
    { path: '/', icon: FiHome, label: 'Dashboard' },
    { path: '/users', icon: FiUsers, label: 'Users' },
    { path: '/content', icon: FiPlay, label: 'Content' },
    { path: '/analytics', icon: FiBarChart3, label: 'Analytics' },
    { path: '/settings', icon: FiSettings, label: 'Settings' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside className={`sidebar ${theme}`}>
      <div className="sidebar-header">
        <div className="logo">
          <FiPlay className="logo-icon" />
          <span className="logo-text">ChooFlex Admin</span>
        </div>
      </div>
      
      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            end={item.path === '/'}
          >
            <item.icon className="nav-icon" />
            <span className="nav-label">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        <button onClick={handleLogout} className="logout-btn">
          <FiLogOut className="nav-icon" />
          <span className="nav-label">Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
