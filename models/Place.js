const mongoose = require('mongoose');

const placeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Place name is required'],
    trim: true
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['cafe', 'restaurant', 'park', 'museum', 'shopping', 'entertainment']
  },
  city: {
    type: String,
    required: [true, 'City is required'],
    trim: true
  },
  rating: {
    type: Number,
    required: [true, 'Rating is required'],
    min: 1,
    max: 5,
    default: 4.0
  },
  description: {
    type: String,
    required: [true, 'Description is required']
  },
  image: {
    type: String,
    default: 'https://via.placeholder.com/300x200'
  }
}, {
  timestamps: true
});

// Index for better search performance
placeSchema.index({ name: 'text', category: 'text' });
placeSchema.index({ city: 1, rating: -1 });

module.exports = mongoose.model('Place', placeSchema);