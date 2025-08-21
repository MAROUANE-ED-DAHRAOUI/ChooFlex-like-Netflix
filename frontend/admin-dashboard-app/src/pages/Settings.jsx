import React, { useState, useEffect } from 'react';
import { FiUser, FiLock, FiBell, FiSave, FiEye, FiEyeOff } from 'react-icons/fi';
import { settingsAPI } from '../services/api';
import Button from '../components/Button';
import LoadingSpinner from '../components/LoadingSpinner';
import { validateEmail, validatePassword } from '../utils/helpers';
import { toast } from 'react-toastify';
import './Settings.scss';

const Settings = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  
  // Profile data
  const [profile, setProfile] = useState({
    username: '',
    email: '',
    firstName: '',
    lastName: '',
    role: 'admin'
  });
  
  // Password change
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });
  
  // Notifications settings
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    newUsers: true,
    contentUpdates: true,
    systemAlerts: true,
    weeklyReports: true
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const response = await settingsAPI.getProfile();
      setProfile(response.data.profile || {});
      setNotifications(response.data.profile?.settings?.notifications || notifications);
    } catch (error) {
      console.error('Fetch settings error:', error);
      // Set mock data for demo
      setProfile({
        username: 'admin',
        email: 'admin@chooflex.com',
        firstName: 'Admin',
        lastName: 'User',
        role: 'admin'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    
    const validationErrors = {};
    if (!profile.email || !validateEmail(profile.email)) {
      validationErrors.email = 'Valid email is required';
    }
    if (!profile.firstName?.trim()) {
      validationErrors.firstName = 'First name is required';
    }
    if (!profile.lastName?.trim()) {
      validationErrors.lastName = 'Last name is required';
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      setSaving(true);
      await settingsAPI.updateProfile(profile);
      toast.success('Profile updated successfully');
      setErrors({});
    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    
    const validationErrors = {};
    if (!passwordData.currentPassword) {
      validationErrors.currentPassword = 'Current password is required';
    }
    if (!validatePassword(passwordData.newPassword)) {
      validationErrors.newPassword = 'Password must be at least 6 characters';
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      validationErrors.confirmPassword = 'Passwords do not match';
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      setSaving(true);
      await settingsAPI.changePassword(passwordData);
      toast.success('Password changed successfully');
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setErrors({});
    } catch (error) {
      toast.error('Failed to change password');
    } finally {
      setSaving(false);
    }
  };

  const handleNotificationsSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setSaving(true);
      await settingsAPI.updateProfile({ settings: { notifications } });
      toast.success('Notification preferences updated');
    } catch (error) {
      toast.error('Failed to update notifications');
    } finally {
      setSaving(false);
    }
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  if (loading) {
    return <LoadingSpinner fullScreen text="Loading settings..." />;
  }

  return (
    <div className="settings">
      <div className="page-header">
        <h1>Settings</h1>
        <p>Manage your admin profile and preferences</p>
      </div>

      <div className="settings-container">
        <div className="settings-sidebar">
          <nav className="settings-nav">
            <button 
              className={`nav-item ${activeTab === 'profile' ? 'active' : ''}`}
              onClick={() => setActiveTab('profile')}
            >
              <FiUser />
              <span>Profile</span>
            </button>
            <button 
              className={`nav-item ${activeTab === 'password' ? 'active' : ''}`}
              onClick={() => setActiveTab('password')}
            >
              <FiLock />
              <span>Password</span>
            </button>
            <button 
              className={`nav-item ${activeTab === 'notifications' ? 'active' : ''}`}
              onClick={() => setActiveTab('notifications')}
            >
              <FiBell />
              <span>Notifications</span>
            </button>
          </nav>
        </div>

        <div className="settings-content">
          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div className="settings-section">
              <div className="section-header">
                <h2>Profile Information</h2>
                <p>Update your personal information and contact details</p>
              </div>
              
              <form onSubmit={handleProfileSubmit} className="settings-form">
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="firstName" className="form-label">First Name</label>
                    <input
                      type="text"
                      id="firstName"
                      value={profile.firstName}
                      onChange={(e) => setProfile(prev => ({ ...prev, firstName: e.target.value }))}
                      className={`form-input ${errors.firstName ? 'error' : ''}`}
                      placeholder="Enter your first name"
                    />
                    {errors.firstName && <span className="field-error">{errors.firstName}</span>}
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="lastName" className="form-label">Last Name</label>
                    <input
                      type="text"
                      id="lastName"
                      value={profile.lastName}
                      onChange={(e) => setProfile(prev => ({ ...prev, lastName: e.target.value }))}
                      className={`form-input ${errors.lastName ? 'error' : ''}`}
                      placeholder="Enter your last name"
                    />
                    {errors.lastName && <span className="field-error">{errors.lastName}</span>}
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="username" className="form-label">Username</label>
                    <input
                      type="text"
                      id="username"
                      value={profile.username}
                      className="form-input"
                      disabled
                      title="Username cannot be changed"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="email" className="form-label">Email</label>
                    <input
                      type="email"
                      id="email"
                      value={profile.email}
                      onChange={(e) => setProfile(prev => ({ ...prev, email: e.target.value }))}
                      className={`form-input ${errors.email ? 'error' : ''}`}
                      placeholder="Enter your email"
                    />
                    {errors.email && <span className="field-error">{errors.email}</span>}
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="role" className="form-label">Role</label>
                  <input
                    type="text"
                    id="role"
                    value={profile.role}
                    className="form-input"
                    disabled
                    title="Role cannot be changed"
                  />
                </div>

                <div className="form-actions">
                  <Button type="submit" loading={saving} icon={<FiSave />}>
                    Save Changes
                  </Button>
                </div>
              </form>
            </div>
          )}

          {/* Password Tab */}
          {activeTab === 'password' && (
            <div className="settings-section">
              <div className="section-header">
                <h2>Change Password</h2>
                <p>Update your password to keep your account secure</p>
              </div>
              
              <form onSubmit={handlePasswordSubmit} className="settings-form">
                <div className="form-group">
                  <label htmlFor="currentPassword" className="form-label">Current Password</label>
                  <div className="password-input">
                    <input
                      type={showPasswords.current ? 'text' : 'password'}
                      id="currentPassword"
                      value={passwordData.currentPassword}
                      onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
                      className={`form-input ${errors.currentPassword ? 'error' : ''}`}
                      placeholder="Enter your current password"
                    />
                    <button
                      type="button"
                      className="password-toggle"
                      onClick={() => togglePasswordVisibility('current')}
                    >
                      {showPasswords.current ? <FiEyeOff /> : <FiEye />}
                    </button>
                  </div>
                  {errors.currentPassword && <span className="field-error">{errors.currentPassword}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="newPassword" className="form-label">New Password</label>
                  <div className="password-input">
                    <input
                      type={showPasswords.new ? 'text' : 'password'}
                      id="newPassword"
                      value={passwordData.newPassword}
                      onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                      className={`form-input ${errors.newPassword ? 'error' : ''}`}
                      placeholder="Enter your new password"
                    />
                    <button
                      type="button"
                      className="password-toggle"
                      onClick={() => togglePasswordVisibility('new')}
                    >
                      {showPasswords.new ? <FiEyeOff /> : <FiEye />}
                    </button>
                  </div>
                  {errors.newPassword && <span className="field-error">{errors.newPassword}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="confirmPassword" className="form-label">Confirm New Password</label>
                  <div className="password-input">
                    <input
                      type={showPasswords.confirm ? 'text' : 'password'}
                      id="confirmPassword"
                      value={passwordData.confirmPassword}
                      onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                      className={`form-input ${errors.confirmPassword ? 'error' : ''}`}
                      placeholder="Confirm your new password"
                    />
                    <button
                      type="button"
                      className="password-toggle"
                      onClick={() => togglePasswordVisibility('confirm')}
                    >
                      {showPasswords.confirm ? <FiEyeOff /> : <FiEye />}
                    </button>
                  </div>
                  {errors.confirmPassword && <span className="field-error">{errors.confirmPassword}</span>}
                </div>

                <div className="form-actions">
                  <Button type="submit" loading={saving} icon={<FiSave />}>
                    Change Password
                  </Button>
                </div>
              </form>
            </div>
          )}

          {/* Notifications Tab */}
          {activeTab === 'notifications' && (
            <div className="settings-section">
              <div className="section-header">
                <h2>Notification Preferences</h2>
                <p>Choose which notifications you want to receive</p>
              </div>
              
              <form onSubmit={handleNotificationsSubmit} className="settings-form">
                <div className="notification-groups">
                  <div className="notification-group">
                    <h3>General Notifications</h3>
                    <div className="notification-items">
                      <label className="notification-item">
                        <input
                          type="checkbox"
                          checked={notifications.email}
                          onChange={(e) => setNotifications(prev => ({ ...prev, email: e.target.checked }))}
                        />
                        <span className="checkmark"></span>
                        <div className="notification-info">
                          <span className="notification-title">Email Notifications</span>
                          <span className="notification-desc">Receive notifications via email</span>
                        </div>
                      </label>
                      
                      <label className="notification-item">
                        <input
                          type="checkbox"
                          checked={notifications.push}
                          onChange={(e) => setNotifications(prev => ({ ...prev, push: e.target.checked }))}
                        />
                        <span className="checkmark"></span>
                        <div className="notification-info">
                          <span className="notification-title">Push Notifications</span>
                          <span className="notification-desc">Receive browser push notifications</span>
                        </div>
                      </label>
                    </div>
                  </div>

                  <div className="notification-group">
                    <h3>Content Notifications</h3>
                    <div className="notification-items">
                      <label className="notification-item">
                        <input
                          type="checkbox"
                          checked={notifications.newUsers}
                          onChange={(e) => setNotifications(prev => ({ ...prev, newUsers: e.target.checked }))}
                        />
                        <span className="checkmark"></span>
                        <div className="notification-info">
                          <span className="notification-title">New User Registrations</span>
                          <span className="notification-desc">Get notified when new users register</span>
                        </div>
                      </label>
                      
                      <label className="notification-item">
                        <input
                          type="checkbox"
                          checked={notifications.contentUpdates}
                          onChange={(e) => setNotifications(prev => ({ ...prev, contentUpdates: e.target.checked }))}
                        />
                        <span className="checkmark"></span>
                        <div className="notification-info">
                          <span className="notification-title">Content Updates</span>
                          <span className="notification-desc">Get notified about content changes</span>
                        </div>
                      </label>
                      
                      <label className="notification-item">
                        <input
                          type="checkbox"
                          checked={notifications.systemAlerts}
                          onChange={(e) => setNotifications(prev => ({ ...prev, systemAlerts: e.target.checked }))}
                        />
                        <span className="checkmark"></span>
                        <div className="notification-info">
                          <span className="notification-title">System Alerts</span>
                          <span className="notification-desc">Important system notifications</span>
                        </div>
                      </label>
                      
                      <label className="notification-item">
                        <input
                          type="checkbox"
                          checked={notifications.weeklyReports}
                          onChange={(e) => setNotifications(prev => ({ ...prev, weeklyReports: e.target.checked }))}
                        />
                        <span className="checkmark"></span>
                        <div className="notification-info">
                          <span className="notification-title">Weekly Reports</span>
                          <span className="notification-desc">Receive weekly analytics reports</span>
                        </div>
                      </label>
                    </div>
                  </div>
                </div>

                <div className="form-actions">
                  <Button type="submit" loading={saving} icon={<FiSave />}>
                    Save Preferences
                  </Button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;
