const Category = require('../../models/Category');

// @desc    Get all categories
// @route   GET /api/categories
// @access  Public
exports.getCategories = async (req, res, next) => {
    try {
        const categories = await Category.findAll({
            where: { isActive: true },
            attributes: ['id', 'name', 'slug', 'description', 'icon']
        });

        res.json({
            success: true,
            count: categories.length,
            data: categories
        });
    } catch (error) {
        console.error('Error fetching categories:', error);
        next(error);
    }
};
