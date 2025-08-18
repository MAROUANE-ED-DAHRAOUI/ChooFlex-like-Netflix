// addLegalMovies.js
// Script to add public domain and creative commons movies with full video content

const mongoose = require('mongoose');
const Movie = require('./models/movie');
const List = require('./models/list');
const dotenv = require('dotenv');

dotenv.config();

const MONGO_URI = process.env.URL_MONGO;

// Public domain and Creative Commons movies with full video links
const legalMovies = [
  {
    title: "Big Buck Bunny",
    desc: "A large and lovable rabbit deals with three tiny bullies, led by a flying squirrel, who are determined to squelch his happiness.",
    img: "https://via.placeholder.com/500x750/1a1a1a/ffffff?text=Big+Buck+Bunny",
    imgTitle: "https://via.placeholder.com/1280x720/1a1a1a/ffffff?text=Big+Buck+Bunny", 
    imgSm: "https://via.placeholder.com/300x450/1a1a1a/ffffff?text=Big+Buck+Bunny",
    trailer: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    video: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    year: "2008",
    limit: 0,
    genre: "Animation, Comedy",
    isSeries: false,
    tmdbId: 999001 // Fake ID for tracking
  },
  {
    title: "Elephant's Dream",
    desc: "Two strange characters explore a capricious and seemingly infinite machine.",
    img: "https://via.placeholder.com/500x750/2a2a2a/ffffff?text=Elephants+Dream",
    imgTitle: "https://via.placeholder.com/1280x720/2a2a2a/ffffff?text=Elephants+Dream",
    imgSm: "https://via.placeholder.com/300x450/2a2a2a/ffffff?text=Elephants+Dream", 
    trailer: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
    video: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
    year: "2006",
    limit: 13,
    genre: "Animation, Sci-Fi",
    isSeries: false,
    tmdbId: 999002
  },
  {
    title: "Sintel",
    desc: "A lonely young woman, Sintel, helps and befriends a dragon, whom she calls Scales.",
    img: "https://via.placeholder.com/500x750/3a3a3a/ffffff?text=Sintel",
    imgTitle: "https://via.placeholder.com/1280x720/3a3a3a/ffffff?text=Sintel",
    imgSm: "https://via.placeholder.com/300x450/3a3a3a/ffffff?text=Sintel",
    trailer: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
    video: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
    year: "2010", 
    limit: 13,
    genre: "Animation, Fantasy",
    isSeries: false,
    tmdbId: 999003
  },
  {
    title: "Tears of Steel",
    desc: "He just wanted to be awesome in space.",
    img: "https://via.placeholder.com/500x750/4a4a4a/ffffff?text=Tears+of+Steel",
    imgTitle: "https://via.placeholder.com/1280x720/4a4a4a/ffffff?text=Tears+of+Steel",
    imgSm: "https://via.placeholder.com/300x450/4a4a4a/ffffff?text=Tears+of+Steel",
    trailer: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
    video: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
    year: "2012",
    limit: 13,
    genre: "Sci-Fi, Action",
    isSeries: false,
    tmdbId: 999004
  },
  {
    title: "We Are Going on Bullrun",
    desc: "Adventure documentary following a group of car enthusiasts.",
    img: "https://via.placeholder.com/500x750/5a5a5a/ffffff?text=We+Are+Going+on+Bullrun",
    imgTitle: "https://via.placeholder.com/1280x720/5a5a5a/ffffff?text=We+Are+Going+on+Bullrun",
    imgSm: "https://via.placeholder.com/300x450/5a5a5a/ffffff?text=We+Are+Going+on+Bullrun",
    trailer: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4",
    video: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4",
    year: "2015",
    limit: 13,
    genre: "Documentary",
    isSeries: false,
    tmdbId: 999005
  }
];

async function addLegalMovies() {
  try {
    console.log('🎬 Adding legal full movies...');
    
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB');

    let addedCount = 0;

    for (const movieData of legalMovies) {
      try {
        // Check if movie already exists
        const existingMovie = await Movie.findOne({ tmdbId: movieData.tmdbId });
        if (existingMovie) {
          console.log(`⏭️  Skipping ${movieData.title} (already exists)`);
          continue;
        }

        const movie = new Movie(movieData);
        await movie.save();
        addedCount++;
        console.log(`✅ Added: ${movieData.title} (${movieData.year}) - FULL VIDEO AVAILABLE`);

      } catch (error) {
        console.error(`❌ Error adding ${movieData.title}:`, error.message);
      }
    }

    console.log(`\n🎉 Added ${addedCount} legal full movies!`);

    // Update lists with new content
    await updateListsWithLegalMovies();

  } catch (error) {
    console.error('❌ Failed to add legal movies:', error);
  } finally {
    await mongoose.disconnect();
    console.log('👋 Disconnected from MongoDB');
  }
}

async function updateListsWithLegalMovies() {
  console.log('📝 Updating lists with legal movies...');
  
  try {
    // Get the new legal movies
    const legalMovieIds = await Movie.find({ 
      tmdbId: { $gte: 999001, $lte: 999010 } 
    }).select('_id');

    // Find or create "Full Movies" list
    let fullMoviesList = await List.findOne({ title: "Full Movies Available" });
    
    if (!fullMoviesList) {
      fullMoviesList = new List({
        title: "Full Movies Available",
        type: "movie",
        genre: "all",
        content: legalMovieIds.map(m => m._id)
      });
      await fullMoviesList.save();
      console.log(`✅ Created "Full Movies Available" list (${legalMovieIds.length} items)`);
    } else {
      // Add new movies to existing list
      const newIds = legalMovieIds.filter(id => !fullMoviesList.content.includes(id._id));
      fullMoviesList.content.push(...newIds.map(m => m._id));
      await fullMoviesList.save();
      console.log(`✅ Updated "Full Movies Available" list (+${newIds.length} items)`);
    }

  } catch (error) {
    console.error('❌ Error updating lists:', error.message);
  }
}

if (require.main === module) {
  addLegalMovies().catch(error => {
    console.error('❌ Fatal error:', error);
    process.exit(1);
  });
}

module.exports = { addLegalMovies };
