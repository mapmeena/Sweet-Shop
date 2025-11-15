const express = require('express');
const router = express.Router();
const {
  getAllSweets,
  getSweet,
  createSweet,
  updateSweet,
  deleteSweet
} = require('../controllers/sweetsController');
const { protect } = require('../middleware/auth');

// Public routes
router.get('/', getAllSweets);
router.get('/:id', getSweet);

// Private routes (require authentication)
router.post('/', protect, createSweet);
router.put('/:id', protect, updateSweet);
router.delete('/:id', protect, deleteSweet);

module.exports = router;
