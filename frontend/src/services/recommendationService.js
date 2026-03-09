import api from './api';

export const recommendationService = {
    // Get personalized "For You" recommendations
    getForYou: async (limit = 20) => {
        const response = await api.get(`/recommendations/for-you?limit=${limit}`);
        return response.data;
    },

    // Get similar products
    getSimilar: async (productId, limit = 10) => {
        const response = await api.get(`/recommendations/similar/${productId}?limit=${limit}`);
        return response.data;
    },

    // Get trending products
    getTrending: async (limit = 10) => {
        const response = await api.get(`/recommendations/trending?limit=${limit}`);
        return response.data;
    },

    // Get recently viewed products
    getRecentlyViewed: async (limit = 10) => {
        const response = await api.get(`/recommendations/recently-viewed?limit=${limit}`);
        return response.data;
    },

    // Track a user interaction
    trackInteraction: async (productId, interactionType, metadata = null) => {
        const response = await api.post('/recommendations/track', {
            productId,
            interactionType,
            metadata
        });
        return response.data;
    }
};

export default recommendationService;
