// backend/models/Banner.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BannerSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  subtitle: {
    type: String,
    default: ''
  },
  imageUrl: {
    type: String,
    required: true
  },
  // Add new field for banner type
  bannerType: {
    type: String,
    enum: ['desktop', 'mobile', 'both'],
    default: 'desktop'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  order: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field on save
BannerSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Banner', BannerSchema);