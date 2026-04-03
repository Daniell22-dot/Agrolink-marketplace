/**
 * ML Recommendation Service — Jiji/Jumia-style
 * 
 * Implements:
 * 1. Collaborative Filtering — "Users who bought X also bought Y"
 * 2. Content-Based Filtering — Similar products by category, price, location
 * 3. Trending Products — Weighted interaction scores over time
 * 4. Recently Viewed — User's browsing history
 * 5. Personalized Feed — Blended scoring from all signals
 */

const { Op, Sequelize } = require('sequelize');
const sequelize = require('../config/database');
const Product = require('../models/Product');
const UserInteraction = require('../models/UserInteraction');
const pythonApiClient = require('./pythonApiClient');

// Interaction weights for scoring
const WEIGHTS = {
    view: 1,
    cart_add: 3,
    wishlist: 2,
    purchase: 5,
    search: 1.5
};

class RecommendationService {

    /**
     * Track a user interaction (view, purchase, cart_add, etc.)
     */
    async trackInteraction(userId, productId, interactionType, metadata = null) {
        try {
            // Rate-limit views: max 1 view per product per hour
            if (interactionType === 'view') {
                const oneHourAgo = new Date(Date.now() - 3600000);
                const recent = await UserInteraction.findOne({
                    where: {
                        userId,
                        productId,
                        interactionType: 'view',
                        createdAt: { [Op.gte]: oneHourAgo }
                    }
                });
                if (recent) return recent;
            }

            return await UserInteraction.create({
                userId,
                productId,
                interactionType,
                metadata
            });
        } catch (error) {
            console.error('Track interaction error:', error.message);
            return null;
        }
    }

    /**
     * Collaborative Filtering: "Users who bought X also bought Y"
     * Finds products purchased by users who also purchased the given product
     */
    async getCollaborativeRecommendations(productId, limit = 10) {
        try {
            // Step 1: Find users who interacted with this product
            const usersWhoInteracted = await UserInteraction.findAll({
                where: {
                    productId,
                    interactionType: { [Op.in]: ['purchase', 'cart_add'] }
                },
                attributes: ['userId'],
                group: ['userId']
            });

            const userIds = usersWhoInteracted.map(u => u.userId);
            if (userIds.length === 0) return [];

            // Step 2: Find other products these same users interacted with
            const coProducts = await UserInteraction.findAll({
                where: {
                    userId: { [Op.in]: userIds },
                    productId: { [Op.ne]: productId },
                    interactionType: { [Op.in]: ['purchase', 'cart_add'] }
                },
                attributes: [
                    'productId',
                    [Sequelize.fn('COUNT', Sequelize.col('productId')), 'score']
                ],
                group: ['productId'],
                order: [[Sequelize.literal('score'), 'DESC']],
                limit
            });

            const productIds = coProducts.map(p => p.productId);
            if (productIds.length === 0) return [];

            return await Product.findAll({
                where: { id: { [Op.in]: productIds }, isAvailable: true }
            });
        } catch (error) {
            console.error('Collaborative filtering error:', error.message);
            return [];
        }
    }

    /**
     * Content-Based Filtering: Similar products by category, price range, location
     */
    async getSimilarProducts(productId, limit = 10) {
        try {
            const product = await Product.findByPk(productId);
            if (!product) return [];

            const priceRange = parseFloat(product.price) * 0.3;
            const minPrice = parseFloat(product.price) - priceRange;
            const maxPrice = parseFloat(product.price) + priceRange;

            const whereClause = {
                id: { [Op.ne]: productId },
                isAvailable: true,
                [Op.or]: []
            };

            // Category match (highest priority)
            if (product.categoryId) {
                whereClause[Op.or].push({ categoryId: product.categoryId });
            }

            // Price range match
            whereClause[Op.or].push({
                price: { [Op.between]: [minPrice, maxPrice] }
            });

            // Location match
            if (product.location) {
                whereClause[Op.or].push({
                    location: { [Op.like]: `%${product.location.split(',')[0]}%` }
                });
            }

            if (whereClause[Op.or].length === 0) {
                delete whereClause[Op.or];
            }

            const similar = await Product.findAll({
                where: whereClause,
                limit,
                order: [['views', 'DESC'], ['createdAt', 'DESC']]
            });

            return similar;
        } catch (error) {
            console.error('Content-based filtering error:', error.message);
            return [];
        }
    }

