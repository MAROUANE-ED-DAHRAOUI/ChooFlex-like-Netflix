import React, { useState, useEffect } from 'react';
import { FaUsers, FaEye, FaPlay, FaHeart } from 'react-icons/fa';
import './Analytics.scss';

const Analytics = () => {
  const [analytics, setAnalytics] = useState({
    totalUsers: 2847,
    totalViews: 45620,
    totalWatchTime: 8934,
    totalLikes: 1247,
    userGrowth: '+12.5%',
    viewsGrowth: '+8.3%',
    watchTimeGrowth: '+15.2%',
    likesGrowth: '+22.1%'
  });

  const [userActivity] = useState([
    { day: 'Mon', users: 420 },
    { day: 'Tue', users: 380 },
    { day: 'Wed', users: 510 },
    { day: 'Thu', users: 390 },
    { day: 'Fri', users: 640 },
    { day: 'Sat', users: 720 },
    { day: 'Sun', users: 680 }
  ]);

  const [genreStats] = useState([
    { genre: 'Action', percentage: 35, color: '#e50914' },
    { genre: 'Drama', percentage: 28, color: '#221f1f' },
    { genre: 'Comedy', percentage: 22, color: '#564d4d' },
    { genre: 'Sci-Fi', percentage: 15, color: '#831010' }
  ]);

  return (
    <div className="analytics">
      <div className="page-header">
        <h1>Analytics & Reports</h1>
        <p>Platform usage insights and performance metrics</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon users">
            <FaUsers />
          </div>
          <div className="stat-content">
            <h3>{analytics.totalUsers.toLocaleString()}</h3>
            <p>Total Users</p>
            <span className="growth positive">{analytics.userGrowth}</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon views">
            <FaEye />
          </div>
          <div className="stat-content">
            <h3>{analytics.totalViews.toLocaleString()}</h3>
            <p>Total Views</p>
            <span className="growth positive">{analytics.viewsGrowth}</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon watch">
            <FaPlay />
          </div>
          <div className="stat-content">
            <h3>{analytics.totalWatchTime.toLocaleString()}h</h3>
            <p>Watch Time</p>
            <span className="growth positive">{analytics.watchTimeGrowth}</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon likes">
            <FaHeart />
          </div>
          <div className="stat-content">
            <h3>{analytics.totalLikes.toLocaleString()}</h3>
            <p>Total Likes</p>
            <span className="growth positive">{analytics.likesGrowth}</span>
          </div>
        </div>
      </div>

      <div className="charts-section">
        <div className="chart-card">
          <h3>Daily User Activity</h3>
          <div className="activity-chart">
            {userActivity.map((day, index) => (
              <div key={index} className="activity-bar">
                <div 
                  className="bar" 
                  style={{ height: `${(day.users / 720) * 100}%` }}
                ></div>
                <span>{day.day}</span>
                <span className="value">{day.users}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="chart-card">
          <h3>Genre Preferences</h3>
          <div className="genre-chart">
            {genreStats.map((genre, index) => (
              <div key={index} className="genre-item">
                <div className="genre-info">
                  <span className="genre-name">{genre.genre}</span>
                  <span className="genre-percentage">{genre.percentage}%</span>
                </div>
                <div className="genre-bar">
                  <div 
                    className="genre-progress" 
                    style={{ 
                      width: `${genre.percentage}%`,
                      backgroundColor: genre.color 
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
