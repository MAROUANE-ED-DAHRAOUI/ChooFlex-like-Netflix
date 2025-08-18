// importTMDB.js
// Script to fetch movies/series from TMDB and insert into MongoDB

const axios = require('axios');
const mongoose = require('mongoose');
const Movie = require('./models/movie');
const List = require('./models/list');
const dotenv = require('dotenv');

dotenv.config();

// === CONFIG ===
const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_READ_TOKEN = process.env.TMDB_READ_TOKEN;
const MONGO_URI = process.env.URL_MONGO;

if (!TMDB_API_KEY || !TMDB_READ_TOKEN) {
  console.error('ERROR: TMDB credentials not found in .env file');
  process.exit(1);
}

// === TMDB API ===
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

async function fetchTMDB(type = 'movie', category = 'popular', page = 1) {
  try {
    const url = `${TMDB_BASE_URL}/${type}/${category}?api_key=${TMDB_API_KEY}&page=${page}`;
    console.log(`Fetching: ${url}`);
    const res = await axios.get(url);
    return res.data.results;
  } catch (error) {
    console.error(`Error fetching ${type} ${category}:`, error.message);
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
    console.error(`Error fetching videos for movie ${movieId}:`, error.message);
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
    console.error(`Error fetching videos for TV ${tvId}:`, error.message);
    return '';
  }
}

// Genre mapping
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

function getGenreNames(genreIds, type) {
  const genreMap = type === 'movie' ? movieGenres : tvGenres;
  return genreIds.map(id => genreMap[id] || 'Unknown').filter(Boolean);
}

async function importMovies(limit = 20) {
  console.log('🎬 Starting to import movies...');
  
  const categories = ['popular', 'top_rated', 'now_playing'];
  let totalImported = 0;
  
  for (const category of categories) {
    console.log(`\n📋 Fetching ${category} movies...`);
    const movies = await fetchTMDB('movie', category, 1);
    
    for (const m of movies.slice(0, Math.ceil(limit / categories.length))) {
      try {
        // Check if movie already exists
        const existingMovie = await Movie.findOne({ tmdbId: m.id });
        if (existingMovie) {
          console.log(`⏭️  Skipping ${m.title} (already exists)`);
          continue;
        }

        const trailer = await getMovieVideos(m.id);
        
        // Use sample video files for demo purposes (since we don't have actual movie files)
        const sampleVideos = [
          'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
          'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
          'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
          'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
          'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4'
        ];
        
        const randomSampleVideo = sampleVideos[Math.floor(Math.random() * sampleVideos.length)];
        
        const doc = new Movie({
          tmdbId: m.id,
          title: m.title,
          desc: m.overview || 'No description available',
          img: m.poster_path ? `https://image.tmdb.org/t/p/w500${m.poster_path}` : '',
          imgTitle: m.backdrop_path ? `https://image.tmdb.org/t/p/w1280${m.backdrop_path}` : '',
          imgSm: m.poster_path ? `https://image.tmdb.org/t/p/w300${m.poster_path}` : '',
          trailer: trailer, // Keep YouTube trailer for reference
          video: randomSampleVideo, // Use sample MP4 for actual playback
          year: m.release_date ? m.release_date.slice(0, 4) : '2024',
          limit: m.adult ? 18 : 13,
          genre: m.genre_ids && m.genre_ids.length > 0 ? getGenreNames(m.genre_ids, 'movie').join(', ') : 'Unknown',
          isSeries: false
        });
        
        await doc.save();
        totalImported++;
        console.log(`✅ Saved: ${m.title} (${doc.year})`);
        
        // Small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 100));
        
      } catch (error) {
        console.error(`❌ Error saving ${m.title}:`, error.message);
      }
    }
  }
  
  console.log(`\n🎉 Imported ${totalImported} movies successfully!`);
}

