const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const PORT = 8080;
const JWT_SECRET = process.env.JWT_SECRET || 'cityguide_secret_key_2024';
const JWT_EXPIRY = '7d';
const MONGO_URI = process.env.MONGO_URI;

// Import Models
const User = require('./models/User');
const Place = require('./models/Place');
const Favorite = require('./models/Favorite');

// Enable CORS
app.use(cors());
app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
  console.log(`📨 ${req.method} ${req.path} - ${new Date().toISOString()}`);
  next();
});

// Connect to MongoDB
mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB Connected Successfully');
  })
  .catch((error) => {
    console.error('❌ MongoDB Connection Error:', error.message);
  });

// ============================================
// JWT MIDDLEWARE
// ============================================
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    console.log('❌ No token provided');
    return res.status(401).json({
      success: false,
      message: 'Access denied. No token provided.'
    });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    console.log(`✅ Token verified for user: ${decoded.email}`);
    next();
  } catch (error) {
    console.log('❌ Invalid token:', error.message);
    return res.status(403).json({
      success: false,
      message: 'Invalid or expired token'
    });
  }
};

// ============================================
// AUTHENTICATION ROUTES
// ============================================

// Health check (no auth required)
app.get('/api/health', (req, res) => {
  res.json({ 
    success: true, 
    message: 'CityGuide API is running!',
    timestamp: new Date().toISOString()
  });
});

// Register
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    console.log('📝 Registration attempt:', email);
    
    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, email, and password'
      });
    }
    
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters'
      });
    }
    
    // Check if user exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email'
      });
    }
    
    // Create user (password will be hashed by pre-save hook)
    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password
    });
    
    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: user._id, 
        email: user.email,
        name: user.name
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRY }
    );
    
    console.log('✅ User registered successfully:', user.email);
    
    res.status(201).json({
      success: true,
      message: 'Registration successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    console.error('❌ Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during registration'
    });
  }
});

// Login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    console.log('🔐 Login attempt:', email);
    
    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password'
      });
    }
    
    // Find user
    const user = await User.findOne({ email: email.toLowerCase() });
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }
    
    // Verify password using model method
    const isPasswordValid = await user.comparePassword(password);
    
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }
    
    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: user._id, 
        email: user.email,
        name: user.name
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRY }
    );
    
    console.log('✅ User logged in successfully:', user.email);
    
    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    console.error('❌ Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during login'
    });
  }
});

