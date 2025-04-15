const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
  userName: {
    type: String,
    required: true
  },
  cityId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'City',
    required: true
  },
  city: {
    type: String,
    required: true
  },
  propertyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Property'
    // Not required to maintain backward compatibility
  },
  propertyName: {
    type: String,
    default: '' // Store the property name for easy access
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  description: {
    type: String,
    required: true
  },
  profilePicture: {
    type: String, // Base64 encoded image
    default: '' // No longer required
  },
  // Changed from referenceApp object to source field
  source: {
    type: String,
    enum: ['airbnb', 'makemytrip', 'goibibo', 'google', 'airbnb'],
    default: ''
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Review', ReviewSchema);