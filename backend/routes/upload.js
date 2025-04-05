// backend/routes/upload.js
const express = require('express');
const router = express.Router();
const multer = require('multer');

// Configure multer to store files in memory
const storage = multer.memoryStorage();

// Configure upload settings
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// Handle CKEditor image uploads
router.post('/ckeditor-image', upload.single('upload'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        uploaded: 0,
        error: {
          message: 'No image file provided'
        }
      });
    }

    // Convert file to base64
    const imageBase64 = req.file.buffer.toString('base64');
    const imageUrl = `data:${req.file.mimetype};base64,${imageBase64}`;

    // Return the response in the format CKEditor expects
    res.json({
      uploaded: 1,
      fileName: req.file.originalname,
      url: imageUrl
    });
  } catch (err) {
    console.error('Error uploading CKEditor image:', err);
    res.status(500).json({
      uploaded: 0,
      error: {
        message: 'Could not upload the image: ' + err.message
      }
    });
  }
});

module.exports = router;