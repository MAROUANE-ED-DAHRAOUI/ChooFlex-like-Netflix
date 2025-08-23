import React, { useState, useEffect } from 'react';
import { FiSearch, FiEdit, FiTrash, FiUserX, FiUserCheck, FiUsers, FiRefreshCw, FiFilter, FiDownload, FiPlus, FiEye } from 'react-icons/fi';
import { usersAPI } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import Modal from '../components/Modal';
import './UserManagement.scss';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [refreshing, setRefreshing] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [actionLoading, setActionLoading] = useState({});

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await usersAPI.getAll();
      
      // Transform the data to include necessary fields for display
      const transformedUsers = response.data.map(user => ({
        ...user,
        id: user._id || user.id,
        status: user.banned ? 'banned' : 'active',
        totalWatchTime: Math.floor(Math.random() * 200) + 10, // Mock watch time for now
        favoritesCount: Math.floor(Math.random() * 50) + 1, // Mock favorites count
        lastActive: user.updatedAt || user.createdAt,
        joinDate: user.createdAt
      }));
      
      setUsers(transformedUsers);
      console.log(`Loaded ${transformedUsers.length} real users from database`);
    } catch (error) {
      console.error('Error fetching users:', error);
      setError('Failed to load users from database. Please check your connection.');
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchUsers();
    setRefreshing(false);
  };

  const handleUserAction = async (userId, action) => {
    try {
      setActionLoading(prev => ({ ...prev, [userId]: action }));
      
      let response;
      switch (action) {
        case 'ban':
          response = await usersAPI.ban(userId);
          break;
        case 'unban':
          response = await usersAPI.unban(userId);
          break;
        case 'delete':
          if (!window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
            return;
          }
          response = await usersAPI.delete(userId);
          break;
        default:
          throw new Error('Unknown action');
      }
      
      // Refresh users list after successful action
      await fetchUsers();
      
      console.log(`User ${action} successful:`, response.data);
    } catch (error) {
      console.error(`Error ${action} user:`, error);
      setError(`Failed to ${action} user. Please try again.`);
    } finally {
      setActionLoading(prev => ({ ...prev, [userId]: null }));
    }
  };

  const handleViewUser = (user) => {
    setSelectedUser(user);
    setShowUserModal(true);
  };

  const exportUsers = () => {
    const exportData = users.map(user => ({
      username: user.username,
      email: user.email,
      status: user.status,
      joinDate: user.joinDate,
      lastActive: user.lastActive,
      totalWatchTime: user.totalWatchTime,
      favoritesCount: user.favoritesCount
    }));
    
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportData, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", `users-${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  // Filter and sort users
  const filteredUsers = users
    .filter(user => {
      const matchesSearch = user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          user.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.joinDate) - new Date(a.joinDate);
        case 'oldest':
          return new Date(a.joinDate) - new Date(b.joinDate);
        case 'username':
          return a.username.localeCompare(b.username);
        case 'email':
          return a.email.localeCompare(b.email);
        case 'watchtime':
          return b.totalWatchTime - a.totalWatchTime;
        default:
          return 0;
      }
    });

  // Calculate statistics from real data
  const totalUsers = users.length;
  const activeUsers = users.filter(user => user.status === 'active').length;
  const bannedUsers = users.filter(user => user.status === 'banned').length;
  const newUsersThisMonth = users.filter(user => {
    const userDate = new Date(user.joinDate);
    const now = new Date();
    const monthAgo = new Date(now.getFullYear(), now.getMonth(), 1);
    return userDate >= monthAgo;
  }).length;

  if (loading) {
    return (
      <div className="user-management">
        <LoadingSpinner text="Loading users from database..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="user-management">
        <div className="error-state">
          <h2>Users Unavailable</h2>
          <p>{error}</p>
          <button onClick={fetchUsers} className="btn retry-btn">
            <FiRefreshCw /> Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="user-management">
      <div className="page-header">
        <div className="header-left">
          <h1>Live User Management</h1>
          <p>Manage users directly from your MongoDB database</p>
        </div>
        <div className="header-right">
          <button 
            onClick={handleRefresh} 
            className={`btn refresh-btn ${refreshing ? 'loading' : ''}`}
            disabled={refreshing}
          >
            <FiRefreshCw className={refreshing ? 'spinning' : ''} />
            {refreshing ? 'Refreshing...' : 'Refresh'}
          </button>
          <button onClick={exportUsers} className="btn export-btn">
            <FiDownload /> Export
          </button>
        </div>
      </div>

      {/* Real Database Statistics */}
      <div className="user-stats">
        <div className="stat-card total">
          <FiUsers className="stat-icon" />
          <div className="stat-value">{totalUsers}</div>
          <div className="stat-label">Total Users</div>
          <div className="stat-trend">Real database count</div>
        </div>
        <div className="stat-card active">
          <FiUserCheck className="stat-icon" />
          <div className="stat-value">{activeUsers}</div>
          <div className="stat-label">Active Users</div>
          <div className="stat-trend">{totalUsers > 0 ? Math.round((activeUsers/totalUsers)*100) : 0}% of total</div>
        </div>
        <div className="stat-card banned">
          <FiUserX className="stat-icon" />
          <div className="stat-value">{bannedUsers}</div>
          <div className="stat-label">Banned Users</div>
          <div className="stat-trend">{totalUsers > 0 ? Math.round((bannedUsers/totalUsers)*100) : 0}% of total</div>
        </div>
        <div className="stat-card new">
          <FiPlus className="stat-icon" />
          <div className="stat-value">{newUsersThisMonth}</div>
          <div className="stat-label">New This Month</div>
          <div className="stat-trend">Recent signups</div>
        </div>
      </div>

      {/* Enhanced Filters Section */}
      <div className="filters-section">
        <div className="search-box">
          <FiSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search users by username or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          {searchTerm && (
            <button 
              onClick={() => setSearchTerm('')} 
              className="clear-search"
            >
              ×
            </button>
          )}
        </div>
        <div className="filters">
          <div className="filter-group">
            <FiFilter className="filter-icon" />
            <select 
              value={statusFilter} 
              onChange={(e) => setStatusFilter(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Status</option>
              <option value="active">Active Users</option>
              <option value="banned">Banned Users</option>
            </select>
          </div>
          <select 
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value)}
            className="filter-select"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="username">Username A-Z</option>
            <option value="email">Email A-Z</option>
            <option value="watchtime">Most Active</option>
          </select>
        </div>
        <div className="results-info">
          Showing {filteredUsers.length} of {totalUsers} users
        </div>
      </div>

      {/* Enhanced Users Table */}
      <div className="users-table-container">
        {filteredUsers.length === 0 ? (
          <div className="empty-state">
            <FiUsers className="empty-icon" />
            <h3>No users found</h3>
            <p>
              {users.length === 0 
                ? "No users in your database yet. Users will appear here when they register."
                : "Try adjusting your search criteria or filters."
              }
            </p>
          </div>
        ) : (
          <table className="users-table">
            <thead>
              <tr>
                <th>User Info</th>
                <th>Email</th>
                <th>Status</th>
                <th>Join Date</th>
                <th>Activity</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map(user => (
                <tr key={user.id} className={user.status === 'banned' ? 'banned-user' : ''}>
                  <td>
                    <div className="user-info">
                      <div className="user-avatar">
                        {user.profilePicture ? (
                          <img src={user.profilePicture} alt={user.username} />
                        ) : (
                          <div className="avatar-placeholder">
                            {user.username.charAt(0).toUpperCase()}
                          </div>
                        )}
                      </div>
                      <div className="user-details">
                        <div className="username">{user.username}</div>
                        <div className="user-id">ID: {user.id}</div>
                        {user.isAdmin && <div className="admin-badge">Admin</div>}
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="email-cell">
                      {user.email}
                    </div>
                  </td>
                  <td>
                    <span className={`status-badge ${user.status}`}>
                      {user.status === 'active' ? (
                        <>
                          <FiUserCheck className="status-icon" />
                          Active
                        </>
                      ) : (
                        <>
                          <FiUserX className="status-icon" />
                          Banned
                        </>
                      )}
                    </span>
                  </td>
                  <td>
                    <div className="date-cell">
                      <div className="date">
                        {new Date(user.joinDate).toLocaleDateString()}
                      </div>
                      <div className="time">
                        {new Date(user.joinDate).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="activity-cell">
                      <div className="activity-metric">
                        <FiEye className="metric-icon" />
                        {user.totalWatchTime}h
                      </div>
                      <div className="activity-metric">
                        <FiUsers className="metric-icon" />
                        {user.favoritesCount} favs
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="actions">
                      <button 
                        className="action-btn view" 
                        title="View User Details"
                        onClick={() => handleViewUser(user)}
                      >
                        <FiEye />
                      </button>
                      
                      <button 
                        className="action-btn edit" 
                        title="Edit User"
                        disabled={actionLoading[user.id]}
                      >
                        <FiEdit />
                      </button>
                      
                      {user.status === 'active' ? (
                        <button 
                          className={`action-btn ban ${actionLoading[user.id] === 'ban' ? 'loading' : ''}`}
                          title="Ban User"
                          onClick={() => handleUserAction(user.id, 'ban')}
                          disabled={actionLoading[user.id]}
                        >
                          {actionLoading[user.id] === 'ban' ? <FiRefreshCw className="spinning" /> : <FiUserX />}
                        </button>
                      ) : (
                        <button 
                          className={`action-btn unban ${actionLoading[user.id] === 'unban' ? 'loading' : ''}`}
                          title="Unban User"
                          onClick={() => handleUserAction(user.id, 'unban')}
                          disabled={actionLoading[user.id]}
                        >
                          {actionLoading[user.id] === 'unban' ? <FiRefreshCw className="spinning" /> : <FiUserCheck />}
                        </button>
                      )}
                      
                      <button 
                        className={`action-btn delete ${actionLoading[user.id] === 'delete' ? 'loading' : ''}`}
                        title="Delete User"
                        onClick={() => handleUserAction(user.id, 'delete')}
                        disabled={actionLoading[user.id]}
                      >
                        {actionLoading[user.id] === 'delete' ? <FiRefreshCw className="spinning" /> : <FiTrash />}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* User Details Modal */}
      {showUserModal && selectedUser && (
        <Modal
          title="User Details"
          isOpen={showUserModal}
          onClose={() => {
            setShowUserModal(false);
            setSelectedUser(null);
          }}
        >
          <div className="user-details-modal">
            <div className="user-profile">
              <div className="profile-header">
                {selectedUser.profilePicture ? (
                  <img src={selectedUser.profilePicture} alt={selectedUser.username} className="profile-picture" />
                ) : (
                  <div className="profile-placeholder">
                    {selectedUser.username.charAt(0).toUpperCase()}
                  </div>
                )}
                <div className="profile-info">
                  <h3>{selectedUser.username}</h3>
                  <p>{selectedUser.email}</p>
                  <span className={`status-badge ${selectedUser.status}`}>
                    {selectedUser.status}
                  </span>
                </div>
              </div>
              
              <div className="profile-details">
                <div className="detail-row">
                  <span className="label">User ID:</span>
                  <span className="value">{selectedUser.id}</span>
                </div>
                <div className="detail-row">
                  <span className="label">Join Date:</span>
                  <span className="value">{new Date(selectedUser.joinDate).toLocaleDateString()}</span>
                </div>
                <div className="detail-row">
                  <span className="label">Last Active:</span>
                  <span className="value">{new Date(selectedUser.lastActive).toLocaleDateString()}</span>
                </div>
                <div className="detail-row">
                  <span className="label">Total Watch Time:</span>
                  <span className="value">{selectedUser.totalWatchTime} hours</span>
                </div>
                <div className="detail-row">
                  <span className="label">Favorites:</span>
                  <span className="value">{selectedUser.favoritesCount} items</span>
                </div>
                <div className="detail-row">
                  <span className="label">Admin Status:</span>
                  <span className="value">{selectedUser.isAdmin ? 'Yes' : 'No'}</span>
                </div>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default UserManagement;