// Verify token (optional - for session restoration)
app.get('/api/auth/me', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    console.error('❌ Token validation error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// ============================================
// PROTECTED ROUTES (Require Authentication)
// ============================================

// Get cities
app.get('/api/cities', authenticateToken, async (req, res) => {
  try {
    console.log('📍 Cities requested by:', req.user.email);
    
    // Get distinct cities from places collection
    const cities = await Place.distinct('city');
    
    res.json({
      success: true,
      data: cities.sort()
    });
  } catch (error) {
    console.error('❌ Get cities error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// Get places
app.get('/api/places', authenticateToken, async (req, res) => {
  try {
    const { city, page = 1, limit = 10, sort = 'rating' } = req.query;
    console.log(`🏙️ Places requested for ${city} by:`, req.user.email);
    
    // Build query
    const query = city ? { city } : {};
    
    // Build sort object
    const sortObj = {};
    sortObj[sort] = -1; // Descending order
    
    // Get places from database
    const places = await Place.find(query)
      .sort(sortObj)
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));
    
    const totalPlaces = await Place.countDocuments(query);
    const totalPages = Math.ceil(totalPlaces / parseInt(limit));
    
    console.log(`✅ Found ${places.length} places for ${city || 'all cities'}`);
    
    res.json({
      success: true,
      data: places,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalItems: totalPlaces,
        hasNext: parseInt(page) < totalPages,
        hasPrev: parseInt(page) > 1
      }
    });
  } catch (error) {
    console.error('❌ Get places error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// Search places
app.get('/api/places/search', authenticateToken, async (req, res) => {
  try {
    const { keyword, city } = req.query;
    console.log(`🔍 Search for "${keyword}" in ${city || 'all cities'} by:`, req.user.email);
    
    // Build query
    const query = {
      $or: [
        { name: { $regex: keyword, $options: 'i' } },
        { category: { $regex: keyword, $options: 'i' } },
        { description: { $regex: keyword, $options: 'i' } }
      ]
    };
    
    if (city) {
      query.city = city;
    }
    
    const searchResults = await Place.find(query).sort({ rating: -1 });
    
    console.log(`✅ Found ${searchResults.length} results for "${keyword}"`);
    
    res.json({
      success: true,
      data: searchResults,
      pagination: {
        currentPage: 1,
        totalPages: 1,
        totalItems: searchResults.length,
        hasNext: false,
        hasPrev: false
      }
    });
  } catch (error) {
    console.error('❌ Search error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// Get place by ID
app.get('/api/places/:id', authenticateToken, async (req, res) => {
  try {
    const placeId = req.params.id;
    console.log(`📍 Place ${placeId} requested by:`, req.user.email);
    
    const place = await Place.findById(placeId);
    
    if (!place) {
      return res.status(404).json({
        success: false,
        message: 'Place not found'
      });
    }
    
    res.json({
      success: true,
      data: place
    });
  } catch (error) {
    console.error('❌ Get place error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// Get favorites
app.get('/api/favorites', authenticateToken, async (req, res) => {
  try {
    console.log('❤️ Favorites requested by:', req.user.email);
    
    const favorites = await Favorite.find({ userId: req.user.userId })
      .populate('placeId');
    
    // Map to include place details
    const favoritesWithDetails = favorites.map(fav => ({
      favoriteId: fav._id,
      _id: fav.placeId._id,
      name: fav.placeId.name,
      category: fav.placeId.category,
      city: fav.placeId.city,
      rating: fav.placeId.rating,
      description: fav.placeId.description,
      image: fav.placeId.image,
      createdAt: fav.createdAt
    }));
    
    res.json({
      success: true,
      data: favoritesWithDetails
    });
  } catch (error) {
    console.error('❌ Get favorites error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// Add to favorites
app.post('/api/favorites', authenticateToken, async (req, res) => {
  try {
    const { placeId } = req.body;
    console.log(`❤️ Add favorite ${placeId} by:`, req.user.email);
    
    // Check if place exists
    const place = await Place.findById(placeId);
    if (!place) {
      return res.status(404).json({
        success: false,
        message: 'Place not found'
      });
    }
    
    // Check if already favorited
    const existingFavorite = await Favorite.findOne({
      userId: req.user.userId,
      placeId: placeId
    });
    
    if (existingFavorite) {
      return res.status(400).json({
        success: false,
        message: 'Place already in favorites'
      });
    }
    
    // Create favorite
    const favorite = await Favorite.create({
      userId: req.user.userId,
      placeId: placeId
    });
    
    console.log(`✅ Added ${place.name} to favorites`);
    
    res.json({
      success: true,
      message: 'Added to favorites',
      data: {
        _id: favorite._id,
        userId: req.user.userId,
        placeId: placeId
      }
    });
  } catch (error) {
    console.error('❌ Add favorite error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// Remove from favorites
app.delete('/api/favorites/:id', authenticateToken, async (req, res) => {
  try {
    const favoriteId = req.params.id;
    console.log(`💔 Remove favorite ${favoriteId} by:`, req.user.email);
    
    const favorite = await Favorite.findOneAndDelete({
      _id: favoriteId,
      userId: req.user.userId
    });
    
    if (!favorite) {
      return res.status(404).json({
        success: false,
        message: 'Favorite not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Removed from favorites'
    });
  } catch (error) {
    console.error('❌ Remove favorite error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// ============================================
// ERROR HANDLING
// ============================================

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('❌ Server error:', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error'
  });
});

// ============================================
// START SERVER
// ============================================

app.listen(PORT, async () => {
  console.log('='.repeat(50));
  console.log('🚀 CityGuide Production Server Started');
  console.log('='.repeat(50));
  console.log(`📍 Server URL: http://localhost:${PORT}`);
  console.log(`🏥 Health Check: http://localhost:${PORT}/api/health`);
  console.log(`🔐 JWT Authentication: ENABLED`);
  console.log(`⏰ Token Expiry: ${JWT_EXPIRY}`);
  console.log(`📅 Started at: ${new Date().toISOString()}`);
  console.log('='.repeat(50));
  console.log('');
  
  // Show database stats
  try {
    const userCount = await User.countDocuments();
    const placeCount = await Place.countDocuments();
    const favoriteCount = await Favorite.countDocuments();
    
    console.log('📊 Database Statistics:');
    console.log(`👥 Registered Users: ${userCount}`);
    console.log(`🏙️  Total Places: ${placeCount}`);
    console.log(`❤️  Total Favorites: ${favoriteCount}`);
  } catch (error) {
    console.log('⚠️  Could not fetch database statistics');
  }
  
  console.log('');
  console.log('Ready to accept requests! 🎉');
  console.log('');
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('👋 SIGTERM received. Shutting down gracefully...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('👋 SIGINT received. Shutting down gracefully...');
  process.exit(0);
});
