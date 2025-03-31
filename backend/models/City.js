// backend/models/City.js
const mongoose = require('mongoose');

const ThingToDoSchema = new mongoose.Schema({
  image: {
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
  }
});

const CitySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  thingsToDo: [ThingToDoSchema],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('City', CitySchema);