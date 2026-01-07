const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const Place = require('./models/Place');

const MONGO_URI = process.env.MONGO_URI;

async function testImages() {
  try {
    console.log('🔍 Testing image URLs in database...\n');
    
    // Connect to MongoDB
    await mongoose.connect(MONGO_URI);
    console.log('✅ MongoDB Connected\n');
    
    // Get all places
    const places = await Place.find().limit(5);
    
    console.log('📊 Sample Places with Image URLs:\n');
    console.log('='.repeat(80));
    
    places.forEach((place, index) => {
      console.log(`\n${index + 1}. ${place.name} (${place.city})`);
      console.log(`   Category: ${place.category}`);
      console.log(`   Image URL: ${place.image}`);
      console.log(`   URL Valid: ${place.image.startsWith('https://images.unsplash.com') ? '✅' : '❌'}`);
    });
    
    console.log('\n' + '='.repeat(80));
    
    // Count total places
    const totalPlaces = await Place.countDocuments();
    const placesWithImages = await Place.countDocuments({ 
      image: { $regex: '^https://images.unsplash.com' } 
    });
    
    console.log(`\n📈 Statistics:`);
    console.log(`   Total Places: ${totalPlaces}`);
    console.log(`   Places with Unsplash Images: ${placesWithImages}`);
    console.log(`   Coverage: ${((placesWithImages / totalPlaces) * 100).toFixed(1)}%`);
    
    if (placesWithImages === totalPlaces) {
      console.log('\n✅ All places have valid Unsplash image URLs!');
    } else {
      console.log('\n⚠️  Some places are missing Unsplash images');
    }
    
    console.log('\n🎉 Test complete!\n');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Test error:', error);
    process.exit(1);
  }
}

// Run test
testImages();
