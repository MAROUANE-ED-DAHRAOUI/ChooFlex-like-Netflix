const axios = require('axios');
const path = require('path');
const fs = require('fs');

const MAIN_BACKEND_URL = process.env.MAIN_BACKEND_URL || 'http://localhost:5000';

// Fallback data for when main backend is unavailable
let mockContent = [
  { id: 1, title: 'Inception', type: 'movie', featured: false, genre: 'Sci-Fi', year: 2010 },
  { id: 2, title: 'Breaking Bad', type: 'series', featured: true, genre: 'Drama', year: 2008 }
];

exports.list = async (req, res) => {
  try {
    // Try to fetch from main backend
    try {
      const response = await axios.get(`${MAIN_BACKEND_URL}/api/movies`, {
        timeout: 5000
      });
      res.json(response.data);
    } catch (backendError) {
      // Fallback to mock data
      console.warn('Failed to fetch content from main backend, using mock data:', backendError.message);
      res.json(mockContent);
    }
  } catch (error) {
    console.error('List content error:', error);
    res.status(500).json({ error: 'Failed to fetch content' });
  }
};

exports.create = async (req, res) => {
  try {
    const { title, type, genre, year, description } = req.body;
    
    // Basic validation
    if (!title || !type) {
      return res.status(400).json({ error: 'Title and type are required' });
    }
    
    if (!['movie', 'series'].includes(type)) {
      return res.status(400).json({ error: 'Type must be either movie or series' });
    }
    
    const newContent = {
      title,
      type,
      genre: genre || 'Unknown',
      year: year || new Date().getFullYear(),
      description: description || '',
      featured: false,
      createdAt: new Date()
    };
    
    // Try to create in main backend
    try {
      const response = await axios.post(`${MAIN_BACKEND_URL}/api/movies`, newContent, {
        timeout: 5000
      });
      res.status(201).json(response.data);
    } catch (backendError) {
      // Fallback to mock data
      const mockItem = { id: Date.now(), ...newContent };
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
