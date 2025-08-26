const mongoose = require('mongoose');
const { seedMovies } = require('./seeders/movieSeeder');
const { seedAdmin } = require('./seeders/userSeeder');

// Get MongoDB URI from environment
const MONGODB_URI = process.env.URL_MONGO || process.env.MONGODB_URI || 'mongodb://localhost:27017/netflix';

const runSeeder = async () => {
  try {
    console.log('🚀 Starting database seeding...');
    console.log('📡 Connecting to MongoDB...');
    
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('✅ Connected to MongoDB');
    
    // Seed admin user first
    await seedAdmin();
    
    // Seed movies
    await seedMovies();
    
    console.log('🎉 Database seeding completed successfully!');
    
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log('📡 Database connection closed');
    process.exit(0);
  }
};

// Run the seeder
runSeeder();
