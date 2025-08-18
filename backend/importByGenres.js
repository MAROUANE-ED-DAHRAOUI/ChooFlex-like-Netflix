// Genre-specific TMDB Import Script
// Fetches content from specific genres

const axios = require('axios');
const mongoose = require('mongoose');
const Movie = require('./models/movie');
const dotenv = require('dotenv');

dotenv.config();

const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

// Popular genre IDs
const POPULAR_GENRES = {
  movies: {
    28: 'Action',
    35: 'Comedy', 
    18: 'Drama',
    27: 'Horror',
    878: 'Science Fiction',
    53: 'Thriller',
    10749: 'Romance',
    16: 'Animation'
  },
  tv: {
    10759: 'Action & Adventure',
    35: 'Comedy',
    18: 'Drama',
    80: 'Crime',
    10765: 'Sci-Fi & Fantasy'
  }
};

async function fetchByGenre(type, genreId, pages = 2) {
  const results = [];
  
  for (let page = 1; page <= pages; page++) {
    try {
      const url = `${TMDB_BASE_URL}/discover/${type}?api_key=${TMDB_API_KEY}&with_genres=${genreId}&page=${page}&sort_by=popularity.desc`;
      console.log(`🎯 Fetching ${type} genre ${genreId}, page ${page}`);
      
      const res = await axios.get(url);
      results.push(...res.data.results);
      
      // Delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 500));
    } catch (error) {
      console.error(`❌ Error fetching genre ${genreId}:`, error.message);
    }
  }
  
  return results;
}

async function importByGenres() {
  try {
    console.log('🎭 Starting genre-based import...');
    
    await mongoose.connect(process.env.URL_MONGO);
    console.log('✅ Connected to MongoDB');

    let totalImported = 0;

    // Import movies by genre
    for (const [genreId, genreName] of Object.entries(POPULAR_GENRES.movies)) {
      console.log(`\n🎬 Importing ${genreName} movies...`);
      const movies = await fetchByGenre('movie', genreId, 2);
      
      for (const movie of movies) {
        // Check if exists
        const existing = await Movie.findOne({ tmdbId: movie.id });
        if (!existing) {
          try {
            const newMovie = new Movie({
              tmdbId: movie.id,
              title: movie.title,
              desc: movie.overview || 'No description available.',
              img: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
              imgTitle: movie.backdrop_path ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}` : '',
              imgSm: `https://image.tmdb.org/t/p/w300${movie.poster_path}`,
              year: movie.release_date ? new Date(movie.release_date).getFullYear() : new Date().getFullYear(),
              genre: genreName,
              isSeries: false,
              rating: movie.vote_average || 0,
              limit: Math.floor(Math.random() * 3) + 13,
              backdrop_path: movie.backdrop_path,
              poster_path: movie.poster_path,
              overview: movie.overview
            });
            
            await newMovie.save();
            console.log(`✅ Saved: ${movie.title}`);
            totalImported++;
          } catch (error) {
            console.error(`❌ Error saving ${movie.title}:`, error.message);
          }
        }
      }
    }

    // Import TV series by genre
    for (const [genreId, genreName] of Object.entries(POPULAR_GENRES.tv)) {
      console.log(`\n📺 Importing ${genreName} series...`);
      const series = await fetchByGenre('tv', genreId, 2);
      
      for (const show of series) {
        // Check if exists
        const existing = await Movie.findOne({ tmdbId: show.id, isSeries: true });
        if (!existing) {
          try {
            const newSeries = new Movie({
              tmdbId: show.id,
              title: show.name,
              desc: show.overview || 'No description available.',
              img: `https://image.tmdb.org/t/p/w500${show.poster_path}`,
              imgTitle: show.backdrop_path ? `https://image.tmdb.org/t/p/original${show.backdrop_path}` : '',
              imgSm: `https://image.tmdb.org/t/p/w300${show.poster_path}`,
              year: show.first_air_date ? new Date(show.first_air_date).getFullYear() : new Date().getFullYear(),
              genre: genreName,
              isSeries: true,
              rating: show.vote_average || 0,
              limit: Math.floor(Math.random() * 3) + 13,
              backdrop_path: show.backdrop_path,
              poster_path: show.poster_path,
              overview: show.overview,
              name: show.name
            });
            
            await newSeries.save();
            console.log(`✅ Saved: ${show.name}`);
            totalImported++;
          } catch (error) {
            console.error(`❌ Error saving ${show.name}:`, error.message);
          }
        }
      }
    }

    console.log(`\n🎉 Genre import completed! Total imported: ${totalImported}`);
    
  } catch (error) {
    console.error('❌ Import failed:', error);
  } finally {
    await mongoose.disconnect();
    console.log('👋 Disconnected from MongoDB');
  }
}

if (require.main === module) {
  importByGenres();
}
