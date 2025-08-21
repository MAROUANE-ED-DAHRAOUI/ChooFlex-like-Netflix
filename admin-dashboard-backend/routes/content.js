const express = require('express');
const router = express.Router();
const contentController = require('../controllers/contentController');
const multer = require('multer');
const path = require('path');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    // Generate unique filename
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: function (req, file, cb) {
    // Check file type
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
});

// GET /api/content
router.get('/', contentController.list);

// POST /api/content
router.post('/', contentController.create);

// PUT /api/content/:id
router.put('/:id', contentController.update);

// DELETE /api/content/:id
router.delete('/:id', contentController.remove);

// POST /api/content/:id/feature
router.post('/:id/feature', contentController.setFeatured);

// POST /api/content/:id/thumbnail
router.post('/:id/thumbnail', upload.single('thumbnail'), contentController.uploadThumbnail);

module.exports = router;
