import api from './api';

export const paymentService = {
    // Initiate M-Pesa payment
    initiateMpesa: async (paymentData) => {
        const response = await api.post('/payments/mpesa/initiate', paymentData);
        return response.data;
    },

    // Check payment status
    checkPaymentStatus: async (checkoutRequestId) => {
        const response = await api.get(`/payments/status/${checkoutRequestId}`);
        return response.data;
    },

    // Get payment history
    getPaymentHistory: async () => {
        const response = await api.get('/payments/history');
        return response.data;
    }
};

export default paymentService;
