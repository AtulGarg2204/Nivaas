// backend/routes/review.js
const express = require('express');
const router = express.Router();
const Review = require('../models/Review');
const multer = require('multer');

// Configure multer to store files in memory
const upload = multer({
  limits: {
    fileSize: 2 * 1024 * 1024 // 2MB limit
  }
});

// Multiple file upload middleware
const uploadFields = upload.fields([
  { name: 'profilePicture', maxCount: 1 },
  { name: 'referenceAppLogo', maxCount: 1 }
]);

// Get all reviews
router.get('/', async (req, res) => {
  try {
    const reviews = await Review.find().sort({ createdAt: -1 });
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get reviews by city
router.get('/city/:cityId', async (req, res) => {
  try {
    const reviews = await Review.find({ 
      cityId: req.params.cityId,
      isActive: true
    }).sort({ createdAt: -1 });
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create a new review
router.post('/', uploadFields, async (req, res) => {
  try {
    const { userName, cityId, city, rating, description, referenceAppName } = req.body;
    
    // Process uploaded profile picture to base64
    let profilePicture = '';
    if (req.files && req.files.profilePicture && req.files.profilePicture[0]) {
      const file = req.files.profilePicture[0];
      const base64Image = file.buffer.toString('base64');
      profilePicture = `data:${file.mimetype};base64,${base64Image}`;
    }
    
    // Process uploaded reference app logo to base64
    let referenceAppLogo = '';
    if (req.files && req.files.referenceAppLogo && req.files.referenceAppLogo[0]) {
      const file = req.files.referenceAppLogo[0];
      const base64Image = file.buffer.toString('base64');
      referenceAppLogo = `data:${file.mimetype};base64,${base64Image}`;
    }
    
    const review = new Review({
      userName,
      cityId,
      city,
      rating: parseInt(rating),
      description,
      profilePicture,
      referenceApp: {
        name: referenceAppName || '',
        logo: referenceAppLogo
      }
    });
    
    const newReview = await review.save();
    res.status(201).json(newReview);
  } catch (err) {
    console.error('Error creating review:', err);
    res.status(400).json({ message: err.message });
  }
});

// Update a review
router.put('/:id', uploadFields, async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ message: 'Review not found' });
    
    // Update text fields
    const fields = ['userName', 'cityId', 'city', 'rating', 'description', 'isActive'];
    fields.forEach(field => {
      if (req.body[field] !== undefined) {
        if (field === 'rating') {
          review[field] = parseInt(req.body[field]);
        } else if (field === 'isActive') {
          review[field] = req.body[field] === 'true';
        } else {
          review[field] = req.body[field];
        }
      }
    });
    
    // Update reference app name if provided
    if (req.body.referenceAppName !== undefined) {
      review.referenceApp.name = req.body.referenceAppName;
    }
    
    // Update profile picture if provided
    if (req.files && req.files.profilePicture && req.files.profilePicture[0]) {
      const file = req.files.profilePicture[0];
      const base64Image = file.buffer.toString('base64');
      review.profilePicture = `data:${file.mimetype};base64,${base64Image}`;
    }
    
    // Update reference app logo if provided
    if (req.files && req.files.referenceAppLogo && req.files.referenceAppLogo[0]) {
      const file = req.files.referenceAppLogo[0];
      const base64Image = file.buffer.toString('base64');
      review.referenceApp.logo = `data:${file.mimetype};base64,${base64Image}`;
    }
    
    const updatedReview = await review.save();
    res.json(updatedReview);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Toggle review status
router.put('/:id/toggle-status', async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ message: 'Review not found' });
    
    review.isActive = req.body.isActive;
    const updatedReview = await review.save();
    res.json(updatedReview);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete a review
router.delete('/:id', async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ message: 'Review not found' });
    
    await review.deleteOne();
    res.json({ message: 'Review deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;