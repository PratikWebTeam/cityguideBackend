require('dotenv').config();
const mongoose = require('mongoose');
const Place = require('./models/Place');
const User = require('./models/User');

// 20 comprehensive places with all fields
const placesData = [
  {
    name: "The Bombay Canteen",
    category: "Restaurant",
    city: "Mumbai",
    description: "Modern Indian restaurant celebrating regional cuisines with innovative twists. Features seasonal menus and craft cocktails in a vibrant atmosphere.",
    image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800",
    address: "Kamala Mills, Lower Parel, Mumbai, Maharashtra 400013",
    contactNumber: "+91 22 4966 6666",
    website: "https://thebombaycanteen.com"
  },
  {
    name: "Blue Tokai Coffee Roasters",
    category: "Cafe",
    city: "Delhi",
    description: "Specialty coffee roastery and cafe serving single-origin Indian coffees. Perfect spot for coffee enthusiasts and remote workers.",
    image: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=800",
    address: "Champa Gali, Saidulajab, New Delhi, Delhi 110030",
    contactNumber: "+91 11 4163 4163",
    website: "https://bluetokaicoffee.com"
  },
  {
    name: "Cubbon Park",
    category: "Park",
    city: "Bangalore",
    description: "Historic 300-acre park in the heart of Bangalore. Features walking trails, botanical gardens, and colonial-era architecture.",
    image: "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=800",
    address: "Kasturba Road, Sampangi Rama Nagar, Bangalore, Karnataka 560001",
    contactNumber: "+91 80 2286 4424",
    website: "https://bangaloreforest.gov.in"
  },
  {
    name: "Government Museum",
    category: "Museum",
    city: "Chennai",
    description: "One of India's oldest museums featuring archaeology, numismatics, and natural history collections. Houses rare bronze sculptures.",
    image: "https://images.unsplash.com/photo-1566127444979-b3d2b654e3d7?w=800",
    address: "Pantheon Road, Egmore, Chennai, Tamil Nadu 600008",
    contactNumber: "+91 44 2819 3238",
    website: "https://chennaimuseum.tn.gov.in"
  },
  {
    name: "South City Mall",
    category: "Shopping Mall",
    city: "Kolkata",
    description: "Premier shopping destination with 180+ brands, multiplex cinema, food court, and entertainment zone. Family-friendly atmosphere.",
    image: "https://images.unsplash.com/photo-1519567241046-7f570eee3ce6?w=800",
    address: "375, Prince Anwar Shah Road, Kolkata, West Bengal 700068",
    contactNumber: "+91 33 4003 7777",
    website: "https://southcitymall.in"
  },
  {
    name: "Taj Falaknuma Palace",
    category: "Hotel",
    city: "Hyderabad",
    description: "Luxury heritage hotel in a restored Nizam's palace. Features opulent rooms, fine dining, and panoramic city views.",
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800",
    address: "Engine Bowli, Falaknuma, Hyderabad, Telangana 500053",
    contactNumber: "+91 40 6629 8585",
    website: "https://www.tajhotels.com/falaknuma"
  },
  {
    name: "Shaniwar Wada",
    category: "Tourist Attraction",
    city: "Pune",
    description: "Historic 18th-century fortification and palace. Famous for its architecture, light and sound show, and Maratha history.",
    image: "https://images.unsplash.com/photo-1609920658906-8223bd289001?w=800",
    address: "Shaniwar Peth, Pune, Maharashtra 411030",
    contactNumber: "+91 20 2444 0025",
    website: "https://punearchaeology.com"
  },
  {
    name: "Sabarmati Ashram",
    category: "Temple",
    city: "Ahmedabad",
    description: "Gandhi's former residence and spiritual center. Peaceful grounds with museum showcasing India's independence movement.",
    image: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800",
    address: "Ashram Road, Ahmedabad, Gujarat 380027",
    contactNumber: "+91 79 2755 7277",
    website: "https://gandhiashramsabarmati.org"
  },
  {
    name: "Jal Mahal",
    category: "Tourist Attraction",
    city: "Jaipur",
    description: "Stunning water palace in the middle of Man Sagar Lake. Architectural marvel with Rajput and Mughal influences.",
    image: "https://images.unsplash.com/photo-1599661046289-e31897846e41?w=800",
    address: "Amer Road, Jaipur, Rajasthan 302002",
    contactNumber: "+91 141 261 8862",
    website: "https://tourism.rajasthan.gov.in"
  },
  {
    name: "Hazratganj Market",
    category: "Market",
    city: "Lucknow",
    description: "Historic shopping district known for Chikankari embroidery, jewelry, and traditional Awadhi cuisine. Vibrant street life.",
    image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800",
    address: "Hazratganj, Lucknow, Uttar Pradesh 226001",
    contactNumber: "+91 522 261 5555",
    website: "https://lucknowcity.com"
  },
  {
    name: "Trishna Restaurant",
    category: "Restaurant",
    city: "Mumbai",
    description: "Iconic seafood restaurant famous for butter garlic crab. Family-run establishment serving coastal delicacies since 1977.",
    image: "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800",
    address: "7, Sai Baba Marg, Kala Ghoda, Mumbai, Maharashtra 400001",
    contactNumber: "+91 22 2270 3213",
    website: "https://trishnarestaurant.com"
  },
  {
    name: "India Habitat Centre",
    category: "Theater",
    city: "Delhi",
    description: "Cultural hub hosting theater performances, art exhibitions, and literary events. Features multiple auditoriums and galleries.",
    image: "https://images.unsplash.com/photo-1503095396549-807759245b35?w=800",
    address: "Lodhi Road, New Delhi, Delhi 110003",
    contactNumber: "+91 11 2468 2001",
    website: "https://indiahabitatcentre.com"
  },
  {
    name: "Bangalore Central Library",
    category: "Library",
    city: "Bangalore",
    description: "State-of-the-art public library with vast collection of books, digital resources, and reading spaces. Free membership available.",
    image: "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=800",
    address: "Cubbon Park, Bangalore, Karnataka 560001",
    contactNumber: "+91 80 2221 5669",
    website: "https://bangalorecentrallibrary.org"
  },
  {
    name: "Apollo Hospitals",
    category: "Hospital",
    city: "Chennai",
    description: "Multi-specialty tertiary care hospital with advanced medical facilities. 24/7 emergency services and international patient care.",
    image: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800",
    address: "21, Greams Lane, Chennai, Tamil Nadu 600006",
    contactNumber: "+91 44 2829 3333",
    website: "https://apollohospitals.com"
  },
  {
    name: "La Martiniere School",
    category: "School",
    city: "Kolkata",
    description: "Historic boys' school established in 1836. Known for academic excellence and colonial architecture. UNESCO heritage site.",
    image: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800",
    address: "11, Loudon Street, Kolkata, West Bengal 700017",
    contactNumber: "+91 33 2249 1890",
    website: "https://lamartinierekolkata.org"
  },
  {
    name: "Cult.fit Gym",
    category: "Gym",
    city: "Hyderabad",
    description: "Modern fitness center with strength training, cardio equipment, group classes, and personal training. App-based membership.",
    image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800",
    address: "Banjara Hills, Hyderabad, Telangana 500034",
    contactNumber: "+91 80 6780 6780",
    website: "https://cult.fit"
  },
  {
    name: "Vaishali Restaurant",
    category: "Cafe",
    city: "Pune",
    description: "Legendary South Indian restaurant serving authentic dosas, idlis, and filter coffee. Popular breakfast spot since 1975.",
    image: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800",
    address: "FC Road, Deccan Gymkhana, Pune, Maharashtra 411004",
    contactNumber: "+91 20 2543 5975",
    website: "https://vaishalirestaurant.com"
  },
  {
    name: "Kankaria Lake",
    category: "Park",
    city: "Ahmedabad",
    description: "Circular lake with walking track, zoo, toy train, and water rides. Popular evening destination for families and joggers.",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800",
    address: "Kankaria, Ahmedabad, Gujarat 380008",
    contactNumber: "+91 79 2550 6622",
    website: "https://ahmedabadcity.gov.in"
  },
  {
    name: "City Palace Museum",
    category: "Museum",
    city: "Jaipur",
    description: "Royal residence turned museum showcasing Rajput and Mughal artifacts. Features courtyards, gardens, and textile gallery.",
    image: "https://images.unsplash.com/photo-1599661046827-dacff0c0f09a?w=800",
    address: "Tulsi Marg, Gangori Bazaar, Jaipur, Rajasthan 302002",
    contactNumber: "+91 141 408 8888",
    website: "https://citypalacejaipur.com"
  },
  {
    name: "Tunday Kababi",
    category: "Restaurant",
    city: "Lucknow",
    description: "Legendary kebab shop famous for galouti kebabs that melt in your mouth. Awadhi culinary heritage since 1905.",
    image: "https://images.unsplash.com/photo-1603360946369-dc9bb6258143?w=800",
    address: "Aminabad, Lucknow, Uttar Pradesh 226018",
    contactNumber: "+91 522 262 7926",
    website: "https://tundaykababi.com"
  }
];

