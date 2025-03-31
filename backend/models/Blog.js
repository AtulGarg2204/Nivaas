// backend/models/Blog.js
const mongoose = require('mongoose');

const MustVisitSchema = new mongoose.Schema({
  heading: {
    type: String,
    required: true
  },
  image: {
    data: {
      type: String, // Base64 encoded image data
      required: true
    },
    contentType: {
      type: String,
      required: true
    }
  },
  description: {
    type: String,
    required: true
  }
});

const BlogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  backgroundImage: {
    data: {
      type: String, // Base64 encoded image data
      required: true
    },
    contentType: {
      type: String,
      required: true
    }
  },
  description: {
    type: String,
    required: true
  },
  mustVisitThings: [MustVisitSchema],
  isActive: {
    type: Boolean,
    default: true
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

// Update the updatedAt field on document save
BlogSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Blog', BlogSchema);