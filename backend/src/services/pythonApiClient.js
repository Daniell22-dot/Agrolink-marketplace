/**
 * Python API Client Service
 * Handles all communication with the Python microservices
 */

const axios = require('axios');
const logger = require('../utils/logger');

const PYTHON_API_BASE = process.env.PYTHON_API_URL || 'http://localhost:5000';

// Create axios instance with base URL
const pythonApiClient = axios.create({
    baseURL: PYTHON_API_BASE,
    timeout: 30000,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Error handler
pythonApiClient.interceptors.response.use(
    response => response,
    error => {
        logger.error(`Python API Error: ${error.message}`);
        return Promise.reject(error);
    }
);

// ==================== RECOMMENDATIONS ====================

exports.getTrendingProducts = async (limit = 10) => {
    try {
        const response = await pythonApiClient.get('/api/recommendations/trending', {
            params: { limit }
        });
        return response.data.data || [];
    } catch (error) {
        logger.error(`getTrendingProducts error: ${error.message}`);
        return [];
    }
};

exports.getRecommendationsForUser = async (userId, limit = 10) => {
    try {
        const response = await pythonApiClient.get(`/api/recommendations/for-user/${userId}`, {
            params: { limit }
        });
        return response.data.data || [];
    } catch (error) {
        logger.error(`getRecommendationsForUser error: ${error.message}`);
        return [];
    }
};

exports.getTrendingCategories = async (limit = 5) => {
    try {
        const response = await pythonApiClient.get('/api/recommendations/categories', {
            params: { limit }
        });
        return response.data.data || [];
    } catch (error) {
        logger.error(`getTrendingCategories error: ${error.message}`);
        return [];
    }
};

// ==================== ANALYTICS ====================

exports.getDashboardStats = async (startDate = null, endDate = null) => {
    try {
        const params = {};
        if (startDate) params.start_date = startDate;
        if (endDate) params.end_date = endDate;

        const response = await pythonApiClient.get('/api/analytics/dashboard', { params });
        return response.data.data || {};
    } catch (error) {
        logger.error(`getDashboardStats error: ${error.message}`);
        return {};
    }
};

exports.getSalesReport = async (startDate, endDate) => {
    try {
        const response = await pythonApiClient.post('/api/analytics/sales-report', {
            start_date: startDate,
            end_date: endDate
        });
        return response.data.data || {};
    } catch (error) {
        logger.error(`getSalesReport error: ${error.message}`);
        return {};
    }
};

exports.getUserAnalytics = async (userId) => {
    try {
        const response = await pythonApiClient.get(`/api/analytics/user/${userId}`);
        return response.data.data || null;
    } catch (error) {
        logger.error(`getUserAnalytics error: ${error.message}`);
        return null;
    }
};

exports.getTopProducts = async (limit = 10, days = 30) => {
    try {
        const response = await pythonApiClient.get('/api/analytics/top-products', {
            params: { limit, days }
        });
        return response.data.data || [];
    } catch (error) {
        logger.error(`getTopProducts error: ${error.message}`);
        return [];
    }
};

// ==================== PRICE PREDICTION ====================

exports.predictPrice = async (category, supply, demand, season = null, daysHarvest = 30, qualityGrade = 'standard') => {
    try {
        const response = await pythonApiClient.post('/api/pricing/predict', {
            category,
            supply,
            demand,
            season,
            days_since_harvest: daysHarvest,
            quality_grade: qualityGrade
        });
        return response.data.predicted_price || null;
    } catch (error) {
        logger.error(`predictPrice error: ${error.message}`);
        return null;
    }
};

exports.getPriceTrends = async (category, days = 90) => {
    try {
        const response = await pythonApiClient.get(`/api/pricing/trends/${category}`, {
            params: { days }
        });
        return response.data.data || [];
    } catch (error) {
        logger.error(`getPriceTrends error: ${error.message}`);
        return [];
    }
};

exports.getOptimalPrice = async (productId) => {
    try {
        const response = await pythonApiClient.get(`/api/pricing/optimal/${productId}`);
        return response.data.data || null;
    } catch (error) {
        logger.error(`getOptimalPrice error: ${error.message}`);
        return null;
    }
};

exports.trainPriceModel = async () => {
    try {
        const response = await pythonApiClient.post('/api/pricing/train-model');
        return response.data.success || false;
    } catch (error) {
        logger.error(`trainPriceModel error: ${error.message}`);
        return false;
    }
};

// ==================== IMAGE PROCESSING ====================

exports.optimizeImage = async (fileBuffer, filename) => {
    try {
        const FormData = require('form-data');
        const form = new FormData();
        form.append('file', fileBuffer, filename);

        const response = await axios.post(`${PYTHON_API_BASE}/api/images/optimize`, form, {
            headers: form.getHeaders(),
            timeout: 60000
        });

        return response.data.data || null;
    } catch (error) {
        logger.error(`optimizeImage error: ${error.message}`);
        return null;
    }
};

exports.validateImage = async (fileBuffer, filename) => {
    try {
        const FormData = require('form-data');
        const form = new FormData();
        form.append('file', fileBuffer, filename);

        const response = await axios.post(`${PYTHON_API_BASE}/api/images/validate`, form, {
            headers: form.getHeaders(),
            timeout: 30000
        });

        return response.data.data || null;
    } catch (error) {
        logger.error(`validateImage error: ${error.message}`);
        return null;
    }
};

exports.extractImageFeatures = async (fileBuffer, filename) => {
    try {
        const FormData = require('form-data');
        const form = new FormData();
        form.append('file', fileBuffer, filename);

        const response = await axios.post(`${PYTHON_API_BASE}/api/images/extract-features`, form, {
            headers: form.getHeaders(),
            timeout: 30000
        });

        return response.data.data || null;
    } catch (error) {
        logger.error(`extractImageFeatures error: ${error.message}`);
        return null;
    }
};

// ==================== HEALTH CHECK ====================

exports.healthCheck = async () => {
    try {
        const response = await pythonApiClient.get('/health');
        return response.data.status === 'ok';
    } catch (error) {
        logger.warn(`Python API health check failed: ${error.message}`);
        return false;
    }
};

module.exports = exports;
