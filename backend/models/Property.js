const mongoose = require('mongoose');

const AmenitySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  icon: {
    type: String,
    required: true
  }
});

const ImageSchema = new mongoose.Schema({
  data: {
    type: String, // Base64 encoded image data
    required: true
  },
  contentType: {
    type: String,
    required: true
  }
});

const ReviewSchema = new mongoose.Schema({
  userName: {
    type: String,
    required: true
  },
  profilePicture: {
    type: String, // Base64 encoded image data
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
  // Fixed source field: added empty string to enum values
  source: {
    type: String,
    enum: ['', 'airbnb', 'makemytrip', 'goibibo', 'google'],
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

const RatingSchema = new mongoose.Schema({
  average: {
    type: Number,
    default: 0
  },
  count: {
    type: Number,
    default: 0
  }
});

const PropertySchema = new mongoose.Schema({
  name: {
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
  subplace: {
    type: String,
    default: ''
  },
  guests: {
    type: Number,
    required: true
  },
  rooms: {
    type: Number,
    required: true
  },
  baths: {
    type: Number,
    required: true
  },
  beds: {
    type: Number,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  // Replacing single price with price range
  priceMin: {
    type: Number,
    required: true
  },
  priceMax: {
    type: Number,
    required: true
  },
  brochureLink: {
    type: String,
    default: ''
  },
  video: {
    type: String,
    default: ''
  },
  mapLink: {
    type: String,
    default: ''
  },
  amenities: [AmenitySchema],
  images: [ImageSchema],
  reviews: [ReviewSchema],
  rating: {
    type: RatingSchema,
    default: () => ({ average: 0, count: 0 })
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

// Pre-save middleware to calculate average rating
PropertySchema.pre('save', function(next) {
  if (this.reviews && this.reviews.length > 0) {
    const totalRating = this.reviews.reduce((sum, review) => {
      // Only include active reviews in the calculation
      if (review.isActive) {
        return sum + review.rating;
      }
      return sum;
    }, 0);
    
    const activeReviews = this.reviews.filter(review => review.isActive);
    
    this.rating.average = activeReviews.length > 0 ? totalRating / activeReviews.length : 0;
    this.rating.count = activeReviews.length;
  } else {
    this.rating.average = 0;
    this.rating.count = 0;
  }
  
  next();
});

module.exports = mongoose.model('Property', PropertySchema);