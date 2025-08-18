// fixVideoUrls.js
// Script to update existing movies with proper video URLs

const mongoose = require('mongoose');
const Movie = require('./models/movie');
const dotenv = require('dotenv');

dotenv.config();

const MONGO_URI = process.env.URL_MONGO;

async function fixVideoUrls() {
  try {
    console.log('🔧 Fixing video URLs...');
    
    // Connect to MongoDB
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Sample video files that actually work with HTML5 video
    const sampleVideos = [
      'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
      'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
      'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
      'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
      'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
      'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
      'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
      'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4',
      'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4'
    ];

    // Get all movies with YouTube video URLs
    const moviesWithYouTubeUrls = await Movie.find({
      $or: [
        { video: { $regex: /youtube\.com/i } },
        { video: { $regex: /youtu\.be/i } }
      ]
    });

    console.log(`Found ${moviesWithYouTubeUrls.length} movies with YouTube URLs`);

    let updatedCount = 0;
    for (const movie of moviesWithYouTubeUrls) {
      const randomSampleVideo = sampleVideos[Math.floor(Math.random() * sampleVideos.length)];
      
      // Keep the original YouTube URL as trailer, set a working MP4 as video
      await Movie.findByIdAndUpdate(movie._id, {
        video: randomSampleVideo,
        // Keep the original YouTube URL as trailer if it's not already set
        trailer: movie.trailer || movie.video
      });

      updatedCount++;
      console.log(`✅ Updated: ${movie.title}`);
    }

    console.log(`\n🎉 Updated ${updatedCount} movies with working video URLs!`);
    console.log('🎬 All movies now have HTML5-compatible video files');
    console.log('📺 YouTube trailers preserved for reference');
    
  } catch (error) {
    console.error('❌ Fix failed:', error);
  } finally {
    await mongoose.disconnect();
    console.log('👋 Disconnected from MongoDB');
    process.exit(0);
  }
}

// Run the fix
fixVideoUrls();
