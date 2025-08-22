import React, { useState, useEffect } from 'react';
import { FiTrendingUp, FiUsers, FiPlay, FiEye, FiCalendar } from 'react-icons/fi';
import { analyticsAPI } from '../services/api';
import StatsCard from '../components/StatsCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { formatNumber } from '../utils/helpers';
import './Analytics.scss';

const Analytics = () => {
  const [stats, setStats] = useState(null);
  const [viewStats, setViewStats] = useState([]);
  const [userStats, setUserStats] = useState([]);
  const [topContent, setTopContent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('7days');

  useEffect(() => {
    fetchAnalytics();
  }, [timeRange]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      
      // For demo purposes, use mock data since backend APIs don't exist yet
      setStats({
        totalViews: 125430,
        totalUsers: 2847,
        totalContent: 1250,
        avgSessionTime: 45,
        dailyActiveUsers: 1230,
        monthlyGrowth: 15.2
      });

      setViewStats([
        { date: '2024-01-15', views: 1200, users: 450 },
        { date: '2024-01-16', views: 1350, users: 520 },
        { date: '2024-01-17', views: 1100, users: 410 },
        { date: '2024-01-18', views: 1480, users: 580 },
        { date: '2024-01-19', views: 1620, users: 640 },
        { date: '2024-01-20', views: 1750, users: 720 },
        { date: '2024-01-21', views: 1580, users: 630 }
      ]);

      setTopContent([
        { id: 1, title: 'Inception', type: 'movie', views: 15420, rating: 8.8 },
        { id: 2, title: 'Breaking Bad', type: 'series', views: 28930, rating: 9.5 },
        { id: 3, title: 'The Dark Knight', type: 'movie', views: 21870, rating: 9.0 },
        { id: 4, title: 'Stranger Things', type: 'series', views: 19650, rating: 8.7 },
        { id: 5, title: 'Pulp Fiction', type: 'movie', views: 17890, rating: 8.9 },
        { id: 6, title: 'Game of Thrones', type: 'series', views: 24500, rating: 8.5 },
        { id: 7, title: 'The Godfather', type: 'movie', views: 16750, rating: 9.2 },
        { id: 8, title: 'Friends', type: 'series', views: 22100, rating: 8.9 },
        { id: 9, title: 'The Matrix', type: 'movie', views: 18650, rating: 8.7 },
        { id: 10, title: 'The Office', type: 'series', views: 20400, rating: 8.8 }
      ]);

    } catch (error) {
      console.error('Analytics fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner fullScreen text="Loading analytics..." />;
  }

  return (
    <div className="analytics">
      <div className="page-header">
        <div className="header-left">
          <h1>Analytics & Reports</h1>
          <p>Platform usage insights and performance metrics</p>
        </div>
        <div className="header-right">
          <select 
            value={timeRange} 
            onChange={(e) => setTimeRange(e.target.value)}
            className="time-range-select"
          >
            <option value="7days">Last 7 Days</option>
            <option value="30days">Last 30 Days</option>
            <option value="90days">Last 90 Days</option>
            <option value="1year">Last Year</option>
          </select>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="metrics-grid">
        <StatsCard
          title="Total Views"
          value={formatNumber(stats?.totalViews || 0)}
          icon={<FiEye />}
          trend={{
            value: '+12.5%',
            label: 'vs last period',
            type: 'positive'
          }}
          color="primary"
        />
        
        <StatsCard
          title="Active Users"
          value={formatNumber(stats?.dailyActiveUsers || 0)}
          icon={<FiUsers />}
          trend={{
            value: '+8.3%',
            label: 'vs last period',
            type: 'positive'
          }}
          color="success"
        />
        
        <StatsCard
          title="Avg Session Time"
          value={`${stats?.avgSessionTime || 0}m`}
          icon={<FiTrendingUp />}
          trend={{
            value: '+5.2%',
            label: 'vs last period',
            type: 'positive'
          }}
          color="info"
        />
        
        <StatsCard
          title="Content Items"
          value={formatNumber(stats?.totalContent || 0)}
          icon={<FiPlay />}
          trend={{
            value: '+25',
            label: 'new this month',
            type: 'positive'
          }}
          color="warning"
        />
      </div>

      {/* Charts Section */}
      <div className="charts-section">
        <div className="chart-card">
          <div className="card-header">
            <h2>Views & Users Over Time</h2>
            <p>Daily activity trends</p>
          </div>
          <div className="card-body">
            <div className="simple-chart">
              {viewStats.map((stat, index) => (
                <div key={index} className="chart-bar">
                  <div 
                    className="bar views" 
                    style={{ height: `${(stat.views / 2000) * 100}%` }}
                    title={`${stat.views} views`}
                  ></div>
                  <div 
                    className="bar users" 
                    style={{ height: `${(stat.users / 800) * 100}%` }}
                    title={`${stat.users} users`}
                  ></div>
                  <div className="bar-label">
                    {new Date(stat.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </div>
                </div>
              ))}
            </div>
            <div className="chart-legend">
              <div className="legend-item">
                <div className="legend-color views"></div>
                <span>Views</span>
              </div>
              <div className="legend-item">
                <div className="legend-color users"></div>
                <span>Active Users</span>
              </div>
            </div>
          </div>
        </div>

        <div className="chart-card">
          <div className="card-header">
            <h2>Top Performing Content</h2>
            <p>Most viewed content in selected period</p>
          </div>
          <div className="card-body">
            <div className="top-content-list">
              {topContent.map((item, index) => (
                <div key={item.id} className="content-rank-item">
                  <div className="rank">#{index + 1}</div>
                  <div className="content-info">
                    <div className="title">{item.title}</div>
                    <div className="meta">
                      <span className={`type ${item.type}`}>{item.type}</span>
                      <span className="rating">⭐ {item.rating}</span>
                    </div>
                  </div>
                  <div className="views">
                    <FiEye />
                    {formatNumber(item.views)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Additional Insights */}
      <div className="insights-section">
        <div className="insight-card">
          <div className="card-header">
            <h2>Platform Insights</h2>
          </div>
          <div className="card-body">
            <div className="insights-grid">
              <div className="insight-item">
                <h3>Peak Hours</h3>
                <p>8 PM - 11 PM</p>
                <span className="insight-detail">Most active viewing time</span>
              </div>
              <div className="insight-item">
                <h3>Popular Genre</h3>
                <p>Drama</p>
                <span className="insight-detail">35% of total views</span>
              </div>
              <div className="insight-item">
                <h3>User Retention</h3>
                <p>78%</p>
                <span className="insight-detail">7-day retention rate</span>
              </div>
              <div className="insight-item">
                <h3>Avg Rating</h3>
                <p>8.4/10</p>
                <span className="insight-detail">Content quality score</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
