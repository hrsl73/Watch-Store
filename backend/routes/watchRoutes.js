import express from 'express';
import multer from 'multer';
import path from 'path';
import Watch from '../models/Watch.js';
import { protect, admin } from '../middleware/authMiddleware.js';
import { io } from '../server.js';

const router = express.Router();

// Setup Multer for image upload
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, 'uploads/');
  },
  filename(req, file, cb) {
    cb(
      null,
      `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

const upload = multer({
  storage,
  fileFilter: function (req, file, cb) {
    const filetypes = /jpg|jpeg|png/;
    const extname = filetypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimetype = filetypes.test(file.mimetype);

    if (extname && mimetype) {
      return cb(null, true);
    } else {
      cb('Images only!');
    }
  },
});

// @route   GET /api/watches
router.get('/', async (req, res) => {
  try {
    const watches = await Watch.find({});
    res.json(watches);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/watches
// @access  Private/Admin
router.post('/', protect, admin, upload.single('image'), async (req, res) => {
  try {
    const { name, brand, price, quantity, imgSource } = req.body;
    
    // Allow either uploading via multer or passing an image source directly
    let img = imgSource;
    if (req.file) {
      img = `/${req.file.path}`;
    }

    const watch = new Watch({
      name,
      brand,
      price: Number(price),
      quantity: Number(quantity) || 1,
      img: img || 'placeholder.jpg',
    });

    const createdWatch = await watch.save();
    
    // Emit socket event to notify clients
    io.emit('inventory_updated', { action: 'create', watch: createdWatch });

    res.status(201).json(createdWatch);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   PUT /api/watches/:id
// @access  Private/Admin
router.put('/:id', protect, admin, upload.single('image'), async (req, res) => {
  try {
    const { name, brand, price, quantity, imgSource } = req.body;

    const watch = await Watch.findById(req.params.id);

    if (watch) {
      watch.name = name || watch.name;
      watch.brand = brand || watch.brand;
      watch.price = price ? Number(price) : watch.price;
      
      // Explicitly check for quantity strings or numbers, even if it's "0"
      if (quantity !== undefined && quantity !== null && quantity !== '') {
        watch.quantity = parseInt(quantity, 10);
      }
      
      if (req.file) {
        watch.img = `/${req.file.path}`;
      } else if (imgSource) {
        watch.img = imgSource;
      }

      const updatedWatch = await watch.save();
      
      // Emit socket event
      io.emit('inventory_updated', { action: 'update', watch: updatedWatch });
      
      res.json(updatedWatch);
    } else {
      res.status(404).json({ message: 'Watch not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   DELETE /api/watches/:id
// @access  Private/Admin
router.delete('/:id', protect, admin, async (req, res) => {
  try {
    const watch = await Watch.findById(req.params.id);

    if (watch) {
      await watch.deleteOne();
      
      // Emit socket event
      io.emit('inventory_updated', { action: 'delete', id: req.params.id });
      
      res.json({ message: 'Watch removed' });
    } else {
      res.status(404).json({ message: 'Watch not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
