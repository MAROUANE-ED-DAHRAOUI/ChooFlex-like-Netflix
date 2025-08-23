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
