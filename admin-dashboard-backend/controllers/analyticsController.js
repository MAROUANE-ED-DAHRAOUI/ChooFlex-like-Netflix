const axios = require('axios');

const MAIN_BACKEND_URL = process.env.MAIN_BACKEND_URL || 'http://localhost:5000';

// Helper function to generate mock analytics data
const generateMockStats = () => ({
  users: {
    total: Math.floor(Math.random() * 1000) + 500,
    active: Math.floor(Math.random() * 200) + 100,
    new: Math.floor(Math.random() * 50) + 10
  },
  content: {
    total: Math.floor(Math.random() * 100) + 50,
    movies: Math.floor(Math.random() * 60) + 30,
    series: Math.floor(Math.random() * 40) + 20
  },
  activity: {
    totalViews: Math.floor(Math.random() * 10000) + 5000,
    dailyViews: Math.floor(Math.random() * 500) + 200,
    avgSessionTime: Math.floor(Math.random() * 60) + 30 // minutes
  },
  revenue: {
    total: Math.floor(Math.random() * 50000) + 25000,
    monthly: Math.floor(Math.random() * 5000) + 2000
  }
});

const generateMockTopContent = () => [
  { 
    id: 1, 
    title: 'Inception', 
    type: 'movie',
    views: Math.floor(Math.random() * 5000) + 1000,
    rating: (Math.random() * 2 + 8).toFixed(1),
    genre: 'Sci-Fi'
  },
  { 
    id: 2, 
    title: 'Breaking Bad', 
    type: 'series',
    views: Math.floor(Math.random() * 4000) + 800,
    rating: (Math.random() * 2 + 8).toFixed(1),
    genre: 'Drama'
  },
  { 
    id: 3, 
    title: 'The Dark Knight', 
    type: 'movie',
    views: Math.floor(Math.random() * 3500) + 600,
    rating: (Math.random() * 2 + 8).toFixed(1),
    genre: 'Action'
  },
  { 
    id: 4, 
    title: 'Stranger Things', 
    type: 'series',
    views: Math.floor(Math.random() * 3000) + 500,
    rating: (Math.random() * 2 + 8).toFixed(1),
    genre: 'Horror'
  }
];

const generateMockActiveUsers = () => [
  { 
    id: 1, 
    username: 'moviebuff2024', 
    lastActive: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000).toISOString(),
    sessionsToday: Math.floor(Math.random() * 5) + 1,
    totalWatchTime: Math.floor(Math.random() * 300) + 60 // minutes
  },
  { 
    id: 2, 
    username: 'seriesfan', 
    lastActive: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000).toISOString(),
    sessionsToday: Math.floor(Math.random() * 4) + 1,
    totalWatchTime: Math.floor(Math.random() * 250) + 45
  },
  { 
    id: 3, 
    username: 'cinemaholic', 
    lastActive: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000).toISOString(),
    sessionsToday: Math.floor(Math.random() * 6) + 1,
    totalWatchTime: Math.floor(Math.random() * 400) + 90
  }
];

exports.stats = async (req, res) => {
  try {
    // Try to fetch from main backend
    try {
      const response = await axios.get(`${MAIN_BACKEND_URL}/api/analytics/stats`, {
        timeout: 5000
      });
      res.json(response.data);
    } catch (backendError) {
      // Fallback to mock data
      console.warn('Failed to fetch analytics from main backend, using mock data:', backendError.message);
      res.json(generateMockStats());
    }
  } catch (error) {
    console.error('Analytics stats error:', error);
    res.status(500).json({ error: 'Failed to fetch analytics stats' });
  }
};

exports.topContent = async (req, res) => {
  try {
    const { limit = 10, type } = req.query;
    
    // Try to fetch from main backend
    try {
      const response = await axios.get(`${MAIN_BACKEND_URL}/api/analytics/top-content`, {
        params: { limit, type },
        timeout: 5000
      });
      res.json(response.data);
    } catch (backendError) {
      // Fallback to mock data
      let mockData = generateMockTopContent();
      
      // Filter by type if specified
      if (type && ['movie', 'series'].includes(type)) {
        mockData = mockData.filter(item => item.type === type);
      }
      
      // Apply limit
      const limitNum = parseInt(limit);
      if (!isNaN(limitNum) && limitNum > 0) {
        mockData = mockData.slice(0, limitNum);
      }
      
      res.json(mockData);
    }
  } catch (error) {
    console.error('Top content error:', error);
    res.status(500).json({ error: 'Failed to fetch top content' });
  }
};

exports.activeUsers = async (req, res) => {
  try {
    const { limit = 20 } = req.query;
    
    // Try to fetch from main backend
    try {
      const response = await axios.get(`${MAIN_BACKEND_URL}/api/analytics/active-users`, {
        params: { limit },
        timeout: 5000
      });
      res.json(response.data);
    } catch (backendError) {
      // Fallback to mock data
      let mockData = generateMockActiveUsers();
      
      // Apply limit
      const limitNum = parseInt(limit);
      if (!isNaN(limitNum) && limitNum > 0) {
        mockData = mockData.slice(0, limitNum);
      }
      
      res.json(mockData);
    }
  } catch (error) {
    console.error('Active users error:', error);
    res.status(500).json({ error: 'Failed to fetch active users' });
  }
};

// Additional analytics endpoints
exports.viewsOverTime = async (req, res) => {
  try {
    const { period = '7d' } = req.query; // 24h, 7d, 30d
    
    // Generate mock time series data
    const periods = {
      '24h': 24,
      '7d': 7,
      '30d': 30
    };
    
    const dataPoints = periods[period] || 7;
    const mockData = [];
    
    for (let i = dataPoints - 1; i >= 0; i--) {
      const date = new Date();
      if (period === '24h') {
        date.setHours(date.getHours() - i);
      } else {
        date.setDate(date.getDate() - i);
      }
      
      mockData.push({
        date: date.toISOString(),
        views: Math.floor(Math.random() * 1000) + 200,
        uniqueUsers: Math.floor(Math.random() * 500) + 100
      });
    }
    
    res.json(mockData);
  } catch (error) {
    console.error('Views over time error:', error);
    res.status(500).json({ error: 'Failed to fetch views over time' });
  }
};
