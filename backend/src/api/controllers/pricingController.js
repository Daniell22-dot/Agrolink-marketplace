const pythonApiClient = require('../../services/pythonApiClient');

/**
 * @desc    Predict product price based on market conditions
 * @route   POST /api/pricing/predict
 * @access  Private (Farmer)
 */
exports.predictPrice = async (req, res, next) => {
    try {
        const { category, supply, demand, season, daysHarvest, qualityGrade } = req.body;

        if (!category || supply === undefined || demand === undefined) {
            return res.status(400).json({
                success: false,
                message: 'category, supply, and demand are required'
            });
        }

        const predictedPrice = await pythonApiClient.predictPrice(
            category,
            supply,
            demand,
            season || null,
            daysHarvest || 30,
            qualityGrade || 'standard'
        );

        if (!predictedPrice) {
            return res.status(500).json({
                success: false,
                message: 'Failed to predict price'
            });
        }

        res.json({
            success: true,
            data: {
                predictedPrice,
                category,
                supply,
                demand,
                qualityGrade
            }
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Get price trends for a category
 * @route   GET /api/pricing/trends/:category
 * @access  Public
 */
exports.getPriceTrends = async (req, res, next) => {
    try {
        const { category } = req.params;
        const days = parseInt(req.query.days) || 90;

        const trends = await pythonApiClient.getPriceTrends(category, days);

        res.json({
            success: true,
            category,
            timeframeDays: days,
            count: trends.length,
            data: trends
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Get optimal price recommendation for a product
 * @route   GET /api/pricing/optimal/:productId
 * @access  Private (Farmer or Admin)
 */
exports.getOptimalPrice = async (req, res, next) => {
    try {
        const { productId } = req.params;

        const optimal = await pythonApiClient.getOptimalPrice(productId);

        if (!optimal) {
            return res.status(404).json({
                success: false,
                message: 'Could not calculate optimal price for this product'
            });
        }

        res.json({
            success: true,
            productId,
            data: optimal
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Retrain price prediction model with new data
 * @route   POST /api/pricing/train-model
 * @access  Private (Admin only)
 */
exports.trainPriceModel = async (req, res, next) => {
    try {
        // Admin only
        if (req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Only admins can retrain the price model'
            });
        }

        const success = await pythonApiClient.trainPriceModel();

        res.json({
            success,
            message: success ? 'Price model retraining started' : 'Failed to retrain price model'
        });
    } catch (error) {
        next(error);
    }
};
