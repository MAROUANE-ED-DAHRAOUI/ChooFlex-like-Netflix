const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Movie = require('./models/movie');

dotenv.config();

// Updated image URLs that actually work
const movieUpdates = {
  999001: { // Big Buck Bunny
    img: "https://images.unsplash.com/photo-1560472354-7c0f99c5c4e1?w=500&q=80",
    imgTitle: "https://images.unsplash.com/photo-1560472354-7c0f99c5c4e1?w=1280&q=80",
    imgSm: "https://images.unsplash.com/photo-1560472354-7c0f99c5c4e1?w=300&q=80"
  },
  999002: { // Elephant's Dream
    img: "https://images.unsplash.com/photo-1474624017446-48bc03abb967?w=500&q=80",
    imgTitle: "https://images.unsplash.com/photo-1474624017446-48bc03abb967?w=1280&q=80",
    imgSm: "https://images.unsplash.com/photo-1474624017446-48bc03abb967?w=300&q=80"
  },
  999003: { // Sintel
    img: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500&q=80",
    imgTitle: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=1280&q=80",
    imgSm: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&q=80"
  },
  999004: { // Tears of Steel
    img: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&q=80",
    imgTitle: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1280&q=80",
    imgSm: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&q=80"
  },
  999005: { // We Are Going on Bullrun
    img: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=500&q=80",
    imgTitle: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=1280&q=80",
    imgSm: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=300&q=80"
  }
};

async function fixMovieImages() {
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
      } else {
        console.log(`Movie with tmdbId: ${tmdbId} not found`);
      }
    }

    console.log('All movie images updated successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error updating movie images:', error);
    process.exit(1);
  }
}

fixMovieImages();
