const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Scheme = require('./models/Scheme');
const sampleSchemes = require('./data/sampleSchemes.json');

// Load environment variables
dotenv.config();

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('✅ MongoDB Connected!');
    seedDatabase();
  })
  .catch((err) => {
    console.log('❌ MongoDB Connection Error:', err.message);
    process.exit(1);
  });

// Seed database with sample schemes
const seedDatabase = async () => {
  try {
    // Delete all existing schemes
    await Scheme.deleteMany({});
    console.log('🗑️  Deleted all existing schemes');

    // Insert sample schemes
    await Scheme.insertMany(sampleSchemes);
    console.log('✅ Added 10 sample schemes to database');

    console.log('\n🎉 Database seeded successfully!');
    console.log('📊 Total schemes:', sampleSchemes.length);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};
