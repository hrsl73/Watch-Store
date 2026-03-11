import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import User from '../models/User.js';

const router = express.Router();

// @route   GET /api/users/favorites
// @desc    Get logged in user's favorites
// @access  Private
router.get('/favorites', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (user) {
      res.json(user.favorites);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/users/favorites/:id
// @desc    Toggle watch in favorites
// @access  Private
router.post('/favorites/:id', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const watchId = req.params.id;

    if (user) {
      // Compare string representations of ObjectIds
      const isFavorited = user.favorites.some((id) => id.toString() === watchId);

      if (isFavorited) {
        // Remove from favorites
        user.favorites = user.favorites.filter((id) => id.toString() !== watchId);
      } else {
        // Add to favorites
        user.favorites.push(watchId);
      }

      await user.save();
      res.json(user.favorites);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