    /**
     * Combined Similar Products: Merges collaborative + content-based
     */
    async getCombinedSimilar(productId, limit = 10) {
        const [collaborative, contentBased] = await Promise.all([
            this.getCollaborativeRecommendations(productId, Math.ceil(limit / 2)),
            this.getSimilarProducts(productId, limit)
        ]);

        // Merge and deduplicate, prefer collaborative results
        const seen = new Set();
        const merged = [];

        for (const p of collaborative) {
            if (!seen.has(p.id)) {
                seen.add(p.id);
                merged.push(p);
            }
        }
        for (const p of contentBased) {
            if (!seen.has(p.id) && merged.length < limit) {
                seen.add(p.id);
                merged.push(p);
            }
        }

        return merged;
    }

    /**
     * Trending Products: Weighted score from recent interactions
     * Now uses Python ML service for better recommendations
     * Falls back to local implementation if Python service unavailable
     */
    async getTrendingProducts(limit = 10, days = 7) {
        try {
            // Try Python API first
            const pythonTrending = await pythonApiClient.getTrendingProducts(limit);
            if (pythonTrending && pythonTrending.length > 0) {
                console.log(`Fetched ${pythonTrending.length} trending products from Python service`);
                return pythonTrending;
            }
        } catch (error) {
            console.log('Python trending service unavailable, falling back to local implementation');
        }

        // Fallback: Local implementation
        try {
            const sinceDate = new Date(Date.now() - days * 86400000);

            const trending = await UserInteraction.findAll({
                where: { createdAt: { [Op.gte]: sinceDate } },
                attributes: [
                    'productId',
                    [Sequelize.literal(
                        `SUM(CASE 
                            WHEN interactionType = 'view' THEN ${WEIGHTS.view}
                            WHEN interactionType = 'cart_add' THEN ${WEIGHTS.cart_add}
                            WHEN interactionType = 'purchase' THEN ${WEIGHTS.purchase}
                            WHEN interactionType = 'wishlist' THEN ${WEIGHTS.wishlist}
                            WHEN interactionType = 'search' THEN ${WEIGHTS.search}
                            ELSE 0 END)`
                    ), 'trend_score']
                ],
                group: ['productId'],
                order: [[Sequelize.literal('trend_score'), 'DESC']],
                limit
            });

            const productIds = trending.map(t => t.productId);
            if (productIds.length === 0) {
                // Fallback: return most viewed products
                return await Product.findAll({
                    where: { isAvailable: true },
                    order: [['views', 'DESC']],
                    limit
                });
            }

            const products = await Product.findAll({
                where: { id: { [Op.in]: productIds }, isAvailable: true }
            });

            // Sort by trend_score order
            const scoreMap = {};
            trending.forEach(t => { scoreMap[t.productId] = parseFloat(t.dataValues.trend_score); });
            products.sort((a, b) => (scoreMap[b.id] || 0) - (scoreMap[a.id] || 0));

            return products;
        } catch (error) {
            console.error('Trending products error (both Python and local):', error.message);
            // Final fallback
            return await Product.findAll({
                where: { isAvailable: true },
                order: [['views', 'DESC']],
                limit
            });
        }
    }

    /**
     * Recently Viewed Products: User's browsing history
     */
    async getRecentlyViewed(userId, limit = 10) {
        try {
            const views = await UserInteraction.findAll({
                where: { userId, interactionType: 'view' },
                attributes: ['productId'],
                order: [['createdAt', 'DESC']],
                group: ['productId'],
                limit
            });

            const productIds = views.map(v => v.productId);
            if (productIds.length === 0) return [];

            const products = await Product.findAll({
                where: { id: { [Op.in]: productIds }, isAvailable: true }
            });

            // Maintain view order
            const productMap = {};
            products.forEach(p => { productMap[p.id] = p; });
            return productIds.map(id => productMap[id]).filter(Boolean);
        } catch (error) {
            console.error('Recently viewed error:', error.message);
            return [];
        }
    }

