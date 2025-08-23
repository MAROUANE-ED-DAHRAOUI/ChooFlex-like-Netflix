const axios = require('axios');

const MAIN_BACKEND_URL = process.env.MAIN_BACKEND_URL || 'http://localhost:5000';

// Helper function to generate enhanced mock analytics data
const generateMockStats = () => {
  const totalUsers = Math.floor(Math.random() * 500) + 800;
  const activeUsers = Math.floor(totalUsers * 0.7) + Math.floor(Math.random() * 100);
  const newUsers = Math.floor(totalUsers * 0.1) + Math.floor(Math.random() * 50);
  const totalContent = Math.floor(Math.random() * 50) + 150;
  const totalViews = Math.floor(Math.random() * 20000) + 30000;
  const totalWatchTime = Math.floor(Math.random() * 5000) + 10000;

  return {
    totalUsers,
    activeUsers,
    newUsers,
    bannedUsers: Math.floor(totalUsers * 0.02),
    totalContent,
    moviesCount: Math.floor(totalContent * 0.7),
    seriesCount: Math.floor(totalContent * 0.3),
    totalViews,
    totalWatchTime,
    avgSessionTime: Math.floor(Math.random() * 15) + 20,
    userGrowth: ((newUsers / totalUsers) * 100).toFixed(1),
    avgRating: (4.0 + Math.random() * 0.8).toFixed(1),
    revenue: Math.floor(Math.random() * 50000) + 75000,
    // User activity data for the last 7 days
    userActivity: Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      return {
        day: date.toLocaleDateString('en-US', { weekday: 'short' }),
        fullDate: date.toISOString().split('T')[0],
        users: Math.floor(activeUsers * (0.6 + Math.random() * 0.4)),
        views: Math.floor(Math.random() * 2000) + 800,
        sessions: Math.floor(Math.random() * 1000) + 400,
        watchTime: Math.floor(Math.random() * 600) + 300
      };
    }),
    // Device statistics
    deviceStats: [
      { device: 'Desktop', percentage: 42, users: Math.floor(activeUsers * 0.42), color: '#e50914' },
      { device: 'Mobile', percentage: 35, users: Math.floor(activeUsers * 0.35), color: '#0d6efd' },
      { device: 'Tablet', percentage: 18, users: Math.floor(activeUsers * 0.18), color: '#28a745' },
      { device: 'Smart TV', percentage: 5, users: Math.floor(activeUsers * 0.05), color: '#fd7e14' }
    ],
    // Genre distribution
    topGenres: [
      { name: 'Action', value: Math.floor(totalContent * 0.28), percentage: 28, users: Math.floor(activeUsers * 0.25), views: Math.floor(Math.random() * 5000) + 3000 },
      { name: 'Drama', value: Math.floor(totalContent * 0.24), percentage: 24, users: Math.floor(activeUsers * 0.22), views: Math.floor(Math.random() * 4000) + 2500 },
      { name: 'Comedy', value: Math.floor(totalContent * 0.20), percentage: 20, users: Math.floor(activeUsers * 0.18), views: Math.floor(Math.random() * 3500) + 2000 },
      { name: 'Thriller', value: Math.floor(totalContent * 0.16), percentage: 16, users: Math.floor(activeUsers * 0.15), views: Math.floor(Math.random() * 3000) + 1500 },
      { name: 'Sci-Fi', value: Math.floor(totalContent * 0.12), percentage: 12, users: Math.floor(activeUsers * 0.12), views: Math.floor(Math.random() * 2500) + 1000 }
    ]
  };
};

