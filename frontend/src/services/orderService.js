import api from './api';

export const orderService = {
    // Create order
    createOrder: async (orderData) => {
        const response = await api.post('/orders', orderData);
        return response.data;
    },

    // Get user orders
    getMyOrders: async () => {
        const response = await api.get('/orders/my');
        return response.data;
    },

    // Get order by ID
    getOrderById: async (id) => {
        const response = await api.get(`/orders/${id}`);
        return response.data;
    },

    // Update order status (admin/farmer)
    updateOrderStatus: async (id, status) => {
        const response = await api.put(`/orders/${id}/status`, { status });
        return response.data;
    },

    // Cancel order
    cancelOrder: async (id) => {
        const response = await api.put(`/orders/${id}/cancel`);
        return response.data;
    }
};

export default orderService;
