// cleanupDatabase.js
// Script to remove test/mock data and keep only real TMDB content

const mongoose = require('mongoose');
const Movie = require('./models/movie');
const List = require('./models/list');
const dotenv = require('dotenv');

dotenv.config();

const MONGO_URI = process.env.URL_MONGO;

async function cleanupDatabase() {
  try {
    console.log('🧹 Starting database cleanup...');
    
    // Connect to MongoDB
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Get all movies/series before cleanup
    const totalBefore = await Movie.countDocuments();
    console.log(`📊 Total content before cleanup: ${totalBefore}`);

    // Remove test/mock movies (those without tmdbId or with specific test patterns)
    const testMoviesResult = await Movie.deleteMany({
      $or: [
        { tmdbId: { $exists: false } }, // No TMDB ID
        { tmdbId: null }, // Null TMDB ID
        { title: { $regex: /^(test|mock|sample)/i } }, // Test titles
        { desc: { $regex: /test|mock|sample/i } }, // Test descriptions
        { img: { $regex: /placeholder/i } }, // Placeholder images
        { video: { $regex: /placeholder|test/i } }, // Test videos
        { trailer: { $regex: /placeholder|test/i } } // Test trailers
      ]
    });

    console.log(`🗑️  Removed ${testMoviesResult.deletedCount} test/mock movies`);

    // Get remaining content count
    const totalAfter = await Movie.countDocuments();
    const realTMDBContent = await Movie.countDocuments({ tmdbId: { $exists: true, $ne: null } });
    
    console.log(`📊 Total content after cleanup: ${totalAfter}`);
    console.log(`🎬 Real TMDB content: ${realTMDBContent}`);

    // Clean up empty lists or lists with invalid content
    const lists = await List.find();
    let listsUpdated = 0;
    let listsRemoved = 0;

    for (const list of lists) {
      // Check if content items still exist
      const validContent = [];
      
      for (const contentId of list.content) {
        const movie = await Movie.findById(contentId);
        if (movie) {
          validContent.push(contentId);
        }
      }

      if (validContent.length === 0) {
        // Remove empty lists
        await List.findByIdAndDelete(list._id);
        listsRemoved++;
        console.log(`🗑️  Removed empty list: ${list.title}`);
      } else if (validContent.length !== list.content.length) {
        // Update lists with valid content only
        await List.findByIdAndUpdate(list._id, { content: validContent });
        listsUpdated++;
        console.log(`🔄 Updated list "${list.title}": ${list.content.length} → ${validContent.length} items`);
      }
    }

    console.log(`📝 Updated ${listsUpdated} lists`);
    console.log(`🗑️  Removed ${listsRemoved} empty lists`);

    // Recreate lists with current real content
    await createCleanLists();

    console.log('\n🎉 Database cleanup completed successfully!');
    console.log('✨ Your database now contains only real, viewable TMDB content');
    
  } catch (error) {
    console.error('❌ Cleanup failed:', error);
  } finally {
    await mongoose.disconnect();
    console.log('👋 Disconnected from MongoDB');
    process.exit(0);
  }
}

async function createCleanLists() {
  console.log('📚 Creating clean content lists...');
  
  try {
    // Remove all existing lists first
    await List.deleteMany({});
    console.log('🗑️  Removed all existing lists');

    // Get real TMDB content by genre
    const actionMovies = await Movie.find({ 
      isSeries: false, 
      tmdbId: { $exists: true, $ne: null },
      genre: { $regex: /Action/i } 
    }).limit(15);
    
    const comedyMovies = await Movie.find({ 
      isSeries: false, 
      tmdbId: { $exists: true, $ne: null },
      genre: { $regex: /Comedy/i } 
    }).limit(15);
    
    const dramaMovies = await Movie.find({ 
      isSeries: false, 
      tmdbId: { $exists: true, $ne: null },
      genre: { $regex: /Drama/i } 
    }).limit(15);

    const thrillerMovies = await Movie.find({ 
      isSeries: false, 
      tmdbId: { $exists: true, $ne: null },
      genre: { $regex: /Thriller/i } 
    }).limit(15);
    
    const allSeries = await Movie.find({ 
      isSeries: true,
      tmdbId: { $exists: true, $ne: null }
    }).limit(15);

    const allMovies = await Movie.find({ 
      isSeries: false,
      tmdbId: { $exists: true, $ne: null }
    }).limit(20);

    // Create new clean lists
    const lists = [
      {
        title: "Trending Movies",
        type: "movie",
        genre: "all",
        content: allMovies.map(m => m._id)
      },
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
        title: "Thriller Movies",
        type: "movie", 
        genre: "thriller",
        content: thrillerMovies.map(m => m._id)
      },
      {
        title: "Popular Series",
        type: "series",
        genre: "all", 
        content: allSeries.map(s => s._id)
      }
    ];

    let createdLists = 0;
    for (const listData of lists) {
      if (listData.content.length > 0) {
        const list = new List(listData);
        await list.save();
        createdLists++;
        console.log(`✅ Created list: ${listData.title} (${listData.content.length} items)`);
      } else {
        console.log(`⚠️  Skipped empty list: ${listData.title}`);
      }
    }

    console.log(`🎉 Created ${createdLists} clean content lists!`);
  } catch (error) {
    console.error('❌ Error creating clean lists:', error.message);
  }
}

// Show current database stats
async function showDatabaseStats() {
  try {
    await mongoose.connect(MONGO_URI);
    
    const totalMovies = await Movie.countDocuments({ isSeries: false });
    const totalSeries = await Movie.countDocuments({ isSeries: true });
    const tmdbMovies = await Movie.countDocuments({ isSeries: false, tmdbId: { $exists: true, $ne: null } });
    const tmdbSeries = await Movie.countDocuments({ isSeries: true, tmdbId: { $exists: true, $ne: null } });
    const testContent = await Movie.countDocuments({
      $or: [
        { tmdbId: { $exists: false } },
        { tmdbId: null },
        { title: { $regex: /^(test|mock|sample)/i } }
      ]
    });
    const totalLists = await List.countDocuments();

    console.log('\n📊 Current Database Stats:');
    console.log(`🎬 Total Movies: ${totalMovies} (TMDB: ${tmdbMovies}, Test: ${totalMovies - tmdbMovies})`);
    console.log(`📺 Total Series: ${totalSeries} (TMDB: ${tmdbSeries}, Test: ${totalSeries - tmdbSeries})`);
    console.log(`🧪 Test Content: ${testContent}`);
    console.log(`📝 Content Lists: ${totalLists}`);
    
    await mongoose.disconnect();
  } catch (error) {
    console.error('Error showing stats:', error);
  }
}

// Run based on argument
const arg = process.argv[2];

if (arg === 'stats') {
  showDatabaseStats();
} else if (arg === 'clean' || !arg) {
  cleanupDatabase();
} else {
  console.log('Usage:');
  console.log('  node cleanupDatabase.js        - Clean up test data');
  console.log('  node cleanupDatabase.js clean  - Clean up test data');
  console.log('  node cleanupDatabase.js stats  - Show database stats');
}
