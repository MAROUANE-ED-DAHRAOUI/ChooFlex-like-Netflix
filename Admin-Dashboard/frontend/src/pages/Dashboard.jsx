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
