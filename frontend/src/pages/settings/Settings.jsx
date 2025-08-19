import { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Person,
  Security,
  Notifications,
  Palette,
  Settings as SettingsIcon,
  AccountCircle,
  Help,
  Edit,
  Save,
  Cancel,
  Delete,
  Logout,
  Visibility,
  VisibilityOff,
  PhotoCamera,
  Language,
  DarkMode,
  LightMode,
  SettingsBrightness
} from '@mui/icons-material';

import { AuthContext } from '../../authContext/AuthContext';
import { logout } from '../../authContext/apiCalls';
import Navbar from '../../components/navbar/Navbar';
import { validateForm, validateEmail, validatePassword, validateUsername, validatePhone } from '../../utils/validation';
import { storage, theme, preferences } from '../../utils/storage';
import toast from '../../utils/toast';
import './settings.scss';

const Settings = () => {
  const { user, dispatch } = useContext(AuthContext);
  const navigate = useNavigate();
  
  // Active tab state
  const [activeTab, setActiveTab] = useState('profile');
  
  // Loading states
  const [loading, setLoading] = useState({});
  const [saving, setSaving] = useState(false);
  
  // Form states
  const [profileData, setProfileData] = useState({
    username: user?.username || '',
    email: user?.email || '',
    phone: user?.phone || '',
    fullName: user?.fullName || '',
    bio: user?.bio || ''
  });
  
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  const [userPreferences, setUserPreferences] = useState(preferences.get());
  const [currentTheme, setCurrentTheme] = useState(theme.get());
  const [errors, setErrors] = useState({});
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });
  
  // Edit states
  const [editMode, setEditMode] = useState({
    profile: false,
    password: false
  });

  useEffect(() => {
    // Initialize theme
    theme.set(currentTheme);
  }, [currentTheme]);

  // Handle input changes
  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handlePreferenceChange = (key, value) => {
    setUserPreferences(prev => {
      const updated = { ...prev };
      if (key.includes('.')) {
        const keys = key.split('.');
        let current = updated;
        for (let i = 0; i < keys.length - 1; i++) {
          current = current[keys[i]];
        }
        current[keys[keys.length - 1]] = value;
      } else {
        updated[key] = value;
      }
      return updated;
    });
  };

  // Save functions
  const saveProfile = async () => {
    const validation = validateForm(profileData, {
      username: {
        required: true,
        validator: validateUsername,
        message: 'Username must be at least 3 characters and contain only letters, numbers, and underscores',
        label: 'Username'
      },
      email: {
        required: true,
        validator: validateEmail,
        message: 'Please enter a valid email address',
        label: 'Email'
      },
      phone: {
        required: false,
        validator: validatePhone,
        message: 'Please enter a valid phone number',
        label: 'Phone'
      }
    });

    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setSaving(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Update context with new user data
      // dispatch({ type: 'UPDATE_USER', payload: profileData });
      
      setEditMode(prev => ({ ...prev, profile: false }));
      toast.success('Profile updated successfully!');
    } catch (error) {
      toast.error('Failed to update profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const savePassword = async () => {
    const validation = validateForm(passwordData, {
      currentPassword: {
        required: true,
        label: 'Current password'
      },
      newPassword: {
        required: true,
        validator: validatePassword,
        message: 'Password must be at least 6 characters',
        label: 'New password'
      },
      confirmPassword: {
        required: true,
        label: 'Confirm password'
      }
    });

    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setErrors({ confirmPassword: 'Passwords do not match' });
      return;
    }

    setSaving(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setEditMode(prev => ({ ...prev, password: false }));
      toast.success('Password changed successfully!');
    } catch (error) {
      toast.error('Failed to change password. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const savePreferences = async () => {
    setSaving(true);
    try {
      preferences.set(userPreferences);
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Preferences saved successfully!');
    } catch (error) {
      toast.error('Failed to save preferences. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleThemeChange = (newTheme) => {
    setCurrentTheme(newTheme);
    theme.set(newTheme);
    toast.info(`Switched to ${newTheme} theme`);
  };

  const handleLogout = () => {
    logout(dispatch);
    navigate('/login');
  };

  const handleDeleteAccount = () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      // Implement account deletion
      toast.warning('Account deletion would be implemented here');
    }
  };

  const handleExportData = () => {
    // Simulate data export
    const userData = {
      profile: profileData,
      preferences: userPreferences,
      exportDate: new Date().toISOString()
    };
    
    const dataStr = JSON.stringify(userData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = 'chooflex-user-data.json';
    link.click();
    
    URL.revokeObjectURL(url);
    toast.success('User data exported successfully!');
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: Person },
    { id: 'settings', label: 'Settings', icon: SettingsIcon },
    { id: 'signout', label: 'Sign out', icon: Logout }
  ];

  return (
    <div className="settings">
      <Navbar />
      
      <div className="settings__container">
        <div className="settings__header">
          <h1 className="settings__title">Settings</h1>
          <p className="settings__subtitle">Manage your account and preferences</p>
        </div>

        <div className="settings__content">
          {/* Sidebar Navigation */}
          <div className="settings__sidebar">
            <nav className="settings__nav">
              {tabs.map(tab => {
                const IconComponent = tab.icon;
                return (
                  <button
                    key={tab.id}
                    className={`settings__nav-item ${activeTab === tab.id ? 'active' : ''}`}
                    onClick={() => {
                      if (tab.id === 'signout') {
                        handleLogout();
                      } else {
                        setActiveTab(tab.id);
                      }
                    }}
                  >
                    <IconComponent className="settings__nav-icon" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Main Content */}
          <div className="settings__main">
            {/* Profile Settings */}
            {activeTab === 'profile' && (
              <div className="settings__section">
                <div className="settings__section-header">
                  <h2>Profile Information</h2>
                  <button
                    className="settings__edit-btn"
                    onClick={() => setEditMode(prev => ({ ...prev, profile: !prev.profile }))}
                  >
                    {editMode.profile ? <Cancel /> : <Edit />}
                    {editMode.profile ? 'Cancel' : 'Edit'}
                  </button>
                </div>

                <div className="settings__profile-photo">
                  <div className="settings__avatar">
                    <AccountCircle />
                  </div>
                  {editMode.profile && (
                    <button className="settings__photo-btn">
                      <PhotoCamera />
                      Change Photo
                    </button>
                  )}
                </div>

                <form className="settings__form">
                  <div className="settings__form-group">
                    <label>Full Name</label>
                    <input
                      type="text"
                      name="fullName"
                      value={profileData.fullName}
                      onChange={handleProfileChange}
                      disabled={!editMode.profile}
                      className={errors.fullName ? 'error' : ''}
                    />
                    {errors.fullName && <span className="settings__error">{errors.fullName}</span>}
                  </div>

                  <div className="settings__form-group">
                    <label>Username</label>
                    <input
                      type="text"
                      name="username"
                      value={profileData.username}
                      onChange={handleProfileChange}
                      disabled={!editMode.profile}
                      className={errors.username ? 'error' : ''}
                    />
                    {errors.username && <span className="settings__error">{errors.username}</span>}
                  </div>

                  <div className="settings__form-group">
                    <label>Email</label>
                    <input
                      type="email"
                      name="email"
                      value={profileData.email}
                      onChange={handleProfileChange}
                      disabled={!editMode.profile}
                      className={errors.email ? 'error' : ''}
                    />
                    {errors.email && <span className="settings__error">{errors.email}</span>}
                  </div>

                  <div className="settings__form-group">
                    <label>Phone</label>
                    <input
                      type="tel"
                      name="phone"
                      value={profileData.phone}
                      onChange={handleProfileChange}
                      disabled={!editMode.profile}
                      className={errors.phone ? 'error' : ''}
                    />
                    {errors.phone && <span className="settings__error">{errors.phone}</span>}
                  </div>

                  <div className="settings__form-group">
                    <label>Bio</label>
                    <textarea
                      name="bio"
                      value={profileData.bio}
                      onChange={handleProfileChange}
                      disabled={!editMode.profile}
                      rows="3"
                      placeholder="Tell us about yourself..."
                    />
                  </div>

                  <div className="settings__form-group">
                    <label>Member Since</label>
                    <input
                      type="text"
                      value={new Date(user?.createdAt || Date.now()).toLocaleDateString()}
                      disabled
                      className="readonly"
                    />
                  </div>

                  {editMode.profile && (
                    <div className="settings__actions">
                      <button
                        type="button"
                        className="settings__save-btn"
                        onClick={saveProfile}
                        disabled={saving}
                      >
                        <Save />
                        {saving ? 'Saving...' : 'Save Changes'}
                      </button>
                    </div>
                  )}
                </form>
              </div>
            )}

            {/* Settings Tab */}
            {activeTab === 'settings' && (
              <div className="settings__section">
                <h2>Settings</h2>

                {/* Security Settings */}
                <div className="settings__subsection">
                  <div className="settings__section-header">
                    <h3>Security & Privacy</h3>
                    <button
                      className="settings__edit-btn"
                      onClick={() => setEditMode(prev => ({ ...prev, password: !prev.password }))}
                    >
                      {editMode.password ? <Cancel /> : <Edit />}
                      {editMode.password ? 'Cancel' : 'Change Password'}
                    </button>
                  </div>

                  {editMode.password && (
                    <form className="settings__form">
                      <div className="settings__form-group">
                        <label>Current Password</label>
                        <div className="settings__password-input">
                          <input
                            type={showPasswords.current ? 'text' : 'password'}
                            name="currentPassword"
                            value={passwordData.currentPassword}
                            onChange={handlePasswordChange}
                            className={errors.currentPassword ? 'error' : ''}
                          />
                          <button
                            type="button"
                            onClick={() => setShowPasswords(prev => ({ ...prev, current: !prev.current }))}
                          >
                            {showPasswords.current ? <VisibilityOff /> : <Visibility />}
                          </button>
                        </div>
                        {errors.currentPassword && <span className="settings__error">{errors.currentPassword}</span>}
                      </div>

                      <div className="settings__form-group">
                        <label>New Password</label>
                        <div className="settings__password-input">
                          <input
                            type={showPasswords.new ? 'text' : 'password'}
                            name="newPassword"
                            value={passwordData.newPassword}
                            onChange={handlePasswordChange}
                            className={errors.newPassword ? 'error' : ''}
                          />
                          <button
                            type="button"
                            onClick={() => setShowPasswords(prev => ({ ...prev, new: !prev.new }))}
                          >
                            {showPasswords.new ? <VisibilityOff /> : <Visibility />}
                          </button>
                        </div>
                        {errors.newPassword && <span className="settings__error">{errors.newPassword}</span>}
                      </div>

                      <div className="settings__form-group">
                        <label>Confirm New Password</label>
                        <div className="settings__password-input">
                          <input
                            type={showPasswords.confirm ? 'text' : 'password'}
                            name="confirmPassword"
                            value={passwordData.confirmPassword}
                            onChange={handlePasswordChange}
                            className={errors.confirmPassword ? 'error' : ''}
                          />
                          <button
                            type="button"
                            onClick={() => setShowPasswords(prev => ({ ...prev, confirm: !prev.confirm }))}
                          >
                            {showPasswords.confirm ? <VisibilityOff /> : <Visibility />}
                          </button>
                        </div>
                        {errors.confirmPassword && <span className="settings__error">{errors.confirmPassword}</span>}
                      </div>

                      <div className="settings__actions">
                        <button
                          type="button"
                          className="settings__save-btn"
                          onClick={savePassword}
                          disabled={saving}
                        >
                          <Save />
                          {saving ? 'Changing...' : 'Change Password'}
                        </button>
                      </div>
                    </form>
                  )}

                  <div className="settings__option">
                    <label>
                      <input
                        type="checkbox"
                        checked={userPreferences.privacy.twoFactorAuth}
                        onChange={(e) => handlePreferenceChange('privacy.twoFactorAuth', e.target.checked)}
                      />
                      Enable Two-Factor Authentication
                    </label>
                  </div>
                  <div className="settings__option">
                    <label>Profile Visibility</label>
                    <select
                      value={userPreferences.privacy.profileVisibility}
                      onChange={(e) => handlePreferenceChange('privacy.profileVisibility', e.target.value)}
                    >
                      <option value="public">Public</option>
                      <option value="private">Private</option>
                      <option value="friends">Friends Only</option>
                    </select>
                  </div>
                </div>

                {/* Notifications */}
                <div className="settings__subsection">
                  <h3>Notification Preferences</h3>
                  <div className="settings__option">
                    <label>
                      <input
                        type="checkbox"
                        checked={userPreferences.notifications.email}
                        onChange={(e) => handlePreferenceChange('notifications.email', e.target.checked)}
                      />
                      Email notifications
                    </label>
                  </div>
                  <div className="settings__option">
                    <label>
                      <input
                        type="checkbox"
                        checked={userPreferences.notifications.push}
                        onChange={(e) => handlePreferenceChange('notifications.push', e.target.checked)}
                      />
                      Push notifications
                    </label>
                  </div>
                  <div className="settings__option">
                    <label>
                      <input
                        type="checkbox"
                        checked={userPreferences.notifications.inApp}
                        onChange={(e) => handlePreferenceChange('notifications.inApp', e.target.checked)}
                      />
                      In-app notifications
                    </label>
                  </div>
                </div>

                {/* Appearance */}
                <div className="settings__subsection">
                  <h3>Appearance & Display</h3>
                  <div className="settings__theme-options">
                    <button
                      className={`settings__theme-btn ${currentTheme === 'light' ? 'active' : ''}`}
                      onClick={() => handleThemeChange('light')}
                    >
                      <LightMode />
                      Light
                    </button>
                    <button
                      className={`settings__theme-btn ${currentTheme === 'dark' ? 'active' : ''}`}
                      onClick={() => handleThemeChange('dark')}
                    >
                      <DarkMode />
                      Dark
                    </button>
                    <button
                      className={`settings__theme-btn ${currentTheme === 'system' ? 'active' : ''}`}
                      onClick={() => handleThemeChange('system')}
                    >
                      <SettingsBrightness />
                      System
                    </button>
                  </div>
                  <div className="settings__option">
                    <label>Language</label>
                    <select
                      value={userPreferences.language}
                      onChange={(e) => handlePreferenceChange('language', e.target.value)}
                    >
                      <option value="en">English</option>
                      <option value="es">Spanish</option>
                      <option value="fr">French</option>
                      <option value="de">German</option>
                    </select>
                  </div>
                </div>

                {/* App Preferences */}
                <div className="settings__subsection">
                  <h3>App Preferences</h3>
                  <div className="settings__option">
                    <label>
                      <input
                        type="checkbox"
                        checked={userPreferences.autoPlay}
                        onChange={(e) => handlePreferenceChange('autoPlay', e.target.checked)}
                      />
                      Autoplay next episode
                    </label>
                  </div>
                  <div className="settings__option">
                    <label>
                      <input
                        type="checkbox"
                        checked={userPreferences.autoPlayPreviews}
                        onChange={(e) => handlePreferenceChange('autoPlayPreviews', e.target.checked)}
                      />
                      Autoplay previews while browsing
                    </label>
                  </div>
                  <div className="settings__option">
                    <label>
                      <input
                        type="checkbox"
                        checked={userPreferences.safeMode}
                        onChange={(e) => handlePreferenceChange('safeMode', e.target.checked)}
                      />
                      Enable safe mode
                    </label>
                  </div>
                </div>

                {/* Account Actions */}
                <div className="settings__subsection">
                  <h3>Account Management</h3>
                  <button
                    className="settings__export-btn"
                    onClick={handleExportData}
                  >
                    Export Account Data
                  </button>
                  
                  <div className="settings__actions-grid" style={{ marginTop: '20px' }}>
                    <button
                      className="settings__delete-btn"
                      onClick={handleDeleteAccount}
                    >
                      <Delete />
                      Delete Account
                    </button>
                  </div>
                </div>

                {/* Active Sessions */}
                <div className="settings__subsection">
                  <h3>Active Sessions</h3>
                  <div className="settings__session">
                    <div>
                      <strong>Current Device</strong>
                      <p>Chrome on Windows • Active now</p>
                    </div>
                    <button className="settings__logout-btn">
                      Logout All Other Devices
                    </button>
                  </div>
                </div>

                {/* Support */}
                <div className="settings__subsection">
                  <h3>Support & Help</h3>
                  <div className="settings__support-links">
                    <a href="#" className="settings__support-link">
                      <Help />
                      FAQ & Help Center
                    </a>
                    <a href="#" className="settings__support-link">
                      Contact Support
                    </a>
                    <a href="#" className="settings__support-link">
                      Report a Problem
                    </a>
                  </div>
                  <div className="settings__app-info">
                    <p><strong>Version:</strong> 1.0.0</p>
                    <p><strong>Last Updated:</strong> {new Date().toLocaleDateString()}</p>
                    <p><strong>License:</strong> MIT</p>
                  </div>
                </div>

                <div className="settings__actions">
                  <button
                    className="settings__save-btn"
                    onClick={savePreferences}
                    disabled={saving}
                  >
                    <Save />
                    {saving ? 'Saving...' : 'Save All Settings'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
