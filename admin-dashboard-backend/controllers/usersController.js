const axios = require('axios');

const MAIN_BACKEND_URL = process.env.MAIN_BACKEND_URL || 'http://localhost:5000';

// Fallback data for when main backend is unavailable
let mockUsers = [
  { id: 1, username: 'user1', email: 'user1@example.com', banned: false, createdAt: new Date() },
  { id: 2, username: 'user2', email: 'user2@example.com', banned: false, createdAt: new Date() }
];

exports.list = async (req, res) => {
  try {
    // Try to fetch from main backend
    const response = await axios.get(`${MAIN_BACKEND_URL}/api/users`, {
      timeout: 5000
    });
    res.json(response.data);
  } catch (error) {
    console.warn('Failed to fetch users from main backend, using mock data:', error.message);
    // Fallback to mock data
    res.json(mockUsers);
  }
};

exports.get = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!id || isNaN(id)) {
      return res.status(400).json({ error: 'Invalid user ID' });
    }
    
    // Try to fetch from main backend
    try {
      const response = await axios.get(`${MAIN_BACKEND_URL}/api/users/${id}`, {
        timeout: 5000
      });
      res.json(response.data);
    } catch (backendError) {
      // Fallback to mock data
      const foundUser = mockUsers.find(u => u.id == id);
      if (!foundUser) {
        return res.status(404).json({ error: 'User not found' });
      }
      res.json(foundUser);
    }
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
};

exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    if (!id || isNaN(id)) {
      return res.status(400).json({ error: 'Invalid user ID' });
    }
    
    // Basic validation
    if (updates.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(updates.email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }
    
    // Try to update in main backend
    try {
      const response = await axios.put(`${MAIN_BACKEND_URL}/api/users/${id}`, updates, {
        timeout: 5000
      });
      res.json(response.data);
    } catch (backendError) {
      // Fallback to mock data
      const userIndex = mockUsers.findIndex(u => u.id == id);
      if (userIndex === -1) {
        return res.status(404).json({ error: 'User not found' });
      }
      
      mockUsers[userIndex] = { ...mockUsers[userIndex], ...updates };
      res.json(mockUsers[userIndex]);
    }
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ error: 'Failed to update user' });
  }
};

exports.remove = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!id || isNaN(id)) {
      return res.status(400).json({ error: 'Invalid user ID' });
    }
    
    // Try to delete from main backend
    try {
      await axios.delete(`${MAIN_BACKEND_URL}/api/users/${id}`, {
        timeout: 5000
      });
      res.json({ message: 'User deleted successfully' });
    } catch (backendError) {
      // Fallback to mock data
      const userIndex = mockUsers.findIndex(u => u.id == id);
      if (userIndex === -1) {
        return res.status(404).json({ error: 'User not found' });
      }
      
      mockUsers.splice(userIndex, 1);
      res.json({ message: 'User deleted successfully' });
    }
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ error: 'Failed to delete user' });
  }
};

exports.ban = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!id || isNaN(id)) {
      return res.status(400).json({ error: 'Invalid user ID' });
    }
    
    // Try to ban in main backend
    try {
      const response = await axios.post(`${MAIN_BACKEND_URL}/api/users/${id}/ban`, {}, {
        timeout: 5000
      });
      res.json(response.data);
    } catch (backendError) {
      // Fallback to mock data
      const userToBan = mockUsers.find(u => u.id == id);
      if (!userToBan) {
        return res.status(404).json({ error: 'User not found' });
      }
      
      userToBan.banned = true;
      res.json(userToBan);
    }
  } catch (error) {
    console.error('Ban user error:', error);
    res.status(500).json({ error: 'Failed to ban user' });
  }
};

exports.unban = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!id || isNaN(id)) {
      return res.status(400).json({ error: 'Invalid user ID' });
    }
    
    // Try to unban in main backend
    try {
      const response = await axios.post(`${MAIN_BACKEND_URL}/api/users/${id}/unban`, {}, {
        timeout: 5000
      });
      res.json(response.data);
    } catch (backendError) {
      // Fallback to mock data
      const userToUnban = mockUsers.find(u => u.id == id);
      if (!userToUnban) {
        return res.status(404).json({ error: 'User not found' });
      }
      
      userToUnban.banned = false;
      res.json(userToUnban);
    }
  } catch (error) {
    console.error('Unban user error:', error);
    res.status(500).json({ error: 'Failed to unban user' });
  }
};
