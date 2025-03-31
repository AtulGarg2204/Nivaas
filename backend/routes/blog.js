// backend/routes/blog.js
const express = require('express');
const router = express.Router();
const Blog = require('../models/Blog');
const multer = require('multer');

// Configure multer to store files in memory
const upload = multer({
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

// Define file upload middleware
const uploadFields = upload.fields([
  { name: 'backgroundImage', maxCount: 1 },
  { name: 'mustVisitImages', maxCount: 10 }
]);

// Get all blogs
router.get('/', async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ createdAt: -1 });
    res.json(blogs);
  } catch (err) {
    console.error('Error fetching blogs:', err);
    res.status(500).json({ message: err.message });
  }
});

// Get blog by ID
router.get('/:id', async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: 'Blog not found' });
    
    res.json(blog);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create a new blog
router.post('/', uploadFields, async (req, res) => {
  try {
    const { title, description, mustVisitData } = req.body;
    
    // Validate required fields
    if (!title || !description) {
      return res.status(400).json({ message: 'Title and description are required' });
    }
    
    // Check if background image exists
    if (!req.files || !req.files.backgroundImage) {
      return res.status(400).json({ message: 'Background image is required' });
    }
    
    // Process background image
    const backgroundFile = req.files.backgroundImage[0];
    const backgroundBase64 = backgroundFile.buffer.toString('base64');
    const backgroundImage = {
      data: `data:${backgroundFile.mimetype};base64,${backgroundBase64}`,
      contentType: backgroundFile.mimetype
    };
    
    // Process must visit things
    let mustVisitThings = [];
    if (mustVisitData) {
      try {
        const parsedMustVisit = JSON.parse(mustVisitData);
        mustVisitThings = parsedMustVisit;
        
        // Process images for each must visit item
        if (req.files.mustVisitImages && mustVisitThings.length > 0) {
          const imageFiles = req.files.mustVisitImages;
          
          // Ensure we have the right number of images
          if (imageFiles.length !== mustVisitThings.length) {
            return res.status(400).json({ 
              message: 'Number of must visit item images does not match number of items' 
            });
          }
          
          // Add images to each must visit item
          mustVisitThings = mustVisitThings.map((item, index) => {
            const file = imageFiles[index];
            const base64 = file.buffer.toString('base64');
            
            return {
              ...item,
              image: {
                data: `data:${file.mimetype};base64,${base64}`,
                contentType: file.mimetype
              }
            };
          });
        }
      } catch (err) {
        console.error('Error parsing mustVisitData:', err);
        return res.status(400).json({ message: 'Invalid must visit data format' });
      }
    }
    
    // Create new blog
    const blog = new Blog({
      title,
      description,
      backgroundImage,
      mustVisitThings
    });
    
    const savedBlog = await blog.save();
    res.status(201).json(savedBlog);
  } catch (err) {
    console.error('Error creating blog:', err);
    res.status(400).json({ message: err.message });
  }
});

// Update a blog
router.put('/:id', uploadFields, async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: 'Blog not found' });
    
    const { title, description, mustVisitData, isActive } = req.body;
    
    // Update text fields
    if (title) blog.title = title;
    if (description) blog.description = description;
    if (isActive !== undefined) blog.isActive = isActive === 'true';
    
    // Update background image if provided
    if (req.files && req.files.backgroundImage) {
      const backgroundFile = req.files.backgroundImage[0];
      const backgroundBase64 = backgroundFile.buffer.toString('base64');
      blog.backgroundImage = {
        data: `data:${backgroundFile.mimetype};base64,${backgroundBase64}`,
        contentType: backgroundFile.mimetype
      };
    }
    
    // Update must visit things if provided
    if (mustVisitData) {
      try {
        const parsedMustVisit = JSON.parse(mustVisitData);
        
        // Process images for must visit items if present
        if (req.files && req.files.mustVisitImages) {
          const imageMap = req.body.imageMap ? JSON.parse(req.body.imageMap) : {};
          const imageFiles = req.files.mustVisitImages;
          
          // Merge existing and new must visit items
          blog.mustVisitThings = parsedMustVisit.map((item, index) => {
            // If item has an id, it's an existing item
            if (item.id) {
              const existingItem = blog.mustVisitThings.find(t => t._id.toString() === item.id);
              
              // Update heading and description
              if (existingItem) {
                existingItem.heading = item.heading;
                existingItem.description = item.description;
                
                // Update image if provided for this item
                if (imageMap[item.id] !== undefined) {
                  const imageIndex = imageMap[item.id];
                  const file = imageFiles[imageIndex];
                  const base64 = file.buffer.toString('base64');
                  
                  existingItem.image = {
                    data: `data:${file.mimetype};base64,${base64}`,
                    contentType: file.mimetype
                  };
                }
                
                return existingItem;
              }
            }
            
            // New item - needs an image
            const imageIndex = imageMap[`new-${index}`] !== undefined ? 
              imageMap[`new-${index}`] : 
              Object.values(imageMap).length;
            
            if (imageIndex >= imageFiles.length) {
              throw new Error(`Missing image for new item at index ${index}`);
            }
            
            const file = imageFiles[imageIndex];
            const base64 = file.buffer.toString('base64');
            
            return {
              heading: item.heading,
              description: item.description,
              image: {
                data: `data:${file.mimetype};base64,${base64}`,
                contentType: file.mimetype
              }
            };
          });
        } else {
          // Just update text fields for existing items
          blog.mustVisitThings = parsedMustVisit.map(item => {
            if (item.id) {
              const existingItem = blog.mustVisitThings.find(t => t._id.toString() === item.id);
              if (existingItem) {
                existingItem.heading = item.heading;
                existingItem.description = item.description;
                return existingItem;
              }
            }
            // If no image provided for new item, can't add it
            throw new Error('New must visit items require images');
          });
        }
      } catch (err) {
        console.error('Error updating must visit things:', err);
        return res.status(400).json({ message: err.message });
      }
    }
    
    const updatedBlog = await blog.save();
    res.json(updatedBlog);
  } catch (err) {
    console.error('Error updating blog:', err);
    res.status(400).json({ message: err.message });
  }
});

// Delete a blog
router.delete('/:id', async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: 'Blog not found' });
    
    await blog.deleteOne();
    res.json({ message: 'Blog deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;