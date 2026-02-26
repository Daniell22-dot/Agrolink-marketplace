const africastalking = require('africastalking');
require('dotenv').config();

const credentials = {
    apiKey: process.env.AFRICASTALKING_API_KEY,
    username: process.env.AFRICASTALKING_USERNAME || 'sandbox'
};

const at = africastalking(credentials);
const sms = at.SMS;

exports.sendSMS = async (to, message) => {
    try {
        const options = {
            to: [to], // array of phone numbers
            message: message,
            // from: 'AgroLink' // Shortcode or Sender ID (optional in sandbox)
        };
        const result = await sms.send(options);
        console.log('SMS sent:', result);
        return result;
    } catch (error) {
        console.error('Error sending SMS:', error);
        // Don't throw error to prevent blocking main flow, just log
        return null;
    }
};
