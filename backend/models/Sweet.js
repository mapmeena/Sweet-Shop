const mongoose = require('mongoose');

const sweetSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a sweet name'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Please provide a description'],
    trim: true
  },
  price: {
    type: Number,
    required: [true, 'Please provide a price'],
    min: 0
  },
  quantity: {
    type: Number,
    required: [true, 'Please provide quantity'],
    min: 0,
    default: 0
  },
  category: {
    type: String,
    required: [true, 'Please provide a category'],
    trim: true
  },
  image: {
    type: String,
    default: '🍬'
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt timestamp before saving
sweetSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Sweet', sweetSchema);
