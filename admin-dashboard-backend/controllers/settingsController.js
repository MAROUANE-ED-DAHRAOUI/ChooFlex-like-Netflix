const bcrypt = require('bcryptjs');

// In production, this would be stored in a database
let adminProfile = { 
  username: process.env.ADMIN_USERNAME || 'admin', 
  email: 'admin@chooflex.com',
  firstName: 'Admin',
  lastName: 'User',
  role: 'admin',
  lastLogin: new Date().toISOString(),
  settings: {
    notifications: {
      email: true,
      push: false,
      newUsers: true,
      contentUpdates: true,
      systemAlerts: true
    },
    theme: 'dark',
    language: 'en'
  }
};

let notifications = [
  { 
    id: 1, 
    message: 'New user registered: moviefan123', 
    type: 'user',
    timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    read: false
  },
  { 
    id: 2, 
    message: 'Content "Inception" was updated', 
    type: 'content',
    timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    read: false
  },
  { 
    id: 3, 
    message: 'System backup completed successfully', 
    type: 'system',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    read: true
  }
];

exports.profile = (req, res) => {
  try {
    // Remove sensitive data before sending
    const { ...profileData } = adminProfile;
    res.json(profileData);
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
};

exports.updateProfile = (req, res) => {
  try {
    const { firstName, lastName, email, settings } = req.body;
    
    // Basic validation
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }
    
    // Update allowed fields
    if (firstName) adminProfile.firstName = firstName;
    if (lastName) adminProfile.lastName = lastName;
    if (email) adminProfile.email = email;
    if (settings) {
      adminProfile.settings = { ...adminProfile.settings, ...settings };
    }
    
    // Remove sensitive data before sending
    const { ...profileData } = adminProfile;
    res.json({ 
      message: 'Profile updated successfully',
      profile: profileData
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
};

exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    // Basic validation
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: 'Current password and new password are required' });
    }
    
    if (newPassword.length < 6) {
      return res.status(400).json({ error: 'New password must be at least 6 characters long' });
    }
    
    // In production, verify current password against hashed password in database
    if (currentPassword !== (process.env.ADMIN_PASSWORD || 'admin123')) {
      return res.status(400).json({ error: 'Current password is incorrect' });
    }
    
    // In production, hash the new password and store it in database
    // const hashedPassword = await bcrypt.hash(newPassword, 10);
    
    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ error: 'Failed to change password' });
  }
};

exports.notifications = (req, res) => {
  try {
    const { unreadOnly = false, limit = 50 } = req.query;
    
    let filteredNotifications = [...notifications];
    
    // Filter unread only if requested
    if (unreadOnly === 'true') {
      filteredNotifications = filteredNotifications.filter(n => !n.read);
    }
    
    // Apply limit
    const limitNum = parseInt(limit);
    if (!isNaN(limitNum) && limitNum > 0) {
      filteredNotifications = filteredNotifications.slice(0, limitNum);
    }
    
    // Sort by timestamp (newest first)
    filteredNotifications.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    
    res.json({
      notifications: filteredNotifications,
      unreadCount: notifications.filter(n => !n.read).length,
      total: notifications.length
    });
  } catch (error) {
    console.error('Get notifications error:', error);
    res.status(500).json({ error: 'Failed to fetch notifications' });
  }
};

exports.markNotificationRead = (req, res) => {
  try {
    const { id } = req.params;
    
    const notification = notifications.find(n => n.id == id);
    if (!notification) {
      return res.status(404).json({ error: 'Notification not found' });
    }
    
    notification.read = true;
    res.json({ message: 'Notification marked as read', notification });
  } catch (error) {
    console.error('Mark notification read error:', error);
    res.status(500).json({ error: 'Failed to mark notification as read' });
  }
};

exports.markAllNotificationsRead = (req, res) => {
  try {
    notifications.forEach(n => n.read = true);
    res.json({ message: 'All notifications marked as read' });
  } catch (error) {
    console.error('Mark all notifications read error:', error);
    res.status(500).json({ error: 'Failed to mark all notifications as read' });
  }
};

exports.deleteNotification = (req, res) => {
  try {
    const { id } = req.params;
    
    const notificationIndex = notifications.findIndex(n => n.id == id);
    if (notificationIndex === -1) {
      return res.status(404).json({ error: 'Notification not found' });
    }
    
    notifications.splice(notificationIndex, 1);
    res.json({ message: 'Notification deleted successfully' });
  } catch (error) {
    console.error('Delete notification error:', error);
    res.status(500).json({ error: 'Failed to delete notification' });
  }
};