async function importSeries(limit = 20) {
  console.log('📺 Starting to import TV series...');
  
  const categories = ['popular', 'top_rated', 'on_the_air'];
  let totalImported = 0;
  
  for (const category of categories) {
    console.log(`\n📋 Fetching ${category} TV series...`);
    const series = await fetchTMDB('tv', category, 1);
    
    for (const s of series.slice(0, Math.ceil(limit / categories.length))) {
      try {
        // Check if series already exists
        const existingSeries = await Movie.findOne({ tmdbId: s.id, isSeries: true });
        if (existingSeries) {
          console.log(`⏭️  Skipping ${s.name} (already exists)`);
          continue;
        }

        const trailer = await getTVVideos(s.id);
        
        // Use sample video files for demo purposes
        const sampleVideos = [
          'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
          'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
          'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
          'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
          'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4'
        ];
        
        const randomSampleVideo = sampleVideos[Math.floor(Math.random() * sampleVideos.length)];
        
        const doc = new Movie({
          tmdbId: s.id,
          title: s.name,
          desc: s.overview || 'No description available',
          img: s.poster_path ? `https://image.tmdb.org/t/p/w500${s.poster_path}` : '',
          imgTitle: s.backdrop_path ? `https://image.tmdb.org/t/p/w1280${s.backdrop_path}` : '',
          imgSm: s.poster_path ? `https://image.tmdb.org/t/p/w300${s.poster_path}` : '',
          trailer: trailer, // Keep YouTube trailer for reference  
          video: randomSampleVideo, // Use sample MP4 for actual playback
          year: s.first_air_date ? s.first_air_date.slice(0, 4) : '2024',
          limit: s.adult ? 18 : 13,
          genre: s.genre_ids && s.genre_ids.length > 0 ? getGenreNames(s.genre_ids, 'tv').join(', ') : 'Unknown',
          isSeries: true
        });
        
        await doc.save();
        totalImported++;
        console.log(`✅ Saved: ${s.name} (${doc.year})`);
        
        // Small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 100));
        
      } catch (error) {
        console.error(`❌ Error saving ${s.name}:`, error.message);
      }
    }
  }
  
  console.log(`\n🎉 Imported ${totalImported} TV series successfully!`);
}

async function createContentLists() {
  console.log('📚 Creating content lists...');
  
  try {
    // Get some movies and series for lists
    const actionMovies = await Movie.find({ 
      isSeries: false, 
      genre: { $regex: /Action/i } 
    }).limit(10);
    
    const comedyMovies = await Movie.find({ 
      isSeries: false, 
      genre: { $regex: /Comedy/i } 
    }).limit(10);
    
    const dramaMovies = await Movie.find({ 
      isSeries: false, 
      genre: { $regex: /Drama/i } 
    }).limit(10);
    
    const allSeries = await Movie.find({ isSeries: true }).limit(10);

    // Create lists
    const lists = [
      {
        title: "Action Movies",
        type: "movie",
        genre: "action",
        content: actionMovies.map(m => m._id)
      },
      {
        title: "Comedy Movies", 
        type: "movie",
        genre: "comedy",
        content: comedyMovies.map(m => m._id)
      },
      {
        title: "Drama Movies",
        type: "movie", 
        genre: "drama",
        content: dramaMovies.map(m => m._id)
      },
      {
        title: "Popular Series",
        type: "series",
        genre: "drama", 
        content: allSeries.map(s => s._id)
      }
    ];

    for (const listData of lists) {
      if (listData.content.length > 0) {
        // Check if list already exists
        const existingList = await List.findOne({ title: listData.title });
        if (!existingList) {
          const list = new List(listData);
          await list.save();
          console.log(`✅ Created list: ${listData.title} (${listData.content.length} items)`);
        } else {
          console.log(`⏭️  List already exists: ${listData.title}`);
        }
      }
    }

    console.log('🎉 Content lists created successfully!');
  } catch (error) {
    console.error('❌ Error creating lists:', error.message);
  }
}

async function main() {
  try {
    console.log('🚀 Starting TMDB data import...');
    
    // Connect to MongoDB
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Import movies and series
    await importMovies(30); // Import 30 movies
    await importSeries(20);  // Import 20 TV series
    
    // Create content lists
    await createContentLists();
    
    console.log('\n🎉 All data imported successfully!');
    console.log('🔍 Check your database for the new content.');
    
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

module.exports = {
  importMovies,
  importSeries,
  createContentLists,
  main
};
