// // backend/routes/city.js
// const express = require('express');
// const router = express.Router();
// const City = require('../models/City');

// // Get all cities
// router.get('/', async (req, res) => {
//   try {
//     const cities = await City.find();
//     res.json(cities);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });

// // Create a new city
// router.post('/', async (req, res) => {
//   const city = new City({
//     name: req.body.name,
//     image: req.body.image,
//     isActive: req.body.isActive,
//     thingsToDo: req.body.thingsToDo || []
//   });

//   try {
//     const newCity = await city.save();
//     res.status(201).json(newCity);
//   } catch (err) {
//     res.status(400).json({ message: err.message });
//   }
// });
// // Get city by ID
// router.get('/:id', async (req, res) => {
//   try {
//     const city = await City.findById(req.params.id);
//     if (!city) return res.status(404).json({ message: 'City not found' });
    
//     res.json(city);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });

// // Update a city
// router.put('/:id', async (req, res) => {
//   try {
//     const city = await City.findById(req.params.id);
//     if (!city) return res.status(404).json({ message: 'City not found' });
    
//     if (req.body.name) city.name = req.body.name;
//     if (req.body.image) city.image = req.body.image;
//     if (req.body.isActive !== undefined) city.isActive = req.body.isActive;
//     if (req.body.thingsToDo) city.thingsToDo = req.body.thingsToDo;
    
//     const updatedCity = await city.save();
//     res.json(updatedCity);
//   } catch (err) {
//     res.status(400).json({ message: err.message });
//   }
// });

// // Delete a city
// router.delete('/:id', async (req, res) => {
//   try {
//     const city = await City.findById(req.params.id);
//     if (!city) return res.status(404).json({ message: 'City not found' });
    
//     await city.deleteOne();
//     res.json({ message: 'City deleted' });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });

// module.exports = router;

// backend/routes/city.js
// backend/routes/city.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const City = require('../models/City');

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

// Get all cities
router.get('/', async (req, res) => {
  try {
    const cities = await City.find().sort({ name: 1 });
    res.json(cities);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get active cities
router.get('/active', async (req, res) => {
  try {
    const cities = await City.find({ isActive: true }).sort({ name: 1 });
    res.json(cities);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get city by ID
router.get('/:id', async (req, res) => {
  try {
    const city = await City.findById(req.params.id);
    if (!city) return res.status(404).json({ message: 'City not found' });
    
    res.json(city);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create a new city with file upload support
router.post('/', upload.single('image'), async (req, res) => {
  try {
    let imageData = req.body.image || '';
    
    // If a file was uploaded, convert to data URL
    if (req.file) {
      imageData = bufferToDataUrl(req.file.buffer, req.file.mimetype);
    }
    
    // Parse thingsToDo if it's a JSON string
    let thingsToDo = [];
    if (req.body.thingsToDo) {
      thingsToDo = typeof req.body.thingsToDo === 'string' 
        ? JSON.parse(req.body.thingsToDo) 
        : req.body.thingsToDo;
    }
    
    const city = new City({
      name: req.body.name,
      image: imageData,
      isActive: req.body.isActive === 'true' || req.body.isActive === true,
      thingsToDo: thingsToDo
    });

    const newCity = await city.save();
    res.status(201).json(newCity);
  } catch (err) {
    console.error('Error creating city:', err);
    res.status(400).json({ message: err.message });
  }
});

// Update a city with file upload support
router.put('/:id', upload.single('image'), async (req, res) => {
  try {
    const city = await City.findById(req.params.id);
    if (!city) return res.status(404).json({ message: 'City not found' });
    
    // Keep existing image unless a new one is provided
    let imageData = req.body.image || city.image;
    
    // If a file was uploaded, convert to data URL
    if (req.file) {
      imageData = bufferToDataUrl(req.file.buffer, req.file.mimetype);
    }
    
    // Parse thingsToDo if it's a JSON string
    let thingsToDo = city.thingsToDo;
    if (req.body.thingsToDo) {
      thingsToDo = typeof req.body.thingsToDo === 'string' 
        ? JSON.parse(req.body.thingsToDo) 
        : req.body.thingsToDo;
    }
    
    city.name = req.body.name || city.name;
    city.image = imageData;
    city.isActive = req.body.isActive === 'true' || req.body.isActive === true;
    city.thingsToDo = thingsToDo;
    
    const updatedCity = await city.save();
    res.json(updatedCity);
  } catch (err) {
    console.error('Error updating city:', err);
    res.status(400).json({ message: err.message });
  }
});

// Update a city's active status
router.patch('/:id/status', async (req, res) => {
  try {
    const city = await City.findById(req.params.id);
    if (!city) return res.status(404).json({ message: 'City not found' });
    
    city.isActive = req.body.isActive;
    const updatedCity = await city.save();
    
    res.json(updatedCity);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete a city
router.delete('/:id', async (req, res) => {
  try {
    const city = await City.findById(req.params.id);
    if (!city) return res.status(404).json({ message: 'City not found' });
    
    await city.deleteOne();
    res.json({ message: 'City deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;