const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 8080;

// Enable CORS for all origins
app.use(cors());
app.use(express.json());

// Test routes
app.get('/api/health', (req, res) => {
  console.log('Health check requested');
  res.json({ success: true, message: 'Test server is working!' });
});

// In-memory user storage (for testing)
let users = [];
let userIdCounter = 1;

app.post('/api/auth/register', (req, res) => {
  console.log('📝 Register requested:', req.body);
  const { name, email, password } = req.body;
  
  // Validation
  if (!name || !email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Please provide name, email, and password'
    });
  }
  
  // Check if user exists
  const existingUser = users.find(u => u.email === email);
  if (existingUser) {
    return res.status(400).json({
      success: false,
      message: 'User already exists with this email'
    });
  }
  
  // Create user
  const user = {
    id: `user_${userIdCounter++}`,
    name,
    email,
    password // In real app, hash this!
  };
  
  users.push(user);
  
  // Generate token (simple for testing)
  const token = `token_${user.id}_${Date.now()}`;
  
  console.log('✅ User registered:', user.email);
  
  res.json({
    success: true,
    message: 'Registration successful',
    token: token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email
    }
  });
});

app.post('/api/auth/login', (req, res) => {
  console.log('🔐 Login requested:', req.body);
  const { email, password } = req.body;
  
  // Validation
  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Please provide email and password'
    });
  }
  
  // Find user
  const user = users.find(u => u.email === email && u.password === password);
  
  if (!user) {
    return res.status(401).json({
      success: false,
      message: 'Invalid email or password'
    });
  }
  
  // Generate token
  const token = `token_${user.id}_${Date.now()}`;
  
  console.log('✅ User logged in:', user.email);
  
  res.json({
    success: true,
    message: 'Login successful',
    token: token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email
    }
  });
});

app.get('/api/cities', (req, res) => {
  console.log('Cities requested');
  res.json({
    success: true,
    data: ['Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Pune']
  });
});

app.get('/api/places', (req, res) => {
  console.log('Places requested:', req.query);
  const { city, page = 1, limit = 10 } = req.query;
  
  // Sample places data
  const samplePlaces = [
    {
      _id: '1',
      name: 'Cafe Mocha',
      category: 'cafe',
      city: city || 'Mumbai',
      rating: 4.5,
      description: 'Cozy coffee shop with great ambiance and delicious pastries.',
      image: 'https://via.placeholder.com/300x200',
      createdAt: new Date().toISOString()
    },
    {
      _id: '2',
      name: 'Trishna Restaurant',
      category: 'restaurant',
      city: city || 'Mumbai',
      rating: 4.8,
      description: 'Fine dining seafood restaurant with contemporary Indian cuisine.',
      image: 'https://via.placeholder.com/300x200',
      createdAt: new Date().toISOString()
    },
    {
      _id: '3',
      name: 'Marine Drive',
      category: 'park',
      city: city || 'Mumbai',
      rating: 4.3,
      description: 'Iconic waterfront promenade perfect for evening walks.',
      image: 'https://via.placeholder.com/300x200',
      createdAt: new Date().toISOString()
    }
  ];
  
  res.json({
    success: true,
    data: samplePlaces,
    pagination: {
      currentPage: parseInt(page),
      totalPages: 1,
      totalItems: samplePlaces.length,
      hasNext: false,
      hasPrev: false
    }
  });
});

app.get('/api/places/search', (req, res) => {
  console.log('Search requested:', req.query);
  const { keyword } = req.query;
  
  const searchResults = [
    {
      _id: '1',
      name: `${keyword} Cafe`,
      category: 'cafe',
      city: 'Mumbai',
      rating: 4.2,
      description: `Great ${keyword} place with excellent service.`,
      image: 'https://via.placeholder.com/300x200',
      createdAt: new Date().toISOString()
    }
  ];
  
  res.json({
    success: true,
    data: searchResults,
    pagination: {
      currentPage: 1,
      totalPages: 1,
      totalItems: 1,
      hasNext: false,
      hasPrev: false
    }
  });
});

app.get('/api/places/:id', (req, res) => {
  console.log('Place details requested:', req.params.id);
  res.json({
    success: true,
    data: {
      _id: req.params.id,
      name: 'Sample Place',
      category: 'cafe',
      city: 'Mumbai',
      rating: 4.5,
      description: 'A wonderful place to visit.',
      image: 'https://via.placeholder.com/300x200',
      createdAt: new Date().toISOString()
    }
  });
});

// In-memory storage for favorites (for testing)
let favorites = [];
let favoriteIdCounter = 1;

app.get('/api/favorites', (req, res) => {
  console.log('Favorites requested');
  
  // Return favorites with place details
  const favoritesWithDetails = favorites.map(fav => ({
    favoriteId: fav.id,
    _id: fav.placeId,
    name: fav.placeName,
    category: fav.category,
    city: fav.city,
    rating: fav.rating,
    description: fav.description,
    image: fav.image,
    createdAt: fav.createdAt
  }));
  
  res.json({
    success: true,
    data: favoritesWithDetails
  });
});

app.post('/api/favorites', (req, res) => {
  console.log('Add favorite requested:', req.body);
  const { placeId } = req.body;
  
  // Check if already favorited
  const existingFavorite = favorites.find(fav => fav.placeId === placeId);
  if (existingFavorite) {
    return res.status(400).json({
      success: false,
      message: 'Place already in favorites'
    });
  }
  
  // Sample place data (in real app, you'd fetch from database)
  const samplePlaces = {
    '1': { name: 'Cafe Mocha', category: 'cafe', city: 'Mumbai', rating: 4.5, description: 'Cozy coffee shop with great ambiance and delicious pastries.' },
    '2': { name: 'Trishna Restaurant', category: 'restaurant', city: 'Mumbai', rating: 4.8, description: 'Fine dining seafood restaurant with contemporary Indian cuisine.' },
    '3': { name: 'Marine Drive', category: 'park', city: 'Mumbai', rating: 4.3, description: 'Iconic waterfront promenade perfect for evening walks.' }
  };
  
  const placeData = samplePlaces[placeId] || samplePlaces['1'];
  
  const favorite = {
    id: `fav_${favoriteIdCounter++}`,
    placeId: placeId,
    placeName: placeData.name,
    category: placeData.category,
    city: placeData.city,
    rating: placeData.rating,
    description: placeData.description,
    image: 'https://via.placeholder.com/300x200',
    createdAt: new Date().toISOString()
  };
  
  favorites.push(favorite);
  
  res.json({
    success: true,
    message: 'Added to favorites',
    data: { _id: favorite.id, userId: 'user1', placeId: placeId }
  });
});

app.delete('/api/favorites/:id', (req, res) => {
  console.log('Remove favorite requested:', req.params.id);
  const favoriteId = req.params.id;
  
  const initialLength = favorites.length;
  favorites = favorites.filter(fav => fav.id !== favoriteId);
  
  if (favorites.length < initialLength) {
    res.json({
      success: true,
      message: 'Removed from favorites'
    });
  } else {
    res.status(404).json({
      success: false,
      message: 'Favorite not found'
    });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Test server running on port ${PORT}`);
  console.log(`📍 Test URL: http://localhost:${PORT}/api/health`);
  console.log('Ready for Flutter web testing!');
});

// Log all requests
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});