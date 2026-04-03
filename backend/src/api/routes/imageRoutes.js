const express = require('express');
const multer = require('multer');
const { protect, authorize } = require('../middleware/authMiddleware');
const {
    optimizeImage,
    validateImage,
    extractImageFeatures,
    batchOptimizeImages
} = require('../controllers/imageController');

const router = express.Router();

// Multer configuration for image uploads
const storage = multer.memoryStorage();
const upload = multer({
    storage,
    limits: {
        fileSize: 10 * 1024 * 1024 // 10MB limit
    },
    fileFilter: (req, file, cb) => {
        // Accept image files only
        const allowedMimes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
        if (allowedMimes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed'));
        }
    }
});

/**
 * @route   POST /api/images/optimize
 * @desc    Optimize product image (create multiple sizes)
 * @access  Private (Farmer or Admin)
 */
router.post(
    '/optimize',
    protect,
    authorize('farmer', 'admin'),
    upload.single('file'),
    optimizeImage
);

/**
 * @route   POST /api/images/validate
 * @desc    Validate product image
 * @access  Private (Farmer or Admin)
 */
router.post(
    '/validate',
    protect,
    authorize('farmer', 'admin'),
    upload.single('file'),
    validateImage
);

/**
 * @route   POST /api/images/features
 * @desc    Extract image features
 * @access  Private (Farmer or Admin)
 */
router.post(
    '/features',
    protect,
    authorize('farmer', 'admin'),
    extractImageFeatures
);

/**
 * @route   POST /api/images/batch-optimize
 * @desc    Batch optimize multiple images
 * @access  Private (Admin)
 */
router.post(
    '/batch-optimize',
    protect,
    authorize('admin'),
    batchOptimizeImages
);

module.exports = router;
