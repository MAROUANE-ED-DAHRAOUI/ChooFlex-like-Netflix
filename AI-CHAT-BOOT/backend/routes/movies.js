const express = require('express');
const axios = require('axios');
const router = express.Router();

// Proxy route to get movies from Main App
router.get('/', async (req, res) => {
  try {
    const response = await axios.get(`${process.env.MAIN_APP_API}/movies`);
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching movies:', error.message);
    res.status(500).json({ 
      error: 'Failed to fetch movies',
      details: error.message 
    });
  }
});

// Get series from Main App
router.get('/series', async (req, res) => {
  try {
    const response = await axios.get(`${process.env.MAIN_APP_API}/series`);
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching series:', error.message);
    res.status(500).json({ 
      error: 'Failed to fetch series',
      details: error.message 
    });
  }
});

// Search movies and series
router.get('/search', async (req, res) => {
  try {
    const { q } = req.query;
    
    if (!q) {
      return res.status(400).json({ error: 'Search query is required' });
    }

    const [moviesResponse, seriesResponse] = await Promise.all([
      axios.get(`${process.env.MAIN_APP_API}/movies`),
      axios.get(`${process.env.MAIN_APP_API}/series`)
    ]);

    const movies = moviesResponse.data || [];
    const series = seriesResponse.data || [];

    // Simple search implementation
    const searchTerm = q.toLowerCase();
    
    const filteredMovies = movies.filter(movie => 
      movie.title.toLowerCase().includes(searchTerm) ||
      movie.genre.toLowerCase().includes(searchTerm) ||
      (movie.desc && movie.desc.toLowerCase().includes(searchTerm))
    );

    const filteredSeries = series.filter(serie => 
      serie.title.toLowerCase().includes(searchTerm) ||
      serie.genre.toLowerCase().includes(searchTerm) ||
      (serie.desc && serie.desc.toLowerCase().includes(searchTerm))
    );

    res.json({
      query: q,
      results: {
        movies: filteredMovies,
        series: filteredSeries,
        total: filteredMovies.length + filteredSeries.length
      }
    });

  } catch (error) {
    console.error('Search error:', error.message);
    res.status(500).json({ 
      error: 'Failed to search content',
      details: error.message 
    });
  }
});

module.exports = router;