const generateMockTopContent = () => [
  { 
    id: 1, 
    title: 'Inception', 
    isSeries: false,
    views: Math.floor(Math.random() * 8000) + 5000,
    rating: (Math.random() * 1 + 4.2).toFixed(1),
    genre: 'Sci-Fi',
    year: 2010,
    description: 'A mind-bending thriller about dreams within dreams'
  },
  { 
    id: 2, 
    title: 'Breaking Bad', 
    isSeries: true,
    views: Math.floor(Math.random() * 7000) + 4500,
    rating: (Math.random() * 0.8 + 4.4).toFixed(1),
    genre: 'Drama',
    year: 2008,
    description: 'A high school chemistry teacher turned methamphetamine cook'
  },
  { 
    id: 3, 
    title: 'The Dark Knight', 
    isSeries: false,
    views: Math.floor(Math.random() * 6500) + 4000,
    rating: (Math.random() * 0.8 + 4.3).toFixed(1),
    genre: 'Action',
    year: 2008,
    description: 'Batman faces the Joker in this epic superhero film'
  },
  { 
    id: 4, 
    title: 'Stranger Things', 
    isSeries: true,
    views: Math.floor(Math.random() * 6000) + 3800,
    rating: (Math.random() * 0.9 + 4.1).toFixed(1),
    genre: 'Horror',
    year: 2016,
    description: 'Kids in 1980s Indiana encounter supernatural forces'
  },
  { 
    id: 5, 
    title: 'Interstellar', 
    isSeries: false,
    views: Math.floor(Math.random() * 5500) + 3500,
    rating: (Math.random() * 0.7 + 4.2).toFixed(1),
    genre: 'Sci-Fi',
    year: 2014,
    description: 'A space exploration epic about saving humanity'
  },
  { 
    id: 6, 
    title: 'The Witcher', 
    isSeries: true,
    views: Math.floor(Math.random() * 5000) + 3200,
    rating: (Math.random() * 0.8 + 4.0).toFixed(1),
    genre: 'Fantasy',
    year: 2019,
    description: 'A monster hunter in a magical medieval world'
  },
  { 
    id: 7, 
    title: 'Pulp Fiction', 
    isSeries: false,
    views: Math.floor(Math.random() * 4800) + 3000,
    rating: (Math.random() * 0.6 + 4.3).toFixed(1),
    genre: 'Drama',
    year: 1994,
    description: 'Interconnected stories of crime in Los Angeles'
  },
  { 
    id: 8, 
    title: 'The Crown', 
    isSeries: true,
    views: Math.floor(Math.random() * 4500) + 2800,
    rating: (Math.random() * 0.7 + 4.1).toFixed(1),
    genre: 'Drama',
    year: 2016,
    description: 'The reign of Queen Elizabeth II chronicled'
  },
  { 
    id: 9, 
    title: 'Avengers: Endgame', 
    isSeries: false,
    views: Math.floor(Math.random() * 4200) + 2600,
    rating: (Math.random() * 0.8 + 4.2).toFixed(1),
    genre: 'Action',
    year: 2019,
    description: 'The epic conclusion to the Infinity Saga'
  },
  { 
    id: 10, 
    title: 'Money Heist', 
    isSeries: true,
    views: Math.floor(Math.random() * 4000) + 2400,
    rating: (Math.random() * 0.9 + 4.0).toFixed(1),
    genre: 'Thriller',
    year: 2017,
    description: 'A criminal mastermind plans the perfect heist'
  }
];

