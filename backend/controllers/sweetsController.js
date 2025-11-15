const Sweet = require('../models/Sweet');

// @desc    Get all sweets
// @route   GET /api/sweets
// @access  Public
exports.getAllSweets = async (req, res) => {
  try {
    const sweets = await Sweet.find().sort({ createdAt: -1 });
    res.json(sweets);
  } catch (error) {
    console.error('Get sweets error:', error);
    res.status(500).json({ error: error.message });
  }
};

// @desc    Get single sweet
// @route   GET /api/sweets/:id
// @access  Public
exports.getSweet = async (req, res) => {
  try {
    const sweet = await Sweet.findById(req.params.id);
    
    if (!sweet) {
      return res.status(404).json({ error: 'Sweet not found' });
    }
    
    res.json(sweet);
  } catch (error) {
    console.error('Get sweet error:', error);
    res.status(500).json({ error: error.message });
  }
};

// @desc    Create sweet
// @route   POST /api/sweets
// @access  Private
exports.createSweet = async (req, res) => {
  try {
    const { name, description, price, quantity, category, image } = req.body;

    const sweet = await Sweet.create({
      name,
      description,
      price,
      quantity,
      category,
      image: image || '🍬',
      createdBy: req.user._id
    });

    res.status(201).json(sweet);
  } catch (error) {
    console.error('Create sweet error:', error);
    res.status(500).json({ error: error.message });
  }
};

// @desc    Update sweet
// @route   PUT /api/sweets/:id
// @access  Private
exports.updateSweet = async (req, res) => {
  try {
    const sweet = await Sweet.findById(req.params.id);

    if (!sweet) {
      return res.status(404).json({ error: 'Sweet not found' });
    }

    const updatedSweet = await Sweet.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.json(updatedSweet);
  } catch (error) {
    console.error('Update sweet error:', error);
    res.status(500).json({ error: error.message });
  }
};

// @desc    Delete sweet
// @route   DELETE /api/sweets/:id
// @access  Private
exports.deleteSweet = async (req, res) => {
  try {
    const sweet = await Sweet.findById(req.params.id);

    if (!sweet) {
      return res.status(404).json({ error: 'Sweet not found' });
    }

    await Sweet.findByIdAndDelete(req.params.id);
    res.json({ message: 'Sweet removed' });
  } catch (error) {
    console.error('Delete sweet error:', error);
    res.status(500).json({ error: error.message });
  }
};
