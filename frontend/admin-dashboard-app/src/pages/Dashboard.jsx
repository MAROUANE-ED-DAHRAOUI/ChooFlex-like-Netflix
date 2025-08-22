import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiUsers, FiPlay, FiActivity, FiEye, FiTrendingUp, FiClock } from 'react-icons/fi';
import { analyticsAPI } from '../services/api';
import StatsCard from '../components/StatsCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { formatNumber, formatDate } from '../utils/helpers';
import './Dashboard.scss';

const Dashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [topContent, setTopContent] = useState([]);
  const [activeUsers, setActiveUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // For demo purposes, use mock data since backend APIs don't exist yet
      setStats({
        users: { total: 2847, new: 125, active: 1230 },
        content: { total: 1250, movies: 850, series: 400 },
        activity: { totalViews: 125430, dailyViews: 3420, avgSessionTime: 45 }
      });

      setTopContent([
        { id: 1, title: 'Inception', type: 'movie', genre: 'Sci-Fi', year: 2010, views: 15420, rating: 8.8 },
        { id: 2, title: 'Breaking Bad', type: 'series', genre: 'Drama', year: 2008, views: 28930, rating: 9.5 },
        { id: 3, title: 'The Dark Knight', type: 'movie', genre: 'Action', year: 2008, views: 21870, rating: 9.0 },
        { id: 4, title: 'Stranger Things', type: 'series', genre: 'Sci-Fi', year: 2016, views: 19650, rating: 8.7 },
        { id: 5, title: 'The Godfather', type: 'movie', genre: 'Drama', year: 1972, views: 17890, rating: 9.2 }
      ]);

      setActiveUsers([
        { id: 1, username: 'john_doe', sessionsToday: 3, totalWatchTime: 120, lastActive: new Date().toISOString() },
        { id: 2, username: 'jane_smith', sessionsToday: 2, totalWatchTime: 85, lastActive: new Date(Date.now() - 3600000).toISOString() },
        { id: 3, username: 'movie_lover', sessionsToday: 5, totalWatchTime: 200, lastActive: new Date(Date.now() - 7200000).toISOString() },
        { id: 4, username: 'series_fan', sessionsToday: 1, totalWatchTime: 60, lastActive: new Date(Date.now() - 10800000).toISOString() },
        { id: 5, username: 'casual_viewer', sessionsToday: 2, totalWatchTime: 45, lastActive: new Date(Date.now() - 14400000).toISOString() }
      ]);

    } catch (error) {
      console.error('Dashboard data fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner fullScreen text="Loading dashboard..." />;
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Dashboard Overview</h1>
        <p>Welcome back! Here's what's happening with your platform.</p>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <StatsCard
          title="Total Users"
          value={stats?.users?.total || 0}
          icon={<FiUsers />}
          trend={{
            value: stats?.users?.new || 0,
            label: 'new this month',
            type: 'positive'
          }}
          color="primary"
        />
        
        <StatsCard
          title="Content Items"
          value={stats?.content?.total || 0}
          icon={<FiPlay />}
          trend={{
            value: `${stats?.content?.movies || 0} movies, ${stats?.content?.series || 0} series`,
            label: 'total content',
            type: 'neutral'
          }}
          color="success"
        />
        
        <StatsCard
          title="Total Views"
          value={formatNumber(stats?.activity?.totalViews || 0)}
          icon={<FiEye />}
          trend={{
            value: formatNumber(stats?.activity?.dailyViews || 0),
            label: 'views today',
            type: 'positive'
          }}
          color="info"
        />
        
        <StatsCard
          title="Active Users"
          value={stats?.users?.active || 0}
          icon={<FiActivity />}
          trend={{
            value: `${stats?.activity?.avgSessionTime || 0}m`,
            label: 'avg session time',
            type: 'neutral'
          }}
          color="warning"
        />
      </div>

      {/* Content Grid */}
      <div className="dashboard-content">
        {/* Top Content */}
        <div className="dashboard-card">
          <div className="card-header">
            <h2>Top Performing Content</h2>
            <p>Most viewed content this week</p>
          </div>
          <div className="card-body">
            {topContent.length > 0 ? (
              <div className="content-list">
                {topContent.map((item, index) => (
                  <div key={item.id} className="content-item">
                    <div className="content-rank">#{index + 1}</div>
                    <div className="content-info">
                      <h3>{item.title}</h3>
                      <div className="content-meta">
                        <span className={`content-type ${item.type}`}>
                          {item.type}
                        </span>
                        <span className="content-genre">{item.genre}</span>
                        <span className="content-year">{item.year}</span>
                      </div>
                    </div>
                    <div className="content-stats">
                      <div className="stat">
                        <FiEye />
                        <span>{formatNumber(item.views || 0)}</span>
                      </div>
                      <div className="content-rating">
                        ⭐ {item.rating || 'N/A'}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <FiPlay className="empty-icon" />
                <p>No content data available</p>
              </div>
            )}
          </div>
        </div>

        {/* Active Users */}
        <div className="dashboard-card">
          <div className="card-header">
            <h2>Recent Active Users</h2>
            <p>Users active in the last 24 hours</p>
          </div>
          <div className="card-body">
            {activeUsers.length > 0 ? (
              <div className="users-list">
                {activeUsers.map((user) => (
                  <div key={user.id} className="user-item">
                    <div className="user-avatar">
                      <FiUsers />
                    </div>
                    <div className="user-info">
                      <h3>{user.username}</h3>
                      <p className="user-activity">
                        {user.sessionsToday || 0} sessions today
                      </p>
                    </div>
                    <div className="user-stats">
                      <div className="watch-time">
                        <FiClock />
                        {user.totalWatchTime || 0}m watched
                      </div>
                      <div className="last-active">
                        Last: {formatDate(user.lastActive)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <FiUsers className="empty-icon" />
                <p>No active users data available</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="dashboard-actions">
        <div className="dashboard-card">
          <div className="card-header">
            <h2>Quick Actions</h2>
            <p>Common administrative tasks</p>
          </div>
          <div className="card-body">
            <div className="actions-grid">
              <button className="action-btn" onClick={() => navigate('/users')}>
                <FiUsers />
                <span>Manage Users</span>
              </button>
              <button className="action-btn" onClick={() => navigate('/content')}>
                <FiPlay />
                <span>Add Content</span>
              </button>
              <button className="action-btn" onClick={() => navigate('/analytics')}>
                <FiTrendingUp />
                <span>View Analytics</span>
              </button>
              <button className="action-btn" onClick={() => navigate('/settings')}>
                <FiActivity />
                <span>Settings</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
