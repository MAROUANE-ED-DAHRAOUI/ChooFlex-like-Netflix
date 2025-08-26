// routes/search.js
const express = require('express');
const axios = require('axios');
const Movie = require('../models/movie');
const router = express.Router();

// Search movies and TV shows
router.get('/', async (req, res) => {
  try {
    const { query } = req.query;
    
    if (!query || query.trim() === '') {
      return res.status(400).json({ error: 'Query parameter is required' });
    }

    const TMDB_API_KEY = process.env.TMDB_API_KEY;
    const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

    let tmdbResults = [];

    // Try TMDB search if API key is available
    if (TMDB_API_KEY) {
      try {
        const tmdbResponse = await axios.get(`${TMDB_BASE_URL}/search/multi`, {
          params: {
            api_key: TMDB_API_KEY,
            query: query.trim(),
            page: 1
          },
          headers: {
            'Accept': 'application/json'
          }
        });

        const results = tmdbResponse.data.results || [];
        
        // Filter and format results (only movies and TV shows)
        tmdbResults = results
          .filter(item => item.media_type === 'movie' || item.media_type === 'tv')
          .slice(0, 20) // Limit to 20 results
          .map(item => ({
            _id: `search_${item.media_type}_${item.id}`,
            tmdbId: item.id,
            title: item.media_type === 'movie' ? item.title : item.name,
            desc: item.overview || 'No description available',
            img: item.poster_path ? `https://image.tmdb.org/t/p/w500${item.poster_path}` : '',
            imgTitle: item.backdrop_path ? `https://image.tmdb.org/t/p/w1280${item.backdrop_path}` : '',
            imgSm: item.poster_path ? `https://image.tmdb.org/t/p/w300${item.poster_path}` : '',
            year: item.media_type === 'movie' 
              ? (item.release_date ? item.release_date.slice(0, 4) : '2024')
              : (item.first_air_date ? item.first_air_date.slice(0, 4) : '2024'),
            limit: item.adult ? 18 : 13,
            genre: 'Search Result',
            isSeries: item.media_type === 'tv',
            popularity: item.popularity,
            vote_average: item.vote_average
          }));
      } catch (tmdbError) {
        console.log('TMDB search failed, continuing with local search only:', tmdbError.message);
      }
    }

    // Search local database for any matches
    const localResults = await Movie.find({
      $or: [
        { title: { $regex: query.trim(), $options: 'i' } },
        { desc: { $regex: query.trim(), $options: 'i' } },
        { genre: { $regex: query.trim(), $options: 'i' } }
      ]
    }).limit(10);

    // Combine results (prioritize local database results)
    const combinedResults = [
      ...localResults,
      ...tmdbResults.filter(tmdbItem => 
        !localResults.some(localItem => localItem.tmdbId === tmdbItem.tmdbId)
      )
    ];

    res.json({
      query: query.trim(),
      total_results: combinedResults.length,
      results: combinedResults,
      sources: {
        local: localResults.length,
        tmdb: tmdbResults.length
      }
    });

  } catch (error) {
    console.error('Search error:', error.message);
    res.status(500).json({ error: 'Failed to search movies and TV shows' });
  }
});

module.exports = router;
