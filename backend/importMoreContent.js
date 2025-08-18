// Enhanced TMDB Import Script
// Fetches more movies and series with multiple pages and categories

const axios = require('axios');
const mongoose = require('mongoose');
const Movie = require('./models/movie');
const List = require('./models/list');
const dotenv = require('dotenv');

dotenv.config();

const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

// Enhanced categories for more content
const MOVIE_CATEGORIES = [
  'popular', 'top_rated', 'now_playing', 'upcoming'
];

const TV_CATEGORIES = [
  'popular', 'top_rated', 'on_the_air', 'airing_today'
];

// Genre mappings
const movieGenres = {
  28: 'Action', 12: 'Adventure', 16: 'Animation', 35: 'Comedy', 80: 'Crime',
  99: 'Documentary', 18: 'Drama', 10751: 'Family', 14: 'Fantasy', 36: 'History',
  27: 'Horror', 10402: 'Music', 9648: 'Mystery', 10749: 'Romance', 878: 'Science Fiction',
  10770: 'TV Movie', 53: 'Thriller', 10752: 'War', 37: 'Western'
};

const tvGenres = {
  10759: 'Action & Adventure', 16: 'Animation', 35: 'Comedy', 80: 'Crime',
  99: 'Documentary', 18: 'Drama', 10751: 'Family', 10762: 'Kids',
  9648: 'Mystery', 10763: 'News', 10764: 'Reality', 10765: 'Sci-Fi & Fantasy',
  10766: 'Soap', 10767: 'Talk', 10768: 'War & Politics', 37: 'Western'
};

async function fetchTMDB(type, category, page = 1) {
  try {
    const url = `${TMDB_BASE_URL}/${type}/${category}?api_key=${TMDB_API_KEY}&page=${page}`;
    console.log(`📡 Fetching page ${page}: ${type}/${category}`);
    const res = await axios.get(url);
    return res.data.results;
  } catch (error) {
    console.error(`❌ Error fetching ${type}/${category} page ${page}:`, error.message);
    return [];
  }
}

async function getMovieVideos(movieId) {
  try {
    const url = `${TMDB_BASE_URL}/movie/${movieId}/videos?api_key=${TMDB_API_KEY}`;
    const res = await axios.get(url);
    const trailers = res.data.results.filter(video => 
      video.type === 'Trailer' && video.site === 'YouTube'
    );
    return trailers.length > 0 ? `https://www.youtube.com/watch?v=${trailers[0].key}` : '';
  } catch (error) {
    return '';
  }
}

async function getTVVideos(tvId) {
  try {
    const url = `${TMDB_BASE_URL}/tv/${tvId}/videos?api_key=${TMDB_API_KEY}`;
    const res = await axios.get(url);
    const trailers = res.data.results.filter(video => 
      video.type === 'Trailer' && video.site === 'YouTube'
    );
    return trailers.length > 0 ? `https://www.youtube.com/watch?v=${trailers[0].key}` : '';
  } catch (error) {
    return '';
  }
}

function getGenreNames(genreIds, type) {
  const genreMap = type === 'movie' ? movieGenres : tvGenres;
  return genreIds.map(id => genreMap[id] || 'Unknown').filter(Boolean);
}

