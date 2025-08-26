exports.list = async (req, res) => {
  try {
    const mockContent = [
      { id: 1, title: 'Inception', type: 'movie', featured: false },
      { id: 2, title: 'Breaking Bad', type: 'series', featured: true }
    ];
    
    res.json({
      status: 'success',
      data: { content: mockContent, total: mockContent.length }
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

exports.create = async (req, res) => {
  try {
    res.status(201).json({ status: 'success', data: { content: req.body } });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

exports.update = async (req, res) => {
  try {
    res.json({ status: 'success', data: { content: req.body } });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

exports.remove = async (req, res) => {
  try {
    res.json({ status: 'success', message: 'Content deleted successfully' });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

exports.setFeatured = async (req, res) => {
  try {
    res.json({ status: 'success', message: 'Featured status updated' });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

exports.uploadThumbnail = async (req, res) => {
  try {
    res.json({ status: 'success', message: 'Thumbnail uploaded successfully' });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

exports.search = async (req, res) => {
  try {
    const { query } = req.query;
    const mockResults = [
      { id: 1, title: 'Inception', type: 'movie', featured: false },
      { id: 2, title: 'Interstellar', type: 'movie', featured: true }
    ];
    
    res.json({
      status: 'success',
      data: { content: mockResults, total: mockResults.length }
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

exports.getStats = async (req, res) => {
  try {
    const mockStats = {
      totalContent: 150,
      movies: 85,
      series: 65,
      featured: 12,
      recentlyAdded: 8
    };
    
    res.json({
      status: 'success',
      data: mockStats
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const { id } = req.params;
    const mockContent = {
      id: parseInt(id),
      title: 'Sample Content',
      type: 'movie',
      description: 'Sample description',
      featured: false,
      thumbnail: null,
      createdAt: new Date().toISOString()
    };
    
    res.json({
      status: 'success',
      data: { content: mockContent }
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};
