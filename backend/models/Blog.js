// backend/models/Blog.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BlogSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  // Add city field
  city: {
    cityId: {
      type: String
    },
    cityName: {
      type: String
    }
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
  // CKEditor content field
  editorContent: {
    type: String, // Stores HTML from CKEditor
    default: ''
  },
  // New fields for blog image and its description
  blogImage: {
    data: {
      type: String, // Base64 encoded image data
      required: true
    },
    contentType: {
      type: String,
      required: true
    }
  },
  blogImageDescription: {
    type: String,
    required: true
  },
  // Reference to "things to do" from cities - use proper ObjectId reference
  mustVisitThings: [{
    type: String // Store as string IDs for simplicity
  }],
  // Store the actual things to do data to avoid lookup issues
  mustVisitThingsData: [{
    thingId: {
      type: String,
      required: true
    },
    cityId: {
      type: String,
      required: true
    },
    cityName: {
      type: String,
      required: true
    },
    heading: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    image: {
      data: String,
      contentType: String
    }
  }],
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