async function importMoviesEnhanced(pagesPerCategory = 3) {
  console.log(`🎬 Starting enhanced movie import (${pagesPerCategory} pages per category)...`);
  let totalImported = 0;
  
  for (const category of MOVIE_CATEGORIES) {
    console.log(`\n📋 Processing ${category} movies...`);
    
    for (let page = 1; page <= pagesPerCategory; page++) {
      const movies = await fetchTMDB('movie', category, page);
      
      for (const m of movies) {
        try {
          // Check if movie already exists
          const existingMovie = await Movie.findOne({ tmdbId: m.id });
          if (existingMovie) {
            console.log(`⏭️  Skipping ${m.title} (already exists)`);
            continue;
          }

          // Get trailer
          const trailer = await getMovieVideos(m.id);
          
          // Get genres
          const genres = getGenreNames(m.genre_ids, 'movie');
          
          // Create movie document
          const movie = new Movie({
            tmdbId: m.id,
            title: m.title,
            desc: m.overview || 'No description available.',
            img: `https://image.tmdb.org/t/p/w500${m.poster_path}`,
            imgTitle: m.backdrop_path ? `https://image.tmdb.org/t/p/original${m.backdrop_path}` : '',
            imgSm: `https://image.tmdb.org/t/p/w300${m.poster_path}`,
            trailer: trailer,
            year: m.release_date ? new Date(m.release_date).getFullYear() : new Date().getFullYear(),
            limit: Math.floor(Math.random() * 3) + 13, // Random age rating 13-16
            genre: genres[0] || 'Drama',
            isSeries: false,
            rating: m.vote_average || 0,
            duration: Math.floor(Math.random() * 60) + 90, // Random duration 90-150 mins
            // TMDB specific fields
            backdrop_path: m.backdrop_path,
            poster_path: m.poster_path,
            release_date: m.release_date,
            vote_average: m.vote_average,
            vote_count: m.vote_count,
            popularity: m.popularity,
            genres: genres,
            overview: m.overview
          });

          await movie.save();
          console.log(`✅ Saved: ${m.title} (${movie.year})`);
          totalImported++;
          
          // Small delay to avoid rate limiting
          await new Promise(resolve => setTimeout(resolve, 100));
          
        } catch (error) {
          console.error(`❌ Error saving ${m.title}:`, error.message);
        }
      }
      
      // Delay between pages
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  }
  
  console.log(`🎉 Imported ${totalImported} movies successfully!`);
  return totalImported;
}

async function importSeriesEnhanced(pagesPerCategory = 2) {
  console.log(`📺 Starting enhanced TV series import (${pagesPerCategory} pages per category)...`);
  let totalImported = 0;
  
  for (const category of TV_CATEGORIES) {
    console.log(`\n📋 Processing ${category} TV series...`);
    
    for (let page = 1; page <= pagesPerCategory; page++) {
      const series = await fetchTMDB('tv', category, page);
      
      for (const s of series) {
        try {
          // Check if series already exists
          const existingSeries = await Movie.findOne({ tmdbId: s.id, isSeries: true });
          if (existingSeries) {
            console.log(`⏭️  Skipping ${s.name} (already exists)`);
            continue;
          }

          // Get trailer
          const trailer = await getTVVideos(s.id);
          
          // Get genres
          const genres = getGenreNames(s.genre_ids, 'tv');
          
          // Create series document
          const series_doc = new Movie({
            tmdbId: s.id,
            title: s.name,
            desc: s.overview || 'No description available.',
            img: `https://image.tmdb.org/t/p/w500${s.poster_path}`,
            imgTitle: s.backdrop_path ? `https://image.tmdb.org/t/p/original${s.backdrop_path}` : '',
            imgSm: `https://image.tmdb.org/t/p/w300${s.poster_path}`,
            trailer: trailer,
            year: s.first_air_date ? new Date(s.first_air_date).getFullYear() : new Date().getFullYear(),
            limit: Math.floor(Math.random() * 3) + 13, // Random age rating 13-16
            genre: genres[0] || 'Drama',
            isSeries: true,
            rating: s.vote_average || 0,
            duration: Math.floor(Math.random() * 30) + 30, // Random episode duration 30-60 mins
            // TMDB specific fields
            backdrop_path: s.backdrop_path,
            poster_path: s.poster_path,
            first_air_date: s.first_air_date,
            vote_average: s.vote_average,
            vote_count: s.vote_count,
            popularity: s.popularity,
            genres: genres,
            overview: s.overview,
            name: s.name
          });

          await series_doc.save();
          console.log(`✅ Saved: ${s.name} (${series_doc.year})`);
          totalImported++;
          
          // Small delay to avoid rate limiting
          await new Promise(resolve => setTimeout(resolve, 100));
          
        } catch (error) {
          console.error(`❌ Error saving ${s.name}:`, error.message);
        }
      }
      
      // Delay between pages
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  }
  
  console.log(`🎉 Imported ${totalImported} TV series successfully!`);
  return totalImported;
}

async function main() {
  try {
    console.log('🚀 Starting ENHANCED TMDB import...');
    console.log('📊 This will fetch multiple pages from multiple categories');
    
    // Connect to MongoDB
    await mongoose.connect(process.env.URL_MONGO);
    console.log('✅ Connected to MongoDB');

    // Import movies and series with multiple pages
    const moviesImported = await importMoviesEnhanced(3); // 3 pages per category
    const seriesImported = await importSeriesEnhanced(2);  // 2 pages per category
    
    console.log('\n🎉 ENHANCED IMPORT COMPLETED!');
    console.log(`📊 SUMMARY:`);
    console.log(`   🎬 Movies imported: ${moviesImported}`);
    console.log(`   📺 Series imported: ${seriesImported}`);
    console.log(`   🎯 Total content: ${moviesImported + seriesImported}`);
    
  } catch (error) {
    console.error('❌ Import failed:', error);
  } finally {
    await mongoose.disconnect();
    console.log('👋 Disconnected from MongoDB');
    process.exit(0);
  }
}

// Run if called directly
if (require.main === module) {
  main().catch(error => {
    console.error('❌ Fatal error:', error);
    process.exit(1);
  });
}
