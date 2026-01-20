require('dotenv').config();
const mongoose = require('mongoose');
const Place = require('./models/Place');

async function listPlaces() {
  try {
    console.log('🔄 Connecting to MongoDB...\n');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB connected\n');

    const places = await Place.find().select('_id name city category ownerId totalReviews averageRating');
    
    if (places.length === 0) {
      console.log('❌ No places found in database!');
      console.log('💡 Run: node seed-places.js to create some places\n');
      process.exit(0);
    }

    console.log(`📍 Found ${places.length} places:\n`);
    console.log('='.repeat(100));
    
    places.forEach((place, index) => {
      console.log(`${index + 1}. ${place.name}`);
      console.log(`   ID: ${place._id}`);
      console.log(`   City: ${place.city} | Category: ${place.category}`);
      console.log(`   Reviews: ${place.totalReviews} | Rating: ${place.averageRating.toFixed(1)}⭐`);
      console.log(`   Owner ID: ${place.ownerId || 'None'}`);
      console.log('-'.repeat(100));
    });

    console.log('\n💡 To seed reviews for a place:');
    console.log('   1. Copy the place ID from above');
    console.log('   2. Edit backend/seedReviews.js');
    console.log('   3. Replace PLACE_ID with your copied ID');
    console.log('   4. Run: node seedReviews.js\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error listing places:', error);
    process.exit(1);
  }
}

listPlaces();
