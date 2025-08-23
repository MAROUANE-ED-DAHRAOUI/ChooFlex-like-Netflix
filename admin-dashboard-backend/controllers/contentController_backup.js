const axios = require('axios');
const path = require('path');
const fs = require('fs');

const MAIN_BACKEND_URL = process.env.MAIN_BACKEND_URL || 'http://localhost:8000';

// Fallback data for when main backend is unavailable
let mockContent = [
  { 
    id: 1, 
    title: 'Inception', 
    type: 'movie', 
    featured: false, 
    genre: 'Sci-Fi', 
    year: 2010,
    rating: 8.8,
    createdAt: new Date().toISOString(),
    thumbnail: '/api/placeholder/300/400'
  },
  { 
    id: 2, 
    title: 'Breaking Bad', 
    type: 'series', 
    featured: true, 
    genre: 'Drama', 
    year: 2008,
    rating: 9.5,
    seasons: 5,
    episodes: 62,
    createdAt: new Date().toISOString(),
    thumbnail: '/api/placeholder/300/400'
  },
  { 
    id: 3, 
    title: 'The Dark Knight', 
    type: 'movie', 
    featured: true, 
    genre: 'Action', 
    year: 2008,
    rating: 9.0,
    createdAt: new Date().toISOString(),
    thumbnail: '/api/placeholder/300/400'
  },
  { 
    id: 4, 
    title: 'Stranger Things', 
    type: 'series', 
    featured: false, 
    genre: 'Sci-Fi', 
    year: 2016,
    rating: 8.7,
    seasons: 4,
    episodes: 34,
    createdAt: new Date().toISOString(),
    thumbnail: '/api/placeholder/300/400'
  },
  { 
    id: 5, 
    title: 'Pulp Fiction', 
    type: 'movie', 
    featured: false, 
    genre: 'Crime', 
    year: 1994,
    rating: 8.9,
    createdAt: new Date().toISOString(),
    thumbnail: '/api/placeholder/300/400'
  },
  { 
    id: 6, 
    title: 'Game of Thrones', 
    type: 'series', 
    featured: true, 
    genre: 'Fantasy', 
    year: 2011,
    rating: 9.3,
    seasons: 8,
    episodes: 73,
    createdAt: new Date().toISOString(),
    thumbnail: '/api/placeholder/300/400'
  },
  { 
    id: 7, 
    title: 'Avengers: Endgame', 
    type: 'movie', 
    featured: true, 
    genre: 'Action', 
    year: 2019,
    rating: 8.4,
    createdAt: new Date().toISOString(),
    thumbnail: '/api/placeholder/300/400'
  },
  { 
    id: 8, 
    title: 'The Office', 
    type: 'series', 
    featured: false, 
    genre: 'Comedy', 
    year: 2005,
    rating: 8.9,
    seasons: 9,
    episodes: 201,
    createdAt: new Date().toISOString(),
    thumbnail: '/api/placeholder/300/400'
  },
  { 
    id: 9, 
    title: 'Interstellar', 
    type: 'movie', 
    featured: false, 
    genre: 'Sci-Fi', 
    year: 2014,
    rating: 8.6,
    createdAt: new Date().toISOString(),
    thumbnail: '/api/placeholder/300/400'
  },
  { 
    id: 10, 
    title: 'Friends', 
    type: 'series', 
    featured: false, 
    genre: 'Comedy', 
    year: 1994,
    rating: 8.9,
    seasons: 10,
    episodes: 236,
    createdAt: new Date().toISOString(),
    thumbnail: '/api/placeholder/300/400'
  }
];

