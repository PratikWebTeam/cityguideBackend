const Favorite = require('../models/Favorite');
const Place = require('../models/Place');

// Add to favorites
const addFavorite = async (req, res) => {
  try {
    const { placeId } = req.body;
    const userId = req.user._id;

    if (!placeId) {
      return res.status(400).json({
        success: false,
        message: 'Place ID is required'
      });
    }

    // Check if place exists
    const place = await Place.findById(placeId);
    if (!place) {
      return res.status(404).json({
        success: false,
        message: 'Place not found'
      });
    }

    // Check if already favorited
    const existingFavorite = await Favorite.findOne({ userId, placeId });
    if (existingFavorite) {
      return res.status(400).json({
        success: false,
        message: 'Place already in favorites'
      });
    }

    const favorite = await Favorite.create({ userId, placeId });
    
    res.status(201).json({
      success: true,
      message: 'Added to favorites',
      data: favorite
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Get user favorites
const getFavorites = async (req, res) => {
  try {
    const userId = req.user._id;
    
    const favorites = await Favorite.find({ userId })
      .populate('placeId')
      .sort({ createdAt: -1 });
    
    const places = favorites.map(fav => ({
      favoriteId: fav._id,
      ...fav.placeId.toObject()
    }));
    
    res.json({
      success: true,
      data: places
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Remove from favorites
const removeFavorite = async (req, res) => {
  try {
    const favoriteId = req.params.id;
    const userId = req.user._id;
    
    const favorite = await Favorite.findOneAndDelete({ 
      _id: favoriteId, 
      userId 
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
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

module.exports = { addFavorite, getFavorites, removeFavorite };