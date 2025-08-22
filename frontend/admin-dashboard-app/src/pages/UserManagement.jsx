import React, { useState, useEffect } from 'react';
import { FiSearch, FiPlus, FiEdit, FiTrash, FiUserX, FiUserCheck, FiMail } from 'react-icons/fi';
import { usersAPI } from '../services/api';
import Button from '../components/Button';
import Modal from '../components/Modal';
import LoadingSpinner from '../components/LoadingSpinner';
import { formatDateTime, debounce } from '../utils/helpers';
import { toast } from 'react-toastify';
import './UserManagement.scss';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({ status: 'all', sort: 'newest' });
  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(''); // 'edit', 'delete', 'ban'

  useEffect(() => {
    fetchUsers();
  }, [filters]);

  useEffect(() => {
    const debouncedSearch = debounce(() => {
      fetchUsers();
    }, 500);
    
    debouncedSearch();
  }, [searchTerm]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      
      // For demo purposes, use mock data since backend APIs don't exist yet
      setUsers([
        {
          id: 1,
          username: 'johndoe',
          email: 'john@example.com',
          createdAt: new Date().toISOString(),
          lastLogin: new Date().toISOString(),
          status: 'active',
          totalWatchTime: 120,
          favoritesCount: 15
        },
        {
          id: 2,
          username: 'janesmith',
          email: 'jane@example.com',
          createdAt: new Date(Date.now() - 86400000).toISOString(),
          lastLogin: new Date(Date.now() - 7200000).toISOString(),
          status: 'active',
          totalWatchTime: 85,
          favoritesCount: 8
        },
        {
          id: 3,
          username: 'banneduser',
          email: 'banned@example.com',
          createdAt: new Date(Date.now() - 172800000).toISOString(),
          lastLogin: new Date(Date.now() - 86400000).toISOString(),
          status: 'banned',
          totalWatchTime: 45,
          favoritesCount: 3
        },
        {
          id: 4,
          username: 'moviefan',
          email: 'moviefan@example.com',
          createdAt: new Date(Date.now() - 259200000).toISOString(),
          lastLogin: new Date(Date.now() - 3600000).toISOString(),
          status: 'active',
          totalWatchTime: 200,
          favoritesCount: 25
        },
        {
          id: 5,
          username: 'seriesbinger',
          email: 'binger@example.com',
          createdAt: new Date(Date.now() - 345600000).toISOString(),
          lastLogin: new Date(Date.now() - 1800000).toISOString(),
          status: 'active',
          totalWatchTime: 350,
          favoritesCount: 40
        },
        {
          id: 6,
          username: 'inactiveuser',
          email: 'inactive@example.com',
          createdAt: new Date(Date.now() - 432000000).toISOString(),
          lastLogin: new Date(Date.now() - 604800000).toISOString(),
          status: 'inactive',
          totalWatchTime: 15,
          favoritesCount: 2
        }
      ]);
      
    } catch (error) {
      console.error('Fetch users error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUserAction = async (action, user) => {
    try {
      // For demo purposes, simulate the action without API calls
      switch (action) {
        case 'ban':
          // Update local state
          setUsers(prevUsers => 
            prevUsers.map(u => 
              u.id === user.id 
                ? { ...u, status: 'banned' }
                : u
            )
          );
          toast.success(`User ${user.username} has been banned`);
          break;
        case 'unban':
          // Update local state
          setUsers(prevUsers => 
            prevUsers.map(u => 
              u.id === user.id 
                ? { ...u, status: 'active' }
                : u
            )
          );
          toast.success(`User ${user.username} has been unbanned`);
          break;
        case 'delete':
          // Remove from local state
          setUsers(prevUsers => 
            prevUsers.filter(u => u.id !== user.id)
          );
          toast.success(`User ${user.username} has been deleted`);
          break;
        case 'edit':
          toast.success(`Edit mode for ${user.username} (demo)`);
          break;
        case 'create':
          toast.success('Create user functionality (demo)');
          break;
        default:
          break;
      }
      
      setShowModal(false);
      setSelectedUser(null);
    } catch (error) {
      console.error(`${action} user error:`, error);
      toast.error('Action failed');
    }
  };

  const openModal = (type, user) => {
    setModalType(type);
    setSelectedUser(user);
    setShowModal(true);
  };

  const getStatusBadge = (status) => {
    return <span className={`status-badge ${status}`}>{status}</span>;
  };

  const filteredUsers = users.filter(user => {
    if (filters.status !== 'all' && user.status !== filters.status) {
      return false;
    }
    return true;
  });

  return (
    <div className="user-management">
      <div className="page-header">
        <div className="header-left">
          <h1>User Management</h1>
          <p>Manage and monitor all platform users</p>
        </div>
        <div className="header-right">
          <Button icon={<FiPlus />} onClick={() => openModal('create', null)}>
            Add User
          </Button>
        </div>
      </div>

      {/* Filters and Search */}
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
        </div>
        
        <div className="filters">
          <select 
            value={filters.status} 
            onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
            className="filter-select"
          >
            <option value="all">All Users</option>
            <option value="active">Active</option>
            <option value="banned">Banned</option>
            <option value="inactive">Inactive</option>
          </select>
          
          <select 
            value={filters.sort} 
            onChange={(e) => setFilters(prev => ({ ...prev, sort: e.target.value }))}
            className="filter-select"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="username">Username A-Z</option>
            <option value="lastLogin">Last Login</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      {loading ? (
        <LoadingSpinner text="Loading users..." />
      ) : (
        <div className="users-table-container">
          <table className="users-table">
            <thead>
              <tr>
                <th>User</th>
                <th>Status</th>
                <th>Joined</th>
                <th>Last Login</th>
                <th>Watch Time</th>
                <th>Favorites</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id}>
                  <td>
                    <div className="user-info">
                      <div className="user-details">
                        <div className="username">{user.username}</div>
                        <div className="email">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td>{getStatusBadge(user.status)}</td>
                  <td>{formatDateTime(user.createdAt)}</td>
                  <td>{formatDateTime(user.lastLogin)}</td>
                  <td>{user.totalWatchTime}m</td>
                  <td>{user.favoritesCount}</td>
                  <td>
                    <div className="actions">
                      <button 
                        className="action-btn edit"
                        onClick={() => openModal('edit', user)}
                        title="Edit User"
                      >
                        <FiEdit />
                      </button>
                      
                      {user.status === 'active' ? (
                        <button 
                          className="action-btn ban"
                          onClick={() => openModal('ban', user)}
                          title="Ban User"
                        >
                          <FiUserX />
                        </button>
                      ) : (
                        <button 
                          className="action-btn unban"
                          onClick={() => openModal('unban', user)}
                          title="Unban User"
                        >
                          <FiUserCheck />
                        </button>
                      )}
                      
                      <button 
                        className="action-btn delete"
                        onClick={() => openModal('delete', user)}
                        title="Delete User"
                      >
                        <FiTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {filteredUsers.length === 0 && (
            <div className="empty-state">
              <FiSearch className="empty-icon" />
              <p>No users found matching your criteria</p>
            </div>
          )}
        </div>
      )}

      {/* Modals */}
      {showModal && selectedUser && (
        <Modal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          title={`${modalType.charAt(0).toUpperCase() + modalType.slice(1)} User`}
          footer={
            <div className="modal-actions">
              <Button variant="secondary" onClick={() => setShowModal(false)}>
                Cancel
              </Button>
              <Button 
                variant={modalType === 'delete' || modalType === 'ban' ? 'danger' : 'primary'}
                onClick={() => handleUserAction(modalType, selectedUser)}
              >
                {modalType === 'ban' ? 'Ban' : modalType === 'unban' ? 'Unban' : modalType.charAt(0).toUpperCase() + modalType.slice(1)}
              </Button>
            </div>
          }
        >
          <div className="modal-content">
            {modalType === 'delete' && (
              <p>Are you sure you want to delete user <strong>{selectedUser.username}</strong>? This action cannot be undone.</p>
            )}
            {modalType === 'ban' && (
              <p>Are you sure you want to ban user <strong>{selectedUser.username}</strong>? They will no longer be able to access the platform.</p>
            )}
            {modalType === 'unban' && (
              <p>Are you sure you want to unban user <strong>{selectedUser.username}</strong>? They will regain access to the platform.</p>
            )}
            {modalType === 'edit' && (
              <div className="edit-form">
                <p>Edit functionality would be implemented here with a form for updating user details.</p>
              </div>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
};

export default UserManagement;
