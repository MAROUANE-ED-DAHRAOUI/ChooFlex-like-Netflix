const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Movie = require('./models/movie');

dotenv.config();

// Use simple, guaranteed working image URLs
const movieUpdates = {
  999001: { // Big Buck Bunny
    img: "https://via.placeholder.com/500x750/1a1a1a/ffffff?text=Big+Buck+Bunny",
    imgTitle: "https://via.placeholder.com/1280x720/1a1a1a/ffffff?text=Big+Buck+Bunny",
    imgSm: "https://via.placeholder.com/300x450/1a1a1a/ffffff?text=Big+Buck+Bunny"
  },
  999002: { // Elephant's Dream
    img: "https://via.placeholder.com/500x750/2a2a2a/ffffff?text=Elephants+Dream", 
    imgTitle: "https://via.placeholder.com/1280x720/2a2a2a/ffffff?text=Elephants+Dream",
    imgSm: "https://via.placeholder.com/300x450/2a2a2a/ffffff?text=Elephants+Dream"
  }
};

async function fixSpecificMovieImages() {
  try {
    await mongoose.connect(process.env.URL_MONGO);
    console.log('Connected to MongoDB');

    for (const [tmdbId, updates] of Object.entries(movieUpdates)) {
      const result = await Movie.updateOne(
        { tmdbId: parseInt(tmdbId) },
        { $set: updates }
      );
      
      if (result.matchedCount > 0) {
        console.log(`Updated images for movie with tmdbId: ${tmdbId}`);
        
        // Verify the update
        const movie = await Movie.findOne({ tmdbId: parseInt(tmdbId) });
        console.log(`${movie.title} - img: ${movie.img}`);
      } else {
        console.log(`Movie with tmdbId: ${tmdbId} not found`);
      }
    }

    console.log('Specific movie images updated successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error updating movie images:', error);
    process.exit(1);
  }
}

fixSpecificMovieImages();
