import api from './api';

export const productService = {
    // Get all products
    getProducts: async (filters = {}) => {
        const params = new URLSearchParams(filters);
        const response = await api.get(`/products?${params}`);
        return response.data;
    },

    // Get product by ID
    getProductById: async (id) => {
        const response = await api.get(`/products/${id}`);
        return response.data;
    },

    // Create product (farmers only)
    createProduct: async (productData) => {
        const response = await api.post('/products', productData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return response.data;
    },

    // Update product
    updateProduct: async (id, productData) => {
        const response = await api.put(`/products/${id}`, productData);
        return response.data;
    },

    // Delete product
    deleteProduct: async (id) => {
        const response = await api.delete(`/products/${id}`);
        return response.data;
    },

    // Search products
    searchProducts: async (query) => {
        const response = await api.get(`/products/search?q=${query}`);
        return response.data;
    }
};

export default productService;
