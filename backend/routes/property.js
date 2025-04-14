const express = require('express');
const router = express.Router();
const Property = require('../models/Property');
const multer = require('multer');

// Configure multer to store files in memory
const upload = multer({
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

// Helper function to generate a Base64 data URL from file buffer
const bufferToDataUrl = (buffer, mimetype) => {
  return `data:${mimetype};base64,${buffer.toString('base64')}`;
};

// Get all properties
router.get('/', async (req, res) => {
  try {
    const properties = await Property.find().sort({ createdAt: -1 });
    res.json(properties);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get property by ID
router.get('/:id', async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) return res.status(404).json({ message: 'Property not found' });
    
    res.json(property);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create a new property
router.post('/', upload.array('images', 10), async (req, res) => {
  try {
    const { 
      name, cityId, city, subplace, guests, rooms, baths, beds,
      description, priceMin, priceMax, brochureLink, video, mapLink
    } = req.body;
    
    // Parse amenities from JSON string - now supports dynamic amenities
    let amenities = [];
    if (req.body.amenities) {
      amenities = JSON.parse(req.body.amenities);
    }
    
    // Process uploaded images to base64
    const images = [];
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const base64Image = file.buffer.toString('base64');
        images.push({
          data: `data:${file.mimetype};base64,${base64Image}`,
          contentType: file.mimetype
        });
      }
    }
    
    const property = new Property({
      name,
      cityId,
      city,
      subplace,
      guests: parseInt(guests),
      rooms: parseInt(rooms),
      baths: parseInt(baths),
      beds: parseInt(beds),
      description,
      priceMin: parseFloat(priceMin),
      priceMax: parseFloat(priceMax),
      brochureLink,
      video,
      mapLink,
      amenities,
      images,
      reviews: []
    });
    
    const newProperty = await property.save();
    res.status(201).json(newProperty);
  } catch (err) {
    console.error('Error creating property:', err);
    res.status(400).json({ message: err.message });
  }
});

// Update a property
router.put('/:id', upload.array('images', 10), async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) return res.status(404).json({ message: 'Property not found' });
    
    // Update text fields
    const fields = [
      'name', 'cityId', 'city', 'subplace', 'guests', 'rooms', 'baths', 'beds',
      'description', 'priceMin', 'priceMax', 'brochureLink', 'video', 'mapLink', 'isActive'
    ];
    
    fields.forEach(field => {
      if (req.body[field] !== undefined) {
        if (['guests', 'rooms', 'baths', 'beds'].includes(field)) {
          property[field] = parseInt(req.body[field]);
        } else if (['priceMin', 'priceMax'].includes(field)) {
          property[field] = parseFloat(req.body[field]);
        } else if (field === 'isActive') {
          property[field] = req.body[field] === 'true';
        } else {
          property[field] = req.body[field];
        }
      }
    });
    
    // Update amenities if provided - now handling dynamic amenities
    if (req.body.amenities) {
      property.amenities = JSON.parse(req.body.amenities);
    }
    
    // Add new images if uploaded
    if (req.files && req.files.length > 0) {
      const newImages = [];
      for (const file of req.files) {
        const base64Image = file.buffer.toString('base64');
        newImages.push({
          data: `data:${file.mimetype};base64,${base64Image}`,
          contentType: file.mimetype
        });
      }
      
      property.images = [...property.images, ...newImages];
    }
    
    // Remove images if specified
    if (req.body.removeImages) {
      const removeIds = req.body.removeImages.split(',');
      property.images = property.images.filter((_, index) => !removeIds.includes(index.toString()));
    }
    
    const updatedProperty = await property.save();
    res.json(updatedProperty);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete a property
router.delete('/:id', async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) return res.status(404).json({ message: 'Property not found' });
    
    await property.deleteOne();
    res.json({ message: 'Property deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add a review to a property
router.post('/:id/reviews', upload.single('profilePicture'), async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) return res.status(404).json({ message: 'Property not found' });
    
    // Check if profile picture was uploaded
    let profilePictureData = req.body.profilePicture || '';
    
    // If a file was uploaded, convert to data URL
    if (req.file) {
      profilePictureData = bufferToDataUrl(req.file.buffer, req.file.mimetype);
    }
    
    // Create new review with source field
    const newReview = {
      userName: req.body.userName,
      profilePicture: profilePictureData,
      rating: parseInt(req.body.rating),
      description: req.body.description,
      source: req.body.source || 'direct', // Set review source with default to 'direct'
      isActive: req.body.isActive === 'true' || req.body.isActive === true
    };
    
    // Add the review to the property
    property.reviews.push(newReview);
    
    // Save the property (this will trigger the pre-save hook to update ratings)
    const updatedProperty = await property.save();
    
    res.status(201).json(updatedProperty);
  } catch (err) {
    console.error('Error adding review:', err);
    res.status(400).json({ message: err.message });
  }
});

// Update a review
router.put('/:id/reviews/:reviewId', upload.single('profilePicture'), async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) return res.status(404).json({ message: 'Property not found' });
    
    // Find the review by its ID (MongoDB ObjectId)
    const reviewIndex = property.reviews.findIndex(review => 
      review._id.toString() === req.params.reviewId
    );
    
    if (reviewIndex === -1) return res.status(404).json({ message: 'Review not found' });
    
    // Check if a new profile picture was uploaded
    if (req.file) {
      const profilePictureData = bufferToDataUrl(req.file.buffer, req.file.mimetype);
      property.reviews[reviewIndex].profilePicture = profilePictureData;
    }
    
    // Update review fields if provided
    if (req.body.userName) property.reviews[reviewIndex].userName = req.body.userName;
    if (req.body.rating) property.reviews[reviewIndex].rating = parseInt(req.body.rating);
    if (req.body.description) property.reviews[reviewIndex].description = req.body.description;
    if (req.body.source) property.reviews[reviewIndex].source = req.body.source; // Update source field
    if (req.body.isActive !== undefined) {
      property.reviews[reviewIndex].isActive = req.body.isActive === 'true' || req.body.isActive === true;
    }
    
    // Save the property (this will trigger the pre-save hook to update ratings)
    const updatedProperty = await property.save();
    
    res.json(updatedProperty);
  } catch (err) {
    console.error('Error updating review:', err);
    res.status(400).json({ message: err.message });
  }
});

// Delete a review
router.delete('/:id/reviews/:reviewId', async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) return res.status(404).json({ message: 'Property not found' });
    
    // Find the review by its ID
    const reviewIndex = property.reviews.findIndex(review => 
      review._id.toString() === req.params.reviewId
    );
    
    if (reviewIndex === -1) return res.status(404).json({ message: 'Review not found' });
    
    // Remove the review from the array
    property.reviews.splice(reviewIndex, 1);
    
    // Save the property (this will trigger the pre-save hook to update ratings)
    await property.save();
    
    res.json({ message: 'Review deleted successfully' });
  } catch (err) {
    console.error('Error deleting review:', err);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;