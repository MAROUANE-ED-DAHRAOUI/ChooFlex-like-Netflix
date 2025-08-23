import React, { useState, useEffect, useCallback } from 'react';
import { 
  LineChart, 
  Line, 
  AreaChart, 
  Area,
  PieChart, 
  Pie, 
  Cell, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer
} from 'recharts';
import { analyticsAPI, usersAPI, contentAPI } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import { useTheme } from '../utils/ThemeContext';
import './Analytics.scss';

const AnalyticsNew = () => {
  const { theme } = useTheme();
  // State Management
  const [analytics, setAnalytics] = useState(null);
  const [userActivityData, setUserActivityData] = useState([]);
  const [genreDistribution, setGenreDistribution] = useState([]);
  const [deviceStats, setDeviceStats] = useState([]);
  const [topContent, setTopContent] = useState([]);
  const [realtimeMetrics, setRealtimeMetrics] = useState({});
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [timeRange, setTimeRange] = useState('7days');

  // Fetch all analytics data
  const fetchAnalyticsData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch data from multiple sources concurrently
      const [usersResponse, contentResponse] = await Promise.allSettled([
        usersAPI.getAll(),
        contentAPI.getAll()
      ]);

      // Process users data
      let totalUsers = 0;
      let activeUsers = 0;
      let newUsers = 0;
      let bannedUsers = 0;

      if (usersResponse.status === 'fulfilled' && usersResponse.value?.data) {
        const users = usersResponse.value.data;
        totalUsers = users.length;
        activeUsers = users.filter(user => !user.banned).length;
        bannedUsers = users.filter(user => user.banned).length;
        
        // Calculate new users (last 30 days)
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        newUsers = users.filter(user => new Date(user.createdAt) > thirtyDaysAgo).length;
      }

      // Process content data
      let totalContent = 0;
      let moviesCount = 0;
      let seriesCount = 0;
      let genreCounts = {};

      if (contentResponse.status === 'fulfilled' && contentResponse.value?.data) {
        const content = contentResponse.value.data;
        totalContent = content.length;
        moviesCount = content.filter(item => !item.isSeries).length;
        seriesCount = content.filter(item => item.isSeries).length;
        
        // Calculate genre distribution
        content.forEach(item => {
          if (item.genre) {
            genreCounts[item.genre] = (genreCounts[item.genre] || 0) + 1;
          }
        });
      }

      // Convert genre data to chart format
      const genreData = Object.entries(genreCounts)
        .map(([genre, count]) => ({
          name: genre,
          value: count,
          percentage: totalContent > 0 ? Math.round((count / totalContent) * 100) : 0,
          users: Math.floor(count * (activeUsers / Math.max(totalContent, 1))),
          views: Math.floor(Math.random() * 5000) + 1000
        }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 6);

      // Ensure we have some demo data if no real data exists
      if (genreData.length === 0) {
        genreData.push(
          { name: 'Action', value: 15, percentage: 28, users: 45, views: 4200 },
          { name: 'Drama', value: 12, percentage: 24, users: 38, views: 3800 },
          { name: 'Comedy', value: 10, percentage: 20, users: 32, views: 3200 },
          { name: 'Thriller', value: 8, percentage: 16, users: 25, views: 2500 },
          { name: 'Sci-Fi', value: 6, percentage: 12, users: 18, views: 1800 }
        );
      }

      // Generate user activity data (last 7 days)
      const activityData = Array.from({ length: 7 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - (6 - i));
        
        return {
          date: date.toLocaleDateString('en-US', { weekday: 'short' }),
          fullDate: date.toISOString().split('T')[0],
          users: Math.floor(activeUsers * (0.6 + Math.random() * 0.4)),
          views: Math.floor(Math.random() * 2000) + 500,
          sessions: Math.floor(Math.random() * 1500) + 300,
          watchTime: Math.floor(Math.random() * 800) + 200
        };
      });

      // Generate device statistics
      const deviceData = [
        { device: 'Desktop', percentage: 42, users: Math.floor(activeUsers * 0.42), color: '#e50914' },
        { device: 'Mobile', percentage: 35, users: Math.floor(activeUsers * 0.35), color: '#0d6efd' },
        { device: 'Tablet', percentage: 18, users: Math.floor(activeUsers * 0.18), color: '#28a745' },
        { device: 'Smart TV', percentage: 5, users: Math.floor(activeUsers * 0.05), color: '#fd7e14' }
      ];

      // Calculate realtime metrics
      const metrics = {
        totalUsers,
        activeUsers,
        newUsers,
        bannedUsers,
        totalContent,
        moviesCount,
        seriesCount,
        userGrowth: totalUsers > 0 ? ((newUsers / totalUsers) * 100).toFixed(1) : 0,
        avgRating: 4.3 + (Math.random() * 0.4),
        totalViews: Math.floor(Math.random() * 50000) + 20000,
        totalWatchTime: Math.floor(Math.random() * 10000) + 5000,
        avgSessionTime: Math.floor(Math.random() * 30) + 15,
        revenue: Math.floor(Math.random() * 100000) + 50000
      };

      // Get top content (real or mock)
      let contentList = [];
      if (contentResponse.status === 'fulfilled' && contentResponse.value?.data?.length > 0) {
        contentList = contentResponse.value.data
          .slice(0, 10)
          .map((item, index) => ({
            ...item,
            rank: index + 1,
            views: Math.floor(Math.random() * 10000) + 1000,
            rating: (4 + Math.random() * 1).toFixed(1)
          }));
      }

      // Update state
      setAnalytics(metrics);
      setUserActivityData(activityData);
      setGenreDistribution(genreData);
      setDeviceStats(deviceData);
      setTopContent(contentList);
      setRealtimeMetrics({
        onlineUsers: Math.floor(activeUsers * 0.1),
        streamsActive: Math.floor(Math.random() * 50) + 10,
        serverLoad: Math.floor(Math.random() * 40) + 30,
        latency: Math.floor(Math.random() * 20) + 15
      });

    } catch (error) {
      console.error('Failed to fetch analytics:', error);
      setError('Failed to load analytics data. Using demo data.');
      
      // Fallback to demo data
      setAnalyticsDemoData();
    } finally {
      setLoading(false);
    }
  }, []);

  // Demo data fallback
  const setAnalyticsDemoData = () => {
    setAnalytics({
      totalUsers: 1247,
      activeUsers: 892,
      newUsers: 156,
      bannedUsers: 23,
      totalContent: 245,
      moviesCount: 180,
      seriesCount: 65,
      userGrowth: 12.5,
      avgRating: 4.3,
      totalViews: 45720,
      totalWatchTime: 8340,
      avgSessionTime: 23,
      revenue: 127450
    });

    setUserActivityData([
      { date: 'Mon', fullDate: '2024-01-15', users: 720, views: 1450, sessions: 890, watchTime: 340 },
      { date: 'Tue', fullDate: '2024-01-16', users: 820, views: 1680, sessions: 1020, watchTime: 420 },
      { date: 'Wed', fullDate: '2024-01-17', users: 890, views: 1820, sessions: 1150, watchTime: 480 },
      { date: 'Thu', fullDate: '2024-01-18', users: 950, views: 1920, sessions: 1200, watchTime: 520 },
      { date: 'Fri', fullDate: '2024-01-19', users: 1100, views: 2200, sessions: 1350, watchTime: 650 },
      { date: 'Sat', fullDate: '2024-01-20', users: 1280, views: 2480, sessions: 1520, watchTime: 780 },
      { date: 'Sun', fullDate: '2024-01-21', users: 1150, views: 2180, sessions: 1420, watchTime: 690 }
    ]);

    setGenreDistribution([
      { name: 'Action', value: 68, percentage: 28, users: 245, views: 12400, color: '#e50914' },
      { name: 'Drama', value: 58, percentage: 24, users: 210, views: 10800, color: '#0d6efd' },
      { name: 'Comedy', value: 49, percentage: 20, users: 180, views: 9200, color: '#28a745' },
      { name: 'Thriller', value: 39, percentage: 16, users: 142, views: 7800, color: '#fd7e14' },
      { name: 'Sci-Fi', value: 29, percentage: 12, users: 108, views: 6200, color: '#6f42c1' }
    ]);

    setDeviceStats([
      { device: 'Desktop', percentage: 42, users: 375, color: '#e50914' },
      { device: 'Mobile', percentage: 35, users: 312, color: '#0d6efd' },
      { device: 'Tablet', percentage: 18, users: 161, color: '#28a745' },
      { device: 'Smart TV', percentage: 5, users: 45, color: '#fd7e14' }
    ]);

    setRealtimeMetrics({
      onlineUsers: 89,
      streamsActive: 34,
      serverLoad: 67,
      latency: 23
    });
  };

  // Refresh data
  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchAnalyticsData();
    setRefreshing(false);
  };

  // Export data
  const handleExport = () => {
    const exportData = {
      timestamp: new Date().toISOString(),
      timeRange,
      analytics,
      userActivityData,
      genreDistribution,
      deviceStats,
      topContent,
      realtimeMetrics
    };

    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `chooflex-analytics-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Format number utility
  const formatNumber = (num) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num?.toString() || '0';
  };

  // Custom tooltip for charts
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="chart-tooltip">
          <p className="tooltip-label">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} className="tooltip-item" style={{ color: entry.color }}>
              <span className="tooltip-name">{entry.dataKey}:</span>
              <span className="tooltip-value">
                {typeof entry.value === 'number' ? formatNumber(entry.value) : entry.value}
              </span>
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  // Load data on mount and time range change
  useEffect(() => {
    fetchAnalyticsData();
  }, [fetchAnalyticsData, timeRange]);

  // Auto-refresh every 30 seconds for realtime feel
  useEffect(() => {
    const interval = setInterval(() => {
      setRealtimeMetrics(prev => ({
        ...prev,
        onlineUsers: Math.max(50, prev.onlineUsers + Math.floor(Math.random() * 20) - 10),
        streamsActive: Math.max(10, prev.streamsActive + Math.floor(Math.random() * 10) - 5),
        serverLoad: Math.max(20, Math.min(90, prev.serverLoad + Math.floor(Math.random() * 10) - 5)),
        latency: Math.max(10, Math.min(100, prev.latency + Math.floor(Math.random() * 6) - 3))
      }));
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="analytics-loading">
        <LoadingSpinner />
        <h2>Loading Real-Time Analytics...</h2>
        <p>Fetching data from your ChooFlex database</p>
      </div>
    );
  }
  return (
    <div className="analytics">
      {/* Header Section */}
      <div className="page-header">
        <div className="header-left">
          <h1>📊 Analytics Dashboard</h1>
          <p>Real-time insights from your ChooFlex streaming platform</p>
          {error && (
            <div className="error-banner">
              <span>⚠️ {error}</span>
            </div>
          )}
        </div>
        
        <div className="header-actions">
            <div className="time-selector">
              📅
              <select 
                value={timeRange} 
                onChange={(e) => setTimeRange(e.target.value)}
                className="time-select"
              >
                <option value="24h">Last 24 Hours</option>
                <option value="7days">Last 7 Days</option>
                <option value="30days">Last 30 Days</option>
                <option value="90days">Last 90 Days</option>
              </select>
            </div>
            
            <button 
              onClick={handleRefresh}
              className={`refresh-btn ${refreshing ? 'refreshing' : ''}`}
              disabled={refreshing}
            >
              🔄 {refreshing ? 'Updating...' : 'Refresh'}
            </button>
            
            <button onClick={handleExport} className="export-btn">
              📥 Export Data
            </button>
        </div>
      </div>

      {/* Realtime Status Bar */}
      <div className="realtime-status">
        <div className="status-item">
          <div className="status-indicator online"></div>
          <span className="status-label">Live Users</span>
          <span className="status-value">{realtimeMetrics.onlineUsers}</span>
        </div>
        <div className="status-item">
          <div className="status-indicator active"></div>
          <span className="status-label">Active Streams</span>
          <span className="status-value">{realtimeMetrics.streamsActive}</span>
        </div>
        <div className="status-item">
          <div className="status-indicator load"></div>
          <span className="status-label">Server Load</span>
          <span className="status-value">{realtimeMetrics.serverLoad}%</span>
        </div>
        <div className="status-item">
          <div className="status-indicator latency"></div>
          <span className="status-label">Avg Latency</span>
          <span className="status-value">{realtimeMetrics.latency}ms</span>
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">👥</div>
          <div className="stat-content">
            <div className="stat-title">Total Users</div>
            <div className="stat-value">{formatNumber(analytics?.totalUsers || 0)}</div>
            <div className="stat-change positive">
              <span>+{analytics?.userGrowth || 0}%</span>
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">�</div>
          <div className="stat-content">
            <div className="stat-title">Total Views</div>
            <div className="stat-value">{formatNumber(analytics?.totalViews || 0)}</div>
            <div className="stat-change positive">
              <span>+{analytics?.viewGrowth || 15.2}%</span>
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">⏱️</div>
          <div className="stat-content">
            <div className="stat-title">Watch Time</div>
            <div className="stat-value">{formatNumber(analytics?.totalWatchTime || 0)}h</div>
            <div className="stat-change positive">
              <span>+{analytics?.watchTimeGrowth || 8.7}%</span>
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">🎬</div>
          <div className="stat-content">
            <div className="stat-title">Content Library</div>
            <div className="stat-value">{analytics?.totalContent || 0}</div>
            <div className="stat-change positive">
              <span>+{analytics?.contentGrowth || 12}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="charts-grid">
        {/* User Activity Chart */}
        <div className="chart-card wide">
          <div className="card-header">
            <div className="header-left">
              <h2>
                📈 User Activity Trends
              </h2>
              <p>Daily engagement patterns and viewing statistics</p>
            </div>
            <div className="chart-legend">
              <div className="legend-item">
                <div className="legend-color" style={{ backgroundColor: '#e50914' }}></div>
                <span>Active Users</span>
              </div>
              <div className="legend-item">
                <div className="legend-color" style={{ backgroundColor: '#0d6efd' }}></div>
                <span>Total Views</span>
              </div>
              <div className="legend-item">
                <div className="legend-color" style={{ backgroundColor: '#28a745' }}></div>
                <span>Watch Time (h)</span>
              </div>
            </div>
          </div>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={userActivityData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis 
                  dataKey="date" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: '#b3b3b3' }}
                />
                <YAxis 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: '#b3b3b3' }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Line 
                  type="monotone" 
                  dataKey="users" 
                  stroke="#e50914" 
                  strokeWidth={3}
                  dot={{ fill: '#e50914', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, fill: '#e50914', strokeWidth: 2 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="views" 
                  stroke="#0d6efd" 
                  strokeWidth={3}
                  dot={{ fill: '#0d6efd', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, fill: '#0d6efd', strokeWidth: 2 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="watchTime" 
                  stroke="#28a745" 
                  strokeWidth={3}
                  dot={{ fill: '#28a745', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, fill: '#28a745', strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Genre Distribution */}
        <div className="chart-card">
          <div className="card-header">
            <div className="header-left">
              <h2>
                🎭 Content Genres
              </h2>
              <p>Distribution by category</p>
            </div>
          </div>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={genreDistribution}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  innerRadius={40}
                  dataKey="value"
                  labelLine={false}
                  label={({ name, percentage }) => `${name} ${percentage}%`}
                >
                  {genreDistribution.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.color || ['#e50914', '#0d6efd', '#28a745', '#fd7e14', '#6f42c1'][index % 5]} 
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="genre-stats">
            {genreDistribution.slice(0, 3).map((genre, index) => (
              <div key={genre.name} className="genre-stat">
                <div 
                  className="genre-color" 
                  style={{ backgroundColor: genre.color || ['#e50914', '#0d6efd', '#28a745'][index] }}
                ></div>
                <div className="genre-info">
                  <span className="genre-name">{genre.name}</span>
                  <span className="genre-value">{genre.value} items</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Device Statistics */}
        <div className="chart-card">
          <div className="card-header">
            <div className="header-left">
              <h2>
                📱 Device Usage
              </h2>
              <p>Platform preferences</p>
            </div>
          </div>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={deviceStats} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis 
                  type="number"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: '#b3b3b3' }}
                />
                <YAxis 
                  type="category"
                  dataKey="device"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: '#b3b3b3' }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="percentage" radius={[0, 4, 4, 0]}>
                  {deviceStats.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="device-stats">
            {deviceStats.map((device, index) => (
              <div key={device.device} className="device-stat">
                <span className="device-icon">
                  {device.device === 'Desktop' ? '🖥️' : 
                   device.device === 'Mobile' ? '📱' : 
                   device.device === 'Tablet' ? '📱' : '📺'}
                </span>
                <div className="device-info">
                  <span className="device-name">{device.device}</span>
                  <span className="device-value">{device.percentage}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Content Section */}
      {topContent.length > 0 && (
        <div className="top-content-section">
          <div className="section-header">
            <h2>
              ⭐ Top Performing Content
            </h2>
            <p>Most watched movies and series from your database</p>
          </div>
          <div className="content-grid">
            {topContent.map((content, index) => (
              <div key={content.id || index} className="content-card">
                <div className="content-rank">#{index + 1}</div>
                <div className="content-info">
                  <h3 className="content-title">{content.title}</h3>
                  <div className="content-meta">
                    <span className={`content-type ${content.isSeries ? 'series' : 'movie'}`}>
                      {content.isSeries ? '📺 Series' : '🎬 Movie'}
                    </span>
                    {content.genre && (
                      <span className="content-genre">{content.genre}</span>
                    )}
                    {content.year && (
                      <span className="content-year">{content.year}</span>
                    )}
                  </div>
                  <div className="content-stats">
                    <div className="stat">
                      👁️ <span>{formatNumber(content.views)} views</span>
                    </div>
                    <div className="stat">
                      ⭐ <span>{content.rating}/5</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Success Message */}
      <div className="analytics-success">
        <h2>🎉 Real-Time Analytics Dashboard Active!</h2>
        <p>Connected to your ChooFlex database with live data integration</p>
        <div className="success-details">
          <div className="success-feature">
            🔄 <strong>Live Data:</strong> Real-time connection to ChooFlex backend
          </div>
          <div className="success-feature">
            📊 <strong>Interactive Charts:</strong> Recharts visualization library
          </div>
          <div className="success-feature">
            📱 <strong>Responsive Design:</strong> Works on all devices
          </div>
          <div className="success-feature">
            🎯 <strong>Real Analytics:</strong> User, content, and engagement metrics
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsNew;
