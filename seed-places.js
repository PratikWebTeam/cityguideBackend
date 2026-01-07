const mongoose = require('mongoose');
require('dotenv').config();

const Place = require('./models/Place');

const MONGO_URI = process.env.MONGO_URI;

// City-specific places data with real images (using direct Unsplash URLs)
const placesData = [
  // Mumbai
  {
    name: 'Cafe Mocha',
    category: 'cafe',
    city: 'Mumbai',
    rating: 4.5,
    description: 'Cozy coffee shop with great ambiance and delicious pastries.',
    image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=400&h=300&q=80'
  },
  {
    name: 'Trishna Restaurant',
    category: 'restaurant',
    city: 'Mumbai',
    rating: 4.8,
    description: 'Fine dining seafood restaurant with contemporary Indian cuisine.',
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=400&h=300&q=80'
  },
  {
    name: 'Marine Drive',
    category: 'park',
    city: 'Mumbai',
    rating: 4.3,
    description: 'Iconic waterfront promenade perfect for evening walks.',
    image: 'https://images.unsplash.com/photo-1566552881560-0be862a7c445?auto=format&fit=crop&w=400&h=300&q=80'
  },
  {
    name: 'Gateway of India Cafe',
    category: 'cafe',
    city: 'Mumbai',
    rating: 4.6,
    description: 'Historic cafe near the iconic Gateway of India monument.',
    image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?auto=format&fit=crop&w=400&h=300&q=80'
  },
  
  // Delhi
  {
    name: 'India Gate Cafe',
    category: 'cafe',
    city: 'Delhi',
    rating: 4.4,
    description: 'Popular cafe near India Gate with outdoor seating.',
    image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=400&h=300&q=80'
  },
  {
    name: 'Bukhara Restaurant',
    category: 'restaurant',
    city: 'Delhi',
    rating: 4.9,
    description: 'World-famous restaurant serving authentic North Indian cuisine.',
    image: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=400&h=300&q=80'
  },
  {
    name: 'Lodhi Garden',
    category: 'park',
    city: 'Delhi',
    rating: 4.7,
    description: 'Beautiful historical park with Mughal-era monuments.',
    image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=400&h=300&q=80'
  },
  {
    name: 'Connaught Place Bistro',
    category: 'cafe',
    city: 'Delhi',
    rating: 4.5,
    description: 'Trendy bistro in the heart of Delhi\'s shopping district.',
    image: 'https://images.unsplash.com/photo-1521017432531-fbd92d768814?auto=format&fit=crop&w=400&h=300&q=80'
  },
  
  // Bangalore
  {
    name: 'Cubbon Park Cafe',
    category: 'cafe',
    city: 'Bangalore',
    rating: 4.3,
    description: 'Peaceful cafe adjacent to the lush Cubbon Park.',
    image: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=400&h=300&q=80'
  },
  {
    name: 'Koshy\'s Restaurant',
    category: 'restaurant',
    city: 'Bangalore',
    rating: 4.6,
    description: 'Iconic Bangalore restaurant serving continental and Indian food.',
    image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=400&h=300&q=80'
  },
  {
    name: 'Lalbagh Botanical Garden',
    category: 'park',
    city: 'Bangalore',
    rating: 4.8,
    description: 'Famous botanical garden with diverse flora and glass house.',
    image: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=400&h=300&q=80'
  },
  {
    name: 'Third Wave Coffee',
    category: 'cafe',
    city: 'Bangalore',
    rating: 4.7,
    description: 'Specialty coffee roasters with multiple locations across the city.',
    image: 'https://images.unsplash.com/photo-1511920170033-f8396924c348?auto=format&fit=crop&w=400&h=300&q=80'
  },
  
  // Chennai
  {
    name: 'Marina Beach Cafe',
    category: 'cafe',
    city: 'Chennai',
    rating: 4.2,
    description: 'Beachside cafe with stunning views of Marina Beach.',
    image: 'https://images.unsplash.com/photo-1559329007-40df8a9345d8?auto=format&fit=crop&w=400&h=300&q=80'
  },
  {
    name: 'Dakshin Restaurant',
    category: 'restaurant',
    city: 'Chennai',
    rating: 4.8,
    description: 'Authentic South Indian cuisine in an elegant setting.',
    image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=400&h=300&q=80'
  },
  {
    name: 'Guindy National Park',
    category: 'park',
    city: 'Chennai',
    rating: 4.4,
    description: 'One of the smallest national parks in India, located in the city.',
    image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=400&h=300&q=80'
  },
  {
    name: 'Amethyst Cafe',
    category: 'cafe',
    city: 'Chennai',
    rating: 4.6,
    description: 'Charming cafe in a heritage building with garden seating.',
    image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=400&h=300&q=80'
  },
  
  // Pune
  {
    name: 'German Bakery',
    category: 'cafe',
    city: 'Pune',
    rating: 4.5,
    description: 'Famous bakery and cafe in Koregaon Park area.',
    image: 'https://images.unsplash.com/photo-1517433670267-08bbd4be890f?auto=format&fit=crop&w=400&h=300&q=80'
  },
  {
    name: 'Malaka Spice',
    category: 'restaurant',
    city: 'Pune',
    rating: 4.7,
    description: 'Popular restaurant serving Pan-Asian cuisine.',
    image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=400&h=300&q=80'
  },
  {
    name: 'Aga Khan Palace Gardens',
    category: 'park',
    city: 'Pune',
    rating: 4.6,
    description: 'Historical palace with beautiful gardens and museum.',
    image: 'https://images.unsplash.com/photo-1519331379826-f10be5486c6f?auto=format&fit=crop&w=400&h=300&q=80'
  },
  {
    name: 'Vaishali Restaurant',
    category: 'restaurant',
    city: 'Pune',
    rating: 4.4,
    description: 'Iconic South Indian restaurant, a Pune institution since 1972.',
    image: 'https://images.unsplash.com/photo-1630409346283-4c0d32e02e6b?auto=format&fit=crop&w=400&h=300&q=80'
  }
];