const generateMockActiveUsers = () => [
  { 
    id: 1, 
    username: 'moviebuff2024', 
    email: 'moviebuff@example.com',
    lastActive: new Date(Date.now() - Math.random() * 2 * 60 * 60 * 1000).toISOString(),
    sessionsToday: Math.floor(Math.random() * 5) + 1,
    totalWatchTime: Math.floor(Math.random() * 300) + 120,
    banned: false,
    createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString()
  },
  { 
    id: 2, 
    username: 'seriesfan', 
    email: 'seriesfan@example.com',
    lastActive: new Date(Date.now() - Math.random() * 4 * 60 * 60 * 1000).toISOString(),
    sessionsToday: Math.floor(Math.random() * 4) + 1,
    totalWatchTime: Math.floor(Math.random() * 250) + 90,
    banned: false,
    createdAt: new Date(Date.now() - Math.random() * 60 * 24 * 60 * 60 * 1000).toISOString()
  },
  { 
    id: 3, 
    username: 'cinemaholic', 
    email: 'cinemaholic@example.com',
    lastActive: new Date(Date.now() - Math.random() * 1 * 60 * 60 * 1000).toISOString(),
    sessionsToday: Math.floor(Math.random() * 6) + 2,
    totalWatchTime: Math.floor(Math.random() * 400) + 180,
    banned: false,
    createdAt: new Date(Date.now() - Math.random() * 15 * 24 * 60 * 60 * 1000).toISOString()
  },
  { 
    id: 4, 
    username: 'streamlover', 
    email: 'streamlover@example.com',
    lastActive: new Date(Date.now() - Math.random() * 6 * 60 * 60 * 1000).toISOString(),
    sessionsToday: Math.floor(Math.random() * 3) + 1,
    totalWatchTime: Math.floor(Math.random() * 200) + 75,
    banned: false,
    createdAt: new Date(Date.now() - Math.random() * 45 * 24 * 60 * 60 * 1000).toISOString()
  },
  { 
    id: 5, 
    username: 'bingewatcher', 
    email: 'bingewatcher@example.com',
    lastActive: new Date(Date.now() - Math.random() * 8 * 60 * 60 * 1000).toISOString(),
    sessionsToday: Math.floor(Math.random() * 7) + 2,
    totalWatchTime: Math.floor(Math.random() * 500) + 250,
    banned: false,
    createdAt: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString()
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

// Mock users endpoint for analytics
exports.getMockUsers = (req, res) => {
  try {
    const mockUsers = generateMockActiveUsers();
    
    // Add more users to make it realistic
    const additionalUsers = Array.from({ length: 20 }, (_, i) => ({
      id: i + 10,
      username: `user${i + 10}`,
      email: `user${i + 10}@example.com`,
      lastActive: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
      sessionsToday: Math.floor(Math.random() * 3) + 1,
      totalWatchTime: Math.floor(Math.random() * 200) + 30,
      banned: Math.random() < 0.05, // 5% banned users
      createdAt: new Date(Date.now() - Math.random() * 180 * 24 * 60 * 60 * 1000).toISOString()
    }));

    const allUsers = [...mockUsers, ...additionalUsers];
    res.json({ data: allUsers });
  } catch (error) {
    console.error('Mock users error:', error);
    res.status(500).json({ error: 'Failed to fetch users data' });
  }
};

// Mock content endpoint for analytics
exports.getMockContent = (req, res) => {
  try {
    const mockContent = generateMockTopContent();
    
    // Add more content to make it realistic
    const additionalContent = [
      { id: 11, title: 'The Matrix', isSeries: false, genre: 'Sci-Fi', year: 1999, views: 3200, rating: '4.4' },
      { id: 12, title: 'Friends', isSeries: true, genre: 'Comedy', year: 1994, views: 2800, rating: '4.2' },
      { id: 13, title: 'Game of Thrones', isSeries: true, genre: 'Fantasy', year: 2011, views: 4500, rating: '4.0' },
      { id: 14, title: 'The Godfather', isSeries: false, genre: 'Drama', year: 1972, views: 3800, rating: '4.7' },
      { id: 15, title: 'Black Mirror', isSeries: true, genre: 'Sci-Fi', year: 2011, views: 2200, rating: '4.1' },
      { id: 16, title: 'Forrest Gump', isSeries: false, genre: 'Drama', year: 1994, views: 3100, rating: '4.5' },
      { id: 17, title: 'The Office', isSeries: true, genre: 'Comedy', year: 2005, views: 2600, rating: '4.3' },
      { id: 18, title: 'Joker', isSeries: false, genre: 'Drama', year: 2019, views: 2900, rating: '4.0' },
      { id: 19, title: 'Ozark', isSeries: true, genre: 'Drama', year: 2017, views: 2400, rating: '4.2' },
      { id: 20, title: 'Parasite', isSeries: false, genre: 'Thriller', year: 2019, views: 2100, rating: '4.6' }
    ];

    const allContent = [...mockContent, ...additionalContent];
    res.json({ data: allContent });
  } catch (error) {
    console.error('Mock content error:', error);
    res.status(500).json({ error: 'Failed to fetch content data' });
  }
};
