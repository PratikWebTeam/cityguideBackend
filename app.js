const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

// Route imports
const authRoutes = require('./routes/auth.routes');
const cityRoutes = require('./routes/city.routes');
const placeRoutes = require('./routes/place.routes');
const favoriteRoutes = require('./routes/favorite.routes');

const app = express();

// Connect to database
connectDB();

// --------------------
// CORS (ALLOW ALL)
// --------------------
app.use(cors({
  origin: '*',              // Allow all origins
  methods: '*',             // Allow all HTTP methods
  allowedHeaders: '*',      // Allow all headers
}));

// Handle preflight requests explicitly
app.options('*', cors());

// --------------------
// Middleware
// --------------------
app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
  console.log(`📨 ${req.method} ${req.path}`);
  next();
});

// --------------------
// Routes
// --------------------
app.use('/api/auth', authRoutes);
app.use('/api/cities', cityRoutes);
app.use('/api/places', placeRoutes);
app.use('/api/favorites', favoriteRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'CityGuide API is running!' });
});

// --------------------
// Error handling
// --------------------
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Something went wrong!'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

module.exports = app;
