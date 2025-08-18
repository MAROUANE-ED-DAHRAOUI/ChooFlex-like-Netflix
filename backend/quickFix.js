const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const movieSchema = new mongoose.Schema({
  tmdbId: Number,
  title: String,
  desc: String,
  img: String,
  imgTitle: String,
  imgSm: String,
  trailer: String,
  video: String,
  year: String,
  limit: Number,
  genre: String,
  isSeries: Boolean
}, { strict: false });

const Movie = mongoose.model('Movie', movieSchema);

async function fixSpecificMovies() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.URL_MONGO);
    console.log('Connected successfully');

    // Fix Big Buck Bunny
    const bigBuckResult = await Movie.updateOne(
      { title: "Big Buck Bunny" },
      {
        $set: {
          img: "https://images.unsplash.com/photo-1485550409059-9afb054cada4?w=500&h=750&fit=crop",
          imgTitle: "https://images.unsplash.com/photo-1485550409059-9afb054cada4?w=1280&h=720&fit=crop",
          imgSm: "https://images.unsplash.com/photo-1485550409059-9afb054cada4?w=300&h=450&fit=crop"
        }
      }
    );
    console.log('Big Buck Bunny update result:', bigBuckResult);

    // Fix Elephant's Dream
    const elephantResult = await Movie.updateOne(
      { title: "Elephant's Dream" },
      {
        $set: {
          img: "https://images.unsplash.com/photo-1564349683136-77e08dba1ef7?w=500&h=750&fit=crop",
          imgTitle: "https://images.unsplash.com/photo-1564349683136-77e08dba1ef7?w=1280&h=720&fit=crop",
          imgSm: "https://images.unsplash.com/photo-1564349683136-77e08dba1ef7?w=300&h=450&fit=crop"
        }
      }
    );
    console.log('Elephants Dream update result:', elephantResult);

    // Verify the updates
    const bigBuck = await Movie.findOne({ title: "Big Buck Bunny" });
    console.log('Big Buck Bunny current img:', bigBuck?.img);

    const elephant = await Movie.findOne({ title: "Elephant's Dream" });
    console.log('Elephants Dream current img:', elephant?.img);

    console.log('Fix completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

fixSpecificMovies();
