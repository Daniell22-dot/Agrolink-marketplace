const axios = require('axios');
require('dotenv').config();

const MPESA_ENV = process.env.MPESA_ENVIRONMENT || 'sandbox';
const BASE_URL = MPESA_ENV === 'sandbox'
    ? 'https://sandbox.safaricom.co.ke'
    : 'https://api.safaricom.co.ke';

// Get OAuth Token
const getAccessToken = async () => {
    try {
        const auth = Buffer.from(
            `${process.env.MPESA_CONSUMER_KEY}:${process.env.MPESA_CONSUMER_SECRET}`
        ).toString('base64');

        const response = await axios.get(`${BASE_URL}/oauth/v1/generate?grant_type=client_credentials`, {
            headers: {
                Authorization: `Basic ${auth}`
            }
        });

        return response.data.access_token;
    } catch (error) {
        console.error('M-Pesa Auth Error:', error);
        throw error;
    }
};

// STK Push (Lipa Na M-Pesa Online)
exports.initiateStkPush = async ({ phoneNumber, amount, accountReference, transactionDesc }) => {
    try {
        const token = await getAccessToken();
        const timestamp = new Date().toISOString().replace(/[^0-9]/g, '').slice(0, -3);
        const shortcode = process.env.MPESA_SHORTCODE;
        const passkey = process.env.MPESA_PASSKEY;

        const password = Buffer.from(`${shortcode}${passkey}${timestamp}`).toString('base64');

        const response = await axios.post(
            `${BASE_URL}/mpesa/stkpush/v1/processrequest`,
            {
                BusinessShortCode: shortcode,
                Password: password,
                Timestamp: timestamp,
                TransactionType: 'CustomerPayBillOnline',
                Amount: amount,
                PartyA: phoneNumber, // Customer phone
                PartyB: shortcode,
                PhoneNumber: phoneNumber,
                CallBackURL: `${process.env.BACKEND_URL || 'http://localhost:5000'}/api/payments/callback`,
                AccountReference: accountReference,
                TransactionDesc: transactionDesc || 'Payment for AgroLink Order'
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        return response.data;
    } catch (error) {
        console.error('STK Push Error:', error.response?.data || error);
        throw error;
    }
};

// Query Transaction Status
exports.queryTransaction = async (checkoutRequestID) => {
    try {
        const token = await getAccessToken();
        const timestamp = new Date().toISOString().replace(/[^0-9]/g, '').slice(0, -3);
        const shortcode = process.env.MPESA_SHORTCODE;
        const passkey = process.env.MPESA_PASSKEY;

        const password = Buffer.from(`${shortcode}${passkey}${timestamp}`).toString('base64');

        const response = await axios.post(
            `${BASE_URL}/mpesa/stkpushquery/v1/query`,
            {
                BusinessShortCode: shortcode,
                Password: password,
                Timestamp: timestamp,
                CheckoutRequestID: checkoutRequestID
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        return response.data;
    } catch (error) {
        console.error('Query Error:', error.response?.data || error);
        throw error;
    }
};

// Process Callback
exports.processCallback = (callbackData) => {
    try {
        const { ResultCode, ResultDesc, CallbackMetadata } = callbackData.Body.stkCallback;

        if (ResultCode === 0) {
            // Payment successful
            const metadata = {};
            CallbackMetadata?.Item?.forEach(item => {
                metadata[item.Name] = item.Value;
            });

            return {
                success: true,
                message: ResultDesc,
                amount: metadata.Amount,
                transactionId: metadata.MpesaReceiptNumber,
                phone: metadata.PhoneNumber
            };
        } else {
            // Payment failed
            return {
                success: false,
                message: ResultDesc
            };
        }
    } catch (error) {
        console.error('Callback Processing Error:', error);
        throw error;
    }
};

module.exports = exports;