async function seedPlaces() {
  try {
    console.log('🌱 Starting database seed...');
    
    // Connect to MongoDB
    await mongoose.connect(MONGO_URI);
    console.log('✅ MongoDB Connected');
    
    // Check if places already exist
    const existingPlaces = await Place.countDocuments();
    
    if (existingPlaces > 0) {
      console.log(`⚠️  Database already has ${existingPlaces} places`);
      console.log('Do you want to:');
      console.log('1. Skip seeding (keep existing data)');
      console.log('2. Clear and reseed (delete all and add new)');
      console.log('');
      console.log('Run with --force flag to clear and reseed automatically');
      
      if (!process.argv.includes('--force')) {
        console.log('');
        console.log('Skipping seed. Use --force to override.');
        process.exit(0);
      }
      
      console.log('🗑️  Clearing existing places...');
      await Place.deleteMany({});
      console.log('✅ Existing places cleared');
    }
    
    // Insert places
    console.log('📝 Inserting places...');
    const insertedPlaces = await Place.insertMany(placesData);
    
    console.log('');
    console.log('='.repeat(50));
    console.log('✅ Database seeded successfully!');
    console.log('='.repeat(50));
    console.log(`📊 Total places inserted: ${insertedPlaces.length}`);
    console.log('');
    
    // Show breakdown by city
    const cities = await Place.distinct('city');
    console.log('🏙️  Places by city:');
    for (const city of cities) {
      const count = await Place.countDocuments({ city });
      console.log(`   ${city}: ${count} places`);
    }
    
    console.log('');
    console.log('🎉 Seed complete!');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Seed error:', error);
    process.exit(1);
  }
}

// Run seed
seedPlaces();