async function seedPlaces() {
  try {
    console.log('🌱 Starting place seeding process...\n');

    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB\n');

    // Get all users from database
    const users = await User.find({});
    
    if (users.length === 0) {
      console.log('❌ No users found in database!');
      console.log('💡 Please create some users first before seeding places.');
      process.exit(1);
    }

    console.log(`👥 Found ${users.length} users in database:`);
    users.forEach((user, index) => {
      console.log(`   ${index + 1}. ${user.name} (${user.email}) - ${user.role || 'user'}`);
    });
    console.log('');

    // Delete all existing places
    const deleteResult = await Place.deleteMany({});
    console.log(`🗑️  Deleted ${deleteResult.deletedCount} existing places\n`);

    // Create new places with owners distributed among users
    console.log('📍 Creating 20 new places...\n');
    
    const createdPlaces = [];
    for (let i = 0; i < placesData.length; i++) {
      // Distribute places among users (round-robin)
      const ownerIndex = i % users.length;
      const owner = users[ownerIndex];

      const place = new Place({
        ...placesData[i],
        ownerId: owner._id,
        rating: 0,
        averageRating: 0,
        totalReviews: 0,
        reviews: []
      });

      await place.save();
      createdPlaces.push(place);

      console.log(`   ✅ ${i + 1}. ${place.name} (${place.city})`);
      console.log(`      Owner: ${owner.name} (${owner.email})`);
      console.log(`      Category: ${place.category}`);
      console.log(`      Address: ${place.address}`);
      console.log(`      Contact: ${place.contactNumber}`);
      console.log('');
    }

    // Summary
    console.log('\n' + '='.repeat(60));
    console.log('🎉 SEEDING COMPLETED SUCCESSFULLY!');
    console.log('='.repeat(60));
    console.log(`\n📊 Summary:`);
    console.log(`   • Total places created: ${createdPlaces.length}`);
    console.log(`   • Total users: ${users.length}`);
    console.log(`   • Places per user: ~${Math.ceil(createdPlaces.length / users.length)}`);
    
    // Count by city
    const cityCounts = {};
    createdPlaces.forEach(place => {
      cityCounts[place.city] = (cityCounts[place.city] || 0) + 1;
    });
    
    console.log(`\n🏙️  Places by City:`);
    Object.entries(cityCounts).sort((a, b) => b[1] - a[1]).forEach(([city, count]) => {
      console.log(`   • ${city}: ${count} places`);
    });

    // Count by category
    const categoryCounts = {};
    createdPlaces.forEach(place => {
      categoryCounts[place.category] = (categoryCounts[place.category] || 0) + 1;
    });
    
    console.log(`\n📂 Places by Category:`);
    Object.entries(categoryCounts).sort((a, b) => b[1] - a[1]).forEach(([category, count]) => {
      console.log(`   • ${category}: ${count} places`);
    });

    console.log('\n✨ All places have complete information:');
    console.log('   ✓ Name, Category, City');
    console.log('   ✓ Description');
    console.log('   ✓ Image URL');
    console.log('   ✓ Address');
    console.log('   ✓ Contact Number');
    console.log('   ✓ Website');
    console.log('   ✓ Owner (from existing users)');
    console.log('   ✓ Rating: 0 (no reviews yet)');
    console.log('\n💡 Users can now add reviews to update ratings!\n');

  } catch (error) {
    console.error('❌ Error seeding places:', error);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log('👋 Database connection closed\n');
  }
}

// Run the seeding
seedPlaces();
