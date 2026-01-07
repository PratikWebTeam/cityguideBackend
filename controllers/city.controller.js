const Place = require('../models/Place');

// Get all cities
const getCities = async (req, res) => {
  try {
    const cities = await Place.distinct('city');
    
    res.json({
      success: true,
      data: cities.sort()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

module.exports = { getCities };