    /**
     * Personalized "For You" Feed: Blended recommendations
     * Now uses Python ML service for smarter personalization
     * Falls back to local implementation if Python service unavailable
     */
    async getPersonalizedFeed(userId, limit = 20) {
        try {
            // Try Python API first - it has better ML-based recommendations
            const pythonRecommendations = await pythonApiClient.getRecommendationsForUser(userId, limit);
            if (pythonRecommendations && pythonRecommendations.length > 0) {
                console.log(`Fetched ${pythonRecommendations.length} personalized recommendations from Python service`);
                return pythonRecommendations;
            }
        } catch (error) {
            console.log('Python recommendation service unavailable, falling back to local implementation');
        }

        // Fallback: Local blended implementation
        try {
            // Get user's category preferences from interaction history
            const userHistory = await UserInteraction.findAll({
                where: { userId },
                attributes: ['productId', 'interactionType'],
                order: [['createdAt', 'DESC']],
                limit: 50
            });

            if (userHistory.length === 0) {
                // Cold start: return trending + new products
                return await this.getTrendingProducts(limit);
            }

            const interactedProductIds = [...new Set(userHistory.map(h => h.productId))];

            // Get categories and properties of interacted products
            const interactedProducts = await Product.findAll({
                where: { id: { [Op.in]: interactedProductIds } },
                attributes: ['id', 'categoryId', 'price', 'location']
            });

            // Build preference profile
            const categoryFrequency = {};
            const priceSum = { total: 0, count: 0 };
            const locations = {};

            interactedProducts.forEach(p => {
                if (p.categoryId) {
                    categoryFrequency[p.categoryId] = (categoryFrequency[p.categoryId] || 0) + 1;
                }
                priceSum.total += parseFloat(p.price || 0);
                priceSum.count++;
                if (p.location) {
                    const loc = p.location.split(',')[0].trim();
                    locations[loc] = (locations[loc] || 0) + 1;
                }
            });

            // Sort categories by frequency
            const preferredCategories = Object.entries(categoryFrequency)
                .sort((a, b) => b[1] - a[1])
                .slice(0, 3)
                .map(([catId]) => parseInt(catId));

            const avgPrice = priceSum.count > 0 ? priceSum.total / priceSum.count : 0;
            const priceRange = avgPrice * 0.5;

            // Find products matching user preferences
            const whereClause = {
                id: { [Op.notIn]: interactedProductIds },
                isAvailable: true,
                [Op.or]: []
            };

            if (preferredCategories.length > 0) {
                whereClause[Op.or].push({ categoryId: { [Op.in]: preferredCategories } });
            }
            if (avgPrice > 0) {
                whereClause[Op.or].push({
                    price: { [Op.between]: [avgPrice - priceRange, avgPrice + priceRange] }
                });
            }

            if (whereClause[Op.or].length === 0) {
                delete whereClause[Op.or];
            }

            const personalizedProducts = await Product.findAll({
                where: whereClause,
                order: [['views', 'DESC'], ['createdAt', 'DESC']],
                limit: Math.ceil(limit * 0.6)
            });

            // Add trending to fill remaining slots (diversity injection)
            const trending = await this.getTrendingProducts(
                limit - personalizedProducts.length,
                14
            );

            // Merge and deduplicate
            const seen = new Set(personalizedProducts.map(p => p.id));
            const result = [...personalizedProducts];

            for (const p of trending) {
                if (!seen.has(p.id) && result.length < limit) {
                    seen.add(p.id);
                    result.push(p);
                }
            }

            return result;
        } catch (error) {
            console.error('Personalized feed error (both Python and local):', error.message);
            // Final fallback: trending products
            return await this.getTrendingProducts(limit, 30);
        }
    }
}

module.exports = new RecommendationService();
