// backend/routes/blog.js
const express = require('express');
const router = express.Router();
const Blog = require('../models/Blog');
const City = require('../models/City');
const multer = require('multer');

// Configure multer to store files in memory
const storage = multer.memoryStorage();

// Configure upload settings
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// Define file upload middleware
const uploadFields = upload.fields([
  { name: 'backgroundImage', maxCount: 1 },
  { name: 'blogImage', maxCount: 1 }
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

// Get active blogs
router.get('/active', async (req, res) => {
  try {
    const blogs = await Blog.find({ isActive: true }).sort({ createdAt: -1 });
    res.json(blogs);
  } catch (err) {
    console.error('Error fetching active blogs:', err);
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

// Helper to retrieve things to do data from cities
async function getThingsToDo(thingIds) {
  try {
    // We need to find all the things by their IDs which are spread across cities
    // Handle ObjectId conversion safely by using string comparison
    const cities = await City.find();
    
    // Extract the selected things from each city and add city info
    const thingsToDoData = [];
    
    thingIds.forEach(thingId => {
      // Find the city containing this thing
      for (const city of cities) {
        const thing = city.thingsToDo.find(t => t._id.toString() === thingId);
        if (thing) {
          thingsToDoData.push({
            thingId: thing._id.toString(),
            cityId: city._id.toString(),
            cityName: city.name,
            heading: thing.heading,
            description: thing.description,
            image: thing.image
          });
          break; // Found the thing, move to the next one
        }
      }
    });
    
    return thingsToDoData;
  } catch (error) {
    console.error('Error retrieving things to do:', error);
    throw error;
  }
}

// Create a new blog
router.post('/', uploadFields, async (req, res) => {
  try {
    const { 
      title, 
      description, 
      blogImageDescription, 
      isActive, 
      cityId, 
      cityName,
      editorContent  // Add this to handle the CKEditor content
    } = req.body;
    
    let thingsToDo = [];
    
    // Parse things to do IDs
    if (req.body.thingsToDo) {
      try {
        thingsToDo = JSON.parse(req.body.thingsToDo);
      } catch (e) {
        return res.status(400).json({ message: 'Invalid things to do format' });
      }
    }
    
    // Validate required fields
    if (!title || !description || !blogImageDescription) {
      return res.status(400).json({ message: 'Title, description, and blog image description are required' });
    }
    
    // Check if images exist
    if (!req.files || !req.files.backgroundImage || !req.files.blogImage) {
      return res.status(400).json({ message: 'Background image and blog image are required' });
    }
    
    // Process background image
    const backgroundFile = req.files.backgroundImage[0];
    const backgroundBase64 = backgroundFile.buffer.toString('base64');
    const backgroundImage = {
      data: `data:${backgroundFile.mimetype};base64,${backgroundBase64}`,
      contentType: backgroundFile.mimetype
    };
    
    // Process blog image
    const blogImageFile = req.files.blogImage[0];
    const blogImageBase64 = blogImageFile.buffer.toString('base64');
    const blogImage = {
      data: `data:${blogImageFile.mimetype};base64,${blogImageBase64}`,
      contentType: blogImageFile.mimetype
    };
    
    // Get full details for things to do
    let mustVisitThingsData = [];
    if (thingsToDo.length > 0) {
      mustVisitThingsData = await getThingsToDo(thingsToDo);
    }
    
    // Create city object if cityId is provided
    let city = null;
    if (cityId) {
      city = {
        cityId: cityId,
        cityName: cityName || ''
      };
    }
    
    // Create new blog - ensure we're using strings for IDs
    const blog = new Blog({
      title,
      description,
      backgroundImage,
      blogImage,
      blogImageDescription,
      editorContent,  // Add CKEditor content
      city, // Add city information
      mustVisitThings: thingsToDo.map(id => id.toString()), // Store as strings
      mustVisitThingsData, // Store full data
      isActive: isActive === 'true' || isActive === true
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
    
    const { 
      title, 
      description, 
      blogImageDescription, 
      isActive, 
      cityId, 
      cityName,
      editorContent  // Add this to handle the CKEditor content
    } = req.body;
    
    let thingsToDo = [];
    
    // Parse things to do IDs
    if (req.body.thingsToDo) {
      try {
        thingsToDo = JSON.parse(req.body.thingsToDo);
      } catch (e) {
        return res.status(400).json({ message: 'Invalid things to do format' });
      }
    }
    
    // Update text fields
    if (title) blog.title = title;
    if (description) blog.description = description;
    if (blogImageDescription) blog.blogImageDescription = blogImageDescription;
    if (isActive !== undefined) blog.isActive = isActive === 'true' || isActive === true;
    
    // Update CKEditor content
    if (editorContent !== undefined) blog.editorContent = editorContent;
    
    // Update city information
    if (cityId) {
      blog.city = {
        cityId: cityId,
        cityName: cityName || ''
      };
    } else {
      // If cityId is not provided, clear city information
      blog.city = null;
    }
    
    // Update background image if provided
    if (req.files && req.files.backgroundImage) {
      const backgroundFile = req.files.backgroundImage[0];
      const backgroundBase64 = backgroundFile.buffer.toString('base64');
      blog.backgroundImage = {
        data: `data:${backgroundFile.mimetype};base64,${backgroundBase64}`,
        contentType: backgroundFile.mimetype
      };
    }
    
    // Update blog image if provided
    if (req.files && req.files.blogImage) {
      const blogImageFile = req.files.blogImage[0];
      const blogImageBase64 = blogImageFile.buffer.toString('base64');
      blog.blogImage = {
        data: `data:${blogImageFile.mimetype};base64,${blogImageBase64}`,
        contentType: blogImageFile.mimetype
      };
    }
    
    // Get full details for things to do - ensure we're using strings
    if (thingsToDo.length > 0) {
      blog.mustVisitThings = thingsToDo.map(id => id.toString()); // Store as strings
      blog.mustVisitThingsData = await getThingsToDo(thingsToDo); // Store full data
    } else {
      blog.mustVisitThings = [];
      blog.mustVisitThingsData = [];
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