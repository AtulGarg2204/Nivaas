// backend/server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const bannerRoutes = require('./routes/banner');
const app = express();
const reviewRoutes = require('./routes/review');
const blogRoutes = require('./routes/blog');

const propertyRoutes = require('./routes/property');
const cityRoutes = require('./routes/city');
// Middleware
app.use(cors());

app.use(express.json({ limit: '50mb' }));

// Increase URL-encoded payload size limit to 50MB
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected successfully'))
  .catch(err => console.log('MongoDB connection error: ', err));

// Routes (to be added later)
app.get('/', (req, res) => {
  res.send('SkyVista API is running');
});

app.use('/api/properties', propertyRoutes);

app.use('/api/banners', bannerRoutes);
app.use('/api/cities', cityRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/reviews', reviewRoutes);
// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});