exports.list = async (req, res) => {
  try {
    console.log('Content list endpoint called');
    
    // Return mock content directly for now to ensure we show all movies
    console.log(`Returning ${mockContent.length} items from mock data`);
    
    res.json({
      success: true,
      data: {
        content: mockContent,
        totalItems: mockContent.length,
        stats: {
          totalMovies: mockContent.filter(item => item.type === 'movie').length,
          totalSeries: mockContent.filter(item => item.type === 'series').length,
          featuredItems: mockContent.filter(item => item.featured).length
        }
      }
    });
  } catch (error) {
    console.error('Error in content list:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch content',
      error: error.message
    });
  }
};
      
      
    
    // Enhanced fallback mock data
    console.log('Using enhanced mock content data');
    const enhancedMockContent = [
      {
        id: 1,
        title: 'Inception',
        type: 'movie',
        genre: 'Sci-Fi',
        year: 2010,
        rating: 8.8,
        featured: true,
        createdAt: new Date().toISOString(),
        thumbnail: '/api/placeholder/300/400',
        description: 'A mind-bending thriller',
        duration: 148,
        views: 15420
      },
      {
        id: 2,
        title: 'Breaking Bad',
        type: 'series',
        genre: 'Drama',
        year: 2008,
        rating: 9.5,
        featured: false,
        createdAt: new Date().toISOString(),
        thumbnail: '/api/placeholder/300/400',
        description: 'A chemistry teacher turns to crime',
        seasons: 5,
        episodes: 62,
        views: 28930
      },
      {
        id: 3,
        title: 'The Dark Knight',
        type: 'movie',
        genre: 'Action',
        year: 2008,
        rating: 9.0,
        featured: true,
        createdAt: new Date().toISOString(),
        thumbnail: '/api/placeholder/300/400',
        description: 'Batman faces his greatest challenge',
        duration: 152,
        views: 21870
      },
      {
        id: 4,
        title: 'Stranger Things',
        type: 'series',
        genre: 'Sci-Fi',
        year: 2016,
        rating: 8.7,
        featured: false,
        createdAt: new Date().toISOString(),
        thumbnail: '/api/placeholder/300/400',
        description: 'Supernatural events in a small town',
        seasons: 4,
        episodes: 42,
        views: 19650
      },
      {
        id: 5,
        title: 'The Godfather',
        type: 'movie',
        genre: 'Drama',
        year: 1972,
        rating: 9.2,
        featured: true,
        createdAt: new Date().toISOString(),
        thumbnail: '/api/placeholder/300/400',
        description: 'The saga of a crime family',
        duration: 175,
        views: 17890
      },
      {
        id: 6,
        title: 'Game of Thrones',
        type: 'series',
        genre: 'Fantasy',
        year: 2011,
        rating: 8.5,
        featured: false,
        createdAt: new Date().toISOString(),
        thumbnail: '/api/placeholder/300/400',
        description: 'Epic fantasy drama series',
        seasons: 8,
        episodes: 73,
        views: 24500
      }
    ];
    
    res.json(enhancedMockContent);
  } catch (error) {
    console.error('List content error:', error);
    res.status(500).json({ error: 'Failed to fetch content' });
  }
};

exports.create = async (req, res) => {
  try {
    const { title, type, genre, year, description, img, imgTitle, imgSm, trailer, video, limit } = req.body;
    
    // Basic validation
    if (!title || !type) {
      return res.status(400).json({ error: 'Title and type are required' });
    }
    
    if (!['movie', 'series'].includes(type)) {
      return res.status(400).json({ error: 'Type must be either movie or series' });
    }
    
    const newContent = {
      title,
      desc: description || '',
      img: img || '',
      imgTitle: imgTitle || '',
      imgSm: imgSm || '',
      trailer: trailer || '',
      video: video || '',
      year: year || new Date().getFullYear(),
      limit: limit || 13,
      genre: genre || 'Unknown',
      isSeries: type === 'series'
    };
    
    // Try to create in main backend
    try {
      const response = await axios.post(`${MAIN_BACKEND_URL}/api/movies`, newContent, {
        timeout: 5000,
        headers: {
          'Authorization': req.headers.authorization
        }
      });
      res.status(201).json(response.data);
    } catch (backendError) {
      // Fallback to mock data
      const mockItem = { id: Date.now(), ...newContent, createdAt: new Date() };
      mockContent.push(mockItem);
      res.status(201).json(mockItem);
    }
  } catch (error) {
    console.error('Create content error:', error);
    res.status(500).json({ error: 'Failed to create content' });
  }
};

exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    if (!id || isNaN(id)) {
      return res.status(400).json({ error: 'Invalid content ID' });
    }
    
    // Validate type if provided
    if (updates.type && !['movie', 'series'].includes(updates.type)) {
      return res.status(400).json({ error: 'Type must be either movie or series' });
    }
    
    // Try to update in main backend
    try {
      const response = await axios.put(`${MAIN_BACKEND_URL}/api/movies/${id}`, updates, {
        timeout: 5000
      });
      res.json(response.data);
    } catch (backendError) {
      // Fallback to mock data
      const itemIndex = mockContent.findIndex(c => c.id == id);
      if (itemIndex === -1) {
        return res.status(404).json({ error: 'Content not found' });
      }
      
      mockContent[itemIndex] = { ...mockContent[itemIndex], ...updates };
      res.json(mockContent[itemIndex]);
    }
  } catch (error) {
    console.error('Update content error:', error);
    res.status(500).json({ error: 'Failed to update content' });
  }
};

exports.remove = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!id || isNaN(id)) {
      return res.status(400).json({ error: 'Invalid content ID' });
    }
    
    // Try to delete from main backend
    try {
      await axios.delete(`${MAIN_BACKEND_URL}/api/movies/${id}`, {
        timeout: 5000
      });
      res.json({ message: 'Content deleted successfully' });
    } catch (backendError) {
      // Fallback to mock data
      const itemIndex = mockContent.findIndex(c => c.id == id);
      if (itemIndex === -1) {
        return res.status(404).json({ error: 'Content not found' });
      }
      
      mockContent.splice(itemIndex, 1);
      res.json({ message: 'Content deleted successfully' });
    }
  } catch (error) {
    console.error('Delete content error:', error);
    res.status(500).json({ error: 'Failed to delete content' });
  }
};

exports.setFeatured = async (req, res) => {
  try {
    const { id } = req.params;
    const { featured = true } = req.body;
    
    if (!id || isNaN(id)) {
      return res.status(400).json({ error: 'Invalid content ID' });
    }
    
    // Try to update in main backend
    try {
      const response = await axios.put(`${MAIN_BACKEND_URL}/api/movies/${id}`, { featured }, {
        timeout: 5000
      });
      res.json(response.data);
    } catch (backendError) {
      // Fallback to mock data
      const item = mockContent.find(c => c.id == id);
      if (!item) {
        return res.status(404).json({ error: 'Content not found' });
      }
      
      item.featured = featured;
      res.json(item);
    }
  } catch (error) {
    console.error('Set featured error:', error);
    res.status(500).json({ error: 'Failed to update featured status' });
  }
};

exports.uploadThumbnail = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!id || isNaN(id)) {
      return res.status(400).json({ error: 'Invalid content ID' });
    }
    
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    
    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(req.file.mimetype)) {
      // Clean up uploaded file
      fs.unlinkSync(req.file.path);
      return res.status(400).json({ error: 'Invalid file type. Only JPEG, PNG, and WebP are allowed.' });
    }
    
    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (req.file.size > maxSize) {
      fs.unlinkSync(req.file.path);
      return res.status(400).json({ error: 'File size too large. Maximum 5MB allowed.' });
    }
    
    // Generate a better filename
    const ext = path.extname(req.file.originalname);
    const newFilename = `thumbnail_${id}_${Date.now()}${ext}`;
    const newPath = path.join(path.dirname(req.file.path), newFilename);
    
    // Rename the file
    fs.renameSync(req.file.path, newPath);
    
    const thumbnailUrl = `/uploads/${newFilename}`;
    
    // Try to update in main backend
    try {
      const response = await axios.put(`${MAIN_BACKEND_URL}/api/movies/${id}`, { thumbnail: thumbnailUrl }, {
        timeout: 5000
      });
      res.json({ 
        message: 'Thumbnail uploaded successfully', 
        filename: newFilename,
        url: thumbnailUrl,
        content: response.data
      });
    } catch (backendError) {
      // Fallback to mock data
      const item = mockContent.find(c => c.id == id);
      if (!item) {
        return res.status(404).json({ error: 'Content not found' });
      }
      
      item.thumbnail = thumbnailUrl;
      res.json({ 
        message: 'Thumbnail uploaded successfully', 
        filename: newFilename,
        url: thumbnailUrl,
        content: item
      });
    }
  } catch (error) {
    console.error('Upload thumbnail error:', error);
    
    // Clean up file if upload failed
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    
    res.status(500).json({ error: 'Failed to upload thumbnail' });
  }
};
