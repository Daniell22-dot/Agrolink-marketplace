const Product = require('../../models/Product');
const cloudinary = require('../../config/cloudinary');
const { validationResult } = require('express-validator');
const { Op } = require('sequelize');
const searchService = require('../../services/searchService');
const recommendationService = require('../../services/recommendationService');

// Helper to upload buffer to Cloudinary
const uploadToCloudinary = (buffer) => {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            { resource_type: 'image', folder: 'agrilink/products' },
            (error, result) => {
                if (error) return reject(error);
                resolve(result);
            }
        );
        uploadStream.end(buffer);
    });
};

// @desc    Get all products
// @route   GET /api/products
// @access  Public
exports.getProducts = async (req, res, next) => {
    try {
        // Try Elasticsearch first
        const searchResults = await searchService.searchProducts(req.query);

        if (searchResults) {
            return res.json(searchResults);
        }

        // Fallback to Database
        let { page, limit, search, category, minPrice, maxPrice, sort } = req.query;

        page = parseInt(page) || 1;
        limit = parseInt(limit) || 10;
        const offset = (page - 1) * limit;

        const whereClause = {
            is_available: true
        };

        if (search) {
            whereClause.name = { [Op.like]: `%${search}%` };
        }

        if (category) {
            whereClause.category_id = category;
        }

        if (minPrice || maxPrice) {
            whereClause.price = {};
            if (minPrice) whereClause.price[Op.gte] = minPrice;
            if (maxPrice) whereClause.price[Op.lte] = maxPrice;
        }

        let order = [['created_at', 'DESC']];
        if (sort === 'price_asc') order = [['price', 'ASC']];
        if (sort === 'price_desc') order = [['price', 'DESC']];

        const { count, rows } = await Product.findAndCountAll({
            where: whereClause,
            limit,
            offset,
            order
        });

        res.json({
            success: true,
            count,
            totalPages: Math.ceil(count / limit),
            currentPage: page,
            data: rows
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
exports.getProduct = async (req, res, next) => {
    try {
        const product = await Product.findByPk(req.params.id);

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Increment view counter
        await product.increment('views');

        // Track view for ML recommendations (if user is authenticated)
        if (req.user) {
            recommendationService.trackInteraction(
                req.user.id,
                product.id,
                'view'
            ).catch(() => { }); // Fire and forget, don't block response
        }

        res.json({
            success: true,
            data: product
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Create new product
// @route   POST /api/products
// @access  Private/Seller
exports.createProduct = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { name, description, category, price, quantity, unit, location } = req.body;

        // Handle Image Upload
        let imageUrls = [];
        if (req.files && req.files.length > 0) {
            const uploadPromises = req.files.map(file => uploadToCloudinary(file.buffer));
            const results = await Promise.all(uploadPromises);
            imageUrls = results.map(result => result.secure_url);
        }

        const product = await Product.create({
            farmerId: req.user.id,
            name,
            description,
            category,
            price,
            quantity,
            unit,
            location,
            images: imageUrls,
            status: 'available',
            isApproved: false // Requires admin approval?
        });

        // Index to Elasticsearch
        await searchService.indexProduct(product);

        res.status(201).json({
            success: true,
            data: product
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private/Seller
exports.updateProduct = async (req, res, next) => {
    try {
        let product = await Product.findByPk(req.params.id);

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Ownership check
        if (product.farmerId !== req.user.id && req.user.role !== 'admin') {
            return res.status(401).json({ message: 'Not authorized to update this product' });
        }

        const { name, description, category, price, quantity, unit, location, status } = req.body;

        // Handle New Images (Append or Replace? Let's append for now or handled by frontend sending old + new)
        // Simple approach: if new files, add them.
        let newImageUrls = [];
        if (req.files && req.files.length > 0) {
            const uploadPromises = req.files.map(file => uploadToCloudinary(file.buffer));
            const results = await Promise.all(uploadPromises);
            newImageUrls = results.map(result => result.secure_url);
        }

        // Merge images if needed, or just replace.
        // If frontend sends 'images' array of strings (old images), we keep them.
        // Getting complex, let's just add new ones to existing list for now.
        let updatedImages = product.images || [];
        if (newImageUrls.length > 0) {
            updatedImages = [...updatedImages, ...newImageUrls];
        }

        await product.update({
            name: name || product.name,
            description: description || product.description,
            category: category || product.category,
            price: price || product.price,
            quantity: quantity || product.quantity,
            unit: unit || product.unit,
            location: location || product.location,
            status: status || product.status,
            images: updatedImages
        });

        // Update in Elasticsearch
        await searchService.indexProduct(product);

        res.json({
            success: true,
            data: product
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private/Seller
exports.deleteProduct = async (req, res, next) => {
    try {
        const product = await Product.findByPk(req.params.id);

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Ownership check
        if (product.farmerId !== req.user.id && req.user.role !== 'admin') {
            return res.status(401).json({ message: 'Not authorized to delete this product' });
        }

        await product.destroy();

        // Remove from Elasticsearch
        await searchService.removeProduct(req.params.id);

        res.json({
            success: true,
            data: {}
        });
    } catch (error) {
        next(error);
    }
};
