const pythonApiClient = require('../../services/pythonApiClient');

/**
 * @desc    Optimize product image (create multiple sizes)
 * @route   POST /api/images/optimize
 * @access  Private (Farmer or Admin)
 */
exports.optimizeImage = async (req, res, next) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'No file uploaded'
            });
        }

        // Call Python service to optimize image
        const optimizedData = await pythonApiClient.optimizeImage(
            req.file.buffer,
            req.file.originalname
        );

        if (!optimizedData) {
            return res.status(500).json({
                success: false,
                message: 'Failed to optimize image'
            });
        }

        res.json({
            success: true,
            data: optimizedData
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Validate product image
 * @route   POST /api/images/validate
 * @access  Private (Farmer or Admin)
 */
exports.validateImage = async (req, res, next) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'No file uploaded'
            });
        }

        // Call Python service to validate image
        const validationResult = await pythonApiClient.validateImage(
            req.file.buffer,
            req.file.originalname
        );

        if (!validationResult) {
            return res.status(400).json({
                success: false,
                message: 'Image validation failed'
            });
        }

        res.json({
            success: true,
            data: validationResult
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Extract image features (colors, brightness, etc.)
 * @route   POST /api/images/features
 * @access  Private (Farmer or Admin)
 */
exports.extractImageFeatures = async (req, res, next) => {
    try {
        const { imageUrl } = req.body;

        if (!imageUrl) {
            return res.status(400).json({
                success: false,
                message: 'imageUrl is required'
            });
        }

        const features = await pythonApiClient.extractImageFeatures(imageUrl);

        if (!features) {
            return res.status(500).json({
                success: false,
                message: 'Failed to extract image features'
            });
        }

        res.json({
            success: true,
            data: features
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Batch optimize multiple images
 * @route   POST /api/images/batch-optimize
 * @access  Private (Admin)
 */
exports.batchOptimizeImages = async (req, res, next) => {
    try {
        const { imageUrls } = req.body;

        if (!imageUrls || !Array.isArray(imageUrls) || imageUrls.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'imageUrls array is required'
            });
        }

        const results = await pythonApiClient.batchOptimizeImages(imageUrls);

        res.json({
            success: true,
            count: results.length,
            data: results
        });
    } catch (error) {
        next(error);
    }
};
