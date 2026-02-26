const nodemailer = require('nodemailer');
require('dotenv').config();

// Create transporter
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
});

// Email Templates
const emailTemplates = {
    welcome: (name) => ({
        subject: 'Welcome to AgroLink!',
        html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #2d8c3e 0%, #ff8c00 100%); padding: 20px; text-align: center;">
          <h1 style="color: white; margin: 0;">Welcome to AgroLink!</h1>
        </div>
        <div style="padding: 20px; background: #f5f5f5;">
          <h2>Hello ${name}!</h2>
          <p>Thank you for joining AgroLink - connecting farmers to markets!</p>
          <p>Start exploring fresh agricultural produce from local farmers.</p>
          <a href="${process.env.FRONTEND_URL}" style="display: inline-block; padding: 12px 24px; background: #2d8c3e; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0;">Explore Products</a>
        </div>
        <div style="padding: 10px; text-align: center; color: #666; font-size: 12px;">
          <p>&copy; 2024 AgroLink. Empowering Agriculture.</p>
        </div>
      </div>
    `
    }),

    orderConfirmation: (name, orderId, total) => ({
        subject: `Order Confirmation #${orderId}`,
        html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #2d8c3e; padding: 20px; text-align: center;">
          <h1 style="color: white;">Order Confirmed!</h1>
        </div>
        <div style="padding: 20px;">
          <h2>Hi ${name},</h2>
          <p>Your order <strong>#${orderId}</strong> has been confirmed!</p>
          <p><strong>Total Amount:</strong> KES ${total}</p>
          <p>We'll notify you when your order is shipped.</p>
        </div>
      </div>
    `
    }),

    passwordReset: (name, resetUrl) => ({
        subject: 'Password Reset Request',
        html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="padding: 20px;">
          <h2>Hi ${name},</h2>
          <p>You requested to reset your password. Click the button below:</p>
          <a href="${resetUrl}" style="display: inline-block; padding: 12px 24px; background: #ff8c00; color: white; text-decoration: none; border-radius: 5px;">Reset Password</a>
          <p style="color: #666; margin-top: 20px;">This link expires in 10 minutes.</p>
          <p>If you didn't request this, please ignore this email.</p>
        </div>
      </div>
    `
    })
};

// Send Email Function
exports.sendEmail = async ({ email, template, data }) => {
    try {
        const emailContent = emailTemplates[template](...Object.values(data));

        const message = {
            from: `AgroLink <${process.env.SMTP_USER}>`,
            to: email,
            subject: emailContent.subject,
            html: emailContent.html
        };

        const info = await transporter.sendMail(message);
        console.log('Email sent:', info.messageId);
        return info;
    } catch (error) {
        console.error('Email error:', error);
        throw error;
    }
};

module.exports = exports;
