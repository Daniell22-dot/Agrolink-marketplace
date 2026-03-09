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
                        user_id: userId,
                        product_id: productId,
                        interaction_type: 'view',
                        created_at: { [Op.gte]: oneHourAgo }
                    }
                });
                if (recent) return recent;
            }

            return await UserInteraction.create({
                user_id: userId,
                product_id: productId,
                interaction_type: interactionType,
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
                    product_id: productId,
                    interaction_type: { [Op.in]: ['purchase', 'cart_add'] }
                },
                attributes: ['user_id'],
                group: ['user_id']
            });

            const userIds = usersWhoInteracted.map(u => u.user_id);
            if (userIds.length === 0) return [];

            // Step 2: Find other products these same users interacted with
            const coProducts = await UserInteraction.findAll({
                where: {
                    user_id: { [Op.in]: userIds },
                    product_id: { [Op.ne]: productId },
                    interaction_type: { [Op.in]: ['purchase', 'cart_add'] }
                },
                attributes: [
                    'product_id',
                    [Sequelize.fn('COUNT', Sequelize.col('product_id')), 'score']
                ],
                group: ['product_id'],
                order: [[Sequelize.literal('score'), 'DESC']],
                limit
            });

            const productIds = coProducts.map(p => p.product_id);
            if (productIds.length === 0) return [];

            return await Product.findAll({
                where: { id: { [Op.in]: productIds }, is_available: true }
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
                is_available: true,
                [Op.or]: []
            };

            // Category match (highest priority)
            if (product.category_id) {
                whereClause[Op.or].push({ category_id: product.category_id });
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
                order: [['views', 'DESC'], ['created_at', 'DESC']]
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
     * Score = (views × 1) + (cart_adds × 3) + (purchases × 5)
     */
    async getTrendingProducts(limit = 10, days = 7) {
        try {
            const sinceDate = new Date(Date.now() - days * 86400000);

            const trending = await UserInteraction.findAll({
                where: { created_at: { [Op.gte]: sinceDate } },
                attributes: [
                    'product_id',
                    [Sequelize.literal(
                        `SUM(CASE 
                            WHEN interaction_type = 'view' THEN ${WEIGHTS.view}
                            WHEN interaction_type = 'cart_add' THEN ${WEIGHTS.cart_add}
                            WHEN interaction_type = 'purchase' THEN ${WEIGHTS.purchase}
                            WHEN interaction_type = 'wishlist' THEN ${WEIGHTS.wishlist}
                            WHEN interaction_type = 'search' THEN ${WEIGHTS.search}
                            ELSE 0 END)`
                    ), 'trend_score']
                ],
                group: ['product_id'],
                order: [[Sequelize.literal('trend_score'), 'DESC']],
                limit
            });

            const productIds = trending.map(t => t.product_id);
            if (productIds.length === 0) {
                // Fallback: return most viewed products
                return await Product.findAll({
                    where: { is_available: true },
                    order: [['views', 'DESC']],
                    limit
                });
            }

            const products = await Product.findAll({
                where: { id: { [Op.in]: productIds }, is_available: true }
            });

            // Sort by trend_score order
            const scoreMap = {};
            trending.forEach(t => { scoreMap[t.product_id] = parseFloat(t.dataValues.trend_score); });
            products.sort((a, b) => (scoreMap[b.id] || 0) - (scoreMap[a.id] || 0));

            return products;
        } catch (error) {
            console.error('Trending products error:', error.message);
            // Fallback
            return await Product.findAll({
                where: { is_available: true },
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
                where: { user_id: userId, interaction_type: 'view' },
                attributes: ['product_id'],
                order: [['created_at', 'DESC']],
                group: ['product_id'],
                limit
            });

            const productIds = views.map(v => v.product_id);
            if (productIds.length === 0) return [];

            const products = await Product.findAll({
                where: { id: { [Op.in]: productIds }, is_available: true }
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
     * Combines user history preferences with trending and collaborative signals
     */
    async getPersonalizedFeed(userId, limit = 20) {
        try {
            // Get user's category preferences from interaction history
            const userHistory = await UserInteraction.findAll({
                where: { user_id: userId },
                attributes: ['product_id', 'interaction_type'],
                order: [['created_at', 'DESC']],
                limit: 50
            });

            if (userHistory.length === 0) {
                // Cold start: return trending + new products
                return await this.getTrendingProducts(limit);
            }

            const interactedProductIds = [...new Set(userHistory.map(h => h.product_id))];

            // Get categories and properties of interacted products
            const interactedProducts = await Product.findAll({
                where: { id: { [Op.in]: interactedProductIds } },
                attributes: ['id', 'category_id', 'price', 'location']
            });

            // Build preference profile
            const categoryFrequency = {};
            const priceSum = { total: 0, count: 0 };
            const locations = {};

            interactedProducts.forEach(p => {
                if (p.category_id) {
                    categoryFrequency[p.category_id] = (categoryFrequency[p.category_id] || 0) + 1;
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
                is_available: true,
                [Op.or]: []
            };

            if (preferredCategories.length > 0) {
                whereClause[Op.or].push({ category_id: { [Op.in]: preferredCategories } });
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
                order: [['views', 'DESC'], ['created_at', 'DESC']],
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
            console.error('Personalized feed error:', error.message);
            return await this.getTrendingProducts(limit);
        }
    }
}

module.exports = new RecommendationService();
