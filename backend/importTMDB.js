// importTMDB.js
// Script to fetch movies/series from TMDB and insert into MongoDB

const axios = require('axios');
const mongoose = require('mongoose');
const Movie = require('./models/movie');
const Series = require('./models/list'); // Adjust if you have a separate series model

// === CONFIG ===
const TMDB_API_KEY = 'bad681b6698bb5a142ce43f232666c98';
const TMDB_READ_TOKEN = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJiYWQ2ODFiNjY5OGJiNWExNDJjZTQzZjIzMjY2NmM5OCIsIm5iZiI6MTc1NTQzMDcyMi44MzAwMDAyLCJzdWIiOiI2OGExYmY0MjFkNzE0YzAwN2FlOTRhZDgiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.8NVrYLuzkDCWF6JHZkLbxk5OkkuyRXKUjemQNgOztro';
const dotenv = require('dotenv');
dotenv.config();
const MONGO_URI = process.env.URL_MONGO;

// === TMDB API ===
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

async function fetchTMDB(type = 'movie', page = 1) {
  const url = `${TMDB_BASE_URL}/${type}/popular?api_key=${TMDB_API_KEY}&page=${page}`;
  const res = await axios.get(url);
  return res.data.results;
}

async function importMovies() {
  await mongoose.connect(MONGO_URI);
  console.log('Connected to MongoDB');
  const movies = await fetchTMDB('movie', 1);
  for (const m of movies) {
    const doc = new Movie({
      title: m.title,
      description: m.overview,
      imgtitle: m.backdrop_path ? `https://image.tmdb.org/t/p/w500${m.backdrop_path}` : '',
      imgSmall: m.poster_path ? `https://image.tmdb.org/t/p/w200${m.poster_path}` : '',
      trailer: '', // TMDB does not provide trailer in this endpoint
      video: '', // TMDB does not provide video in this endpoint
      year: m.release_date ? m.release_date.slice(0,4) : '',
      limit: 13, // Default age limit
      genre: Array.isArray(m.genre_ids) ? m.genre_ids.join(',') : '',
      isSeries: false
    });
    await doc.save();
    console.log('Saved:', m.title);
  }
  mongoose.disconnect();
}

async function importSeries() {
  await mongoose.connect(MONGO_URI);
  console.log('Connected to MongoDB');
  const series = await fetchTMDB('tv', 1);
  for (const s of series) {
    const doc = new Movie({
      title: s.name,
      description: s.overview,
      imgtitle: s.backdrop_path ? `https://image.tmdb.org/t/p/w500${s.backdrop_path}` : '',
      imgSmall: s.poster_path ? `https://image.tmdb.org/t/p/w200${s.poster_path}` : '',
      trailer: '',
      video: '',
      year: s.first_air_date ? s.first_air_date.slice(0,4) : '',
      limit: 13,
      genre: Array.isArray(s.genre_ids) ? s.genre_ids.join(',') : '',
      isSeries: true
    });
    await doc.save();
    console.log('Saved:', s.name);
  }
  mongoose.disconnect();
}

// === USAGE ===
// node importTMDB.js movies
// node importTMDB.js series

const arg = process.argv[2];
if (arg === 'movies') {
  importMovies();
} else if (arg === 'series') {
  importSeries();
} else {
  console.log('Usage: node importTMDB.js [movies|series]');
}
