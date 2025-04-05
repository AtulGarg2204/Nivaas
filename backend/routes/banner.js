// backend/routes/banner.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const Banner = require('../models/Banner');

// For image uploads, use memory storage
const storage = multer.memoryStorage();

// Configure upload settings
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|gif|webp/;
    const mimetype = filetypes.test(file.mimetype);
    
    if (mimetype) {
      return cb(null, true);
    }
    cb(new Error('Only image files are allowed!'));
  }
});

// Helper function to generate a Base64 data URL from file buffer
const bufferToDataUrl = (buffer, mimetype) => {
  return `data:${mimetype};base64,${buffer.toString('base64')}`;
};

// Get all banners
router.get('/', async (req, res) => {
  try {
    const banners = await Banner.find().sort({ order: 1 });
    console.log('Fetched banners:', banners); // Debug log
    res.json(banners);
  } catch (err) {
    console.error('Error fetching banners:', err);
    res.status(500).json({ message: err.message });
  }
});

// Get banners by type
router.get('/type/:bannerType', async (req, res) => {
  try {
    const { bannerType } = req.params;
    // Get banners that are either specific type or 'both'
    const banners = await Banner.find({
      $or: [
        { bannerType },
        { bannerType: 'both' }
      ],
      isActive: true
    }).sort({ order: 1 });
    
    res.json(banners);
  } catch (err) {
    console.error(`Error fetching ${req.params.bannerType} banners:`, err);
    res.status(500).json({ message: err.message });
  }
});

// Create a new banner with file upload support
router.post('/', upload.single('image'), async (req, res) => {
  try {
    let imageUrl = req.body.imageUrl || '';
    
    // If a file was uploaded, convert to data URL
    if (req.file) {
      imageUrl = bufferToDataUrl(req.file.buffer, req.file.mimetype);
    }
    
    const banner = new Banner({
      title: req.body.title,
      subtitle: req.body.subtitle,
      imageUrl: imageUrl,
      bannerType: req.body.bannerType || 'desktop', // Add bannerType
      isActive: req.body.isActive === 'true' || req.body.isActive === true,
      order: req.body.order !== undefined ? Number(req.body.order) : 0
    });

    const newBanner = await banner.save();
    res.status(201).json(newBanner);
  } catch (err) {
    console.error('Error creating banner:', err);
    res.status(400).json({ message: err.message });
  }
});

// Update a banner with file upload support
router.put('/:id', upload.single('image'), async (req, res) => {
  try {
    const banner = await Banner.findById(req.params.id);
    if (!banner) return res.status(404).json({ message: 'Banner not found' });
    
    // Keep existing image unless a new one is provided
    let imageUrl = req.body.imageUrl || banner.imageUrl;
    
    // If a file was uploaded, convert to data URL
    if (req.file) {
      imageUrl = bufferToDataUrl(req.file.buffer, req.file.mimetype);
    }
    
    banner.title = req.body.title || banner.title;
    banner.subtitle = req.body.subtitle || banner.subtitle;
    banner.imageUrl = imageUrl;
    banner.bannerType = req.body.bannerType || banner.bannerType; // Add bannerType
    banner.isActive = req.body.isActive === 'true' || req.body.isActive === true;
    banner.order = req.body.order !== undefined ? Number(req.body.order) : banner.order;
    
    const updatedBanner = await banner.save();
    res.json(updatedBanner);
  } catch (err) {
    console.error('Error updating banner:', err);
    res.status(400).json({ message: err.message });
  }
});

// Delete a banner
router.delete('/:id', async (req, res) => {
  console.log("Deleting banner with ID:", req.params.id);
  try {
    const banner = await Banner.findById(req.params.id);
    if (!banner) return res.status(404).json({ message: 'Banner not found' });
    
    // Use deleteOne() instead of remove()
    await Banner.deleteOne({ _id: req.params.id });
    res.json({ message: 'Banner deleted' });
  } catch (err) {
    console.error("Error deleting banner:", err);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;