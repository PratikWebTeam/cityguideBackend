const Place = require('../models/Place');

// Get places with pagination and sorting
const getPlaces = async (req, res) => {
  try {
    const { city, page = 1, limit = 10, sort = 'rating' } = req.query;
    
    const query = city ? { city } : {};
    const sortOrder = sort === 'rating' ? { rating: -1 } : { [sort]: -1 };
    
    const places = await Place.find(query)
      .sort(sortOrder)
      .skip((page - 1) * limit)
      .limit(parseInt(limit));
    
    const total = await Place.countDocuments(query);
    
    res.json({
      success: true,
      data: places,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        hasNext: page * limit < total,
        hasPrev: page > 1
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Get place by ID
const getPlaceById = async (req, res) => {
  try {
    const place = await Place.findById(req.params.id);
    
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
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Search places
const searchPlaces = async (req, res) => {
  try {
    const { keyword, page = 1, limit = 5 } = req.query;
    
    if (!keyword) {
      return res.status(400).json({
        success: false,
        message: 'Keyword is required'
      });
    }
    
    const query = {
      $or: [
        { name: { $regex: keyword, $options: 'i' } },
        { category: { $regex: keyword, $options: 'i' } }
      ]
    };
    
    const places = await Place.find(query)
      .sort({ rating: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));
    
    const total = await Place.countDocuments(query);
    
    res.json({
      success: true,
      data: places,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        hasNext: page * limit < total,
        hasPrev: page > 1
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

module.exports = { getPlaces, getPlaceById, searchPlaces };