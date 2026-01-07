require('dotenv').config();
const mongoose = require('mongoose');
const Place = require('./models/Place');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected for seeding');
  } catch (error) {
    console.error('Database connection error:', error);
    process.exit(1);
  }
};

const samplePlaces = [
  // Mumbai
  { name: 'Cafe Mocha', category: 'cafe', city: 'Mumbai', rating: 4.5, description: 'Cozy coffee shop with great ambiance and delicious pastries.' },
  { name: 'Trishna Restaurant', category: 'restaurant', city: 'Mumbai', rating: 4.8, description: 'Fine dining seafood restaurant with contemporary Indian cuisine.' },
  { name: 'Marine Drive', category: 'park', city: 'Mumbai', rating: 4.3, description: 'Iconic waterfront promenade perfect for evening walks.' },
  { name: 'Gateway of India', category: 'museum', city: 'Mumbai', rating: 4.2, description: 'Historic monument and popular tourist attraction.' },
  
  // Delhi
  { name: 'Blue Tokai Coffee', category: 'cafe', city: 'Delhi', rating: 4.4, description: 'Specialty coffee roasters with excellent single origin brews.' },
  { name: 'Karim\'s', category: 'restaurant', city: 'Delhi', rating: 4.6, description: 'Legendary Mughlai restaurant serving authentic kebabs and biryanis.' },
  { name: 'Lodhi Gardens', category: 'park', city: 'Delhi', rating: 4.5, description: 'Beautiful gardens with historical tombs and peaceful walking paths.' },
  { name: 'Red Fort', category: 'museum', city: 'Delhi', rating: 4.1, description: 'UNESCO World Heritage site showcasing Mughal architecture.' },
  
  // Bangalore
  { name: 'Third Wave Coffee', category: 'cafe', city: 'Bangalore', rating: 4.3, description: 'Modern coffee chain known for quality brews and cozy atmosphere.' },
  { name: 'MTR Restaurant', category: 'restaurant', city: 'Bangalore', rating: 4.7, description: 'Iconic South Indian restaurant famous for traditional breakfast.' },
  { name: 'Cubbon Park', category: 'park', city: 'Bangalore', rating: 4.4, description: 'Large green space in the heart of the city, perfect for jogging.' },
  { name: 'Visvesvaraya Museum', category: 'museum', city: 'Bangalore', rating: 4.0, description: 'Interactive science museum great for families and kids.' },
  
  // Chennai
  { name: 'Cafe Coffee Day', category: 'cafe', city: 'Chennai', rating: 4.1, description: 'Popular coffee chain with comfortable seating and good wifi.' },
  { name: 'Dakshin Restaurant', category: 'restaurant', city: 'Chennai', rating: 4.5, description: 'Upscale restaurant serving authentic South Indian cuisine.' },
  { name: 'Marina Beach', category: 'park', city: 'Chennai', rating: 4.2, description: 'One of the longest urban beaches in the world.' },
  { name: 'Government Museum', category: 'museum', city: 'Chennai', rating: 3.9, description: 'Historic museum with extensive collection of artifacts.' },
  
  // Pune
  { name: 'German Bakery', category: 'cafe', city: 'Pune', rating: 4.2, description: 'Famous bakery in Koregaon Park known for fresh bread and pastries.' },
  { name: 'Shabree Restaurant', category: 'restaurant', city: 'Pune', rating: 4.4, description: 'Traditional Maharashtrian thali restaurant with authentic flavors.' },
  { name: 'Shaniwar Wada', category: 'museum', city: 'Pune', rating: 4.0, description: 'Historic fortified palace showcasing Maratha architecture.' },
  { name: 'Osho Garden', category: 'park', city: 'Pune', rating: 4.3, description: 'Peaceful meditation garden with beautiful landscaping.' }
];

const seedDatabase = async () => {
  try {
    await connectDB();
    
    // Clear existing places
    await Place.deleteMany({});
    console.log('Cleared existing places');
    
    // Insert sample places
    await Place.insertMany(samplePlaces);
    console.log('Sample places inserted successfully');
    
    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
};

seedDatabase();