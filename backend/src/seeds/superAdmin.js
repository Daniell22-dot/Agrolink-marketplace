const User = require('../models/User');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const seedSuperAdmin = async () => {
    try {
        const adminName = process.env.SUPER_ADMIN_NAME || 'Super Admin';
        const adminPhone = process.env.SUPER_ADMIN_PHONE;
        const adminPassword = process.env.SUPER_ADMIN_PASSWORD;
        const adminEmail = process.env.SUPER_ADMIN_EMAIL || 'admin@agrolink.com';

        if (!adminPhone || !adminPassword) {
            console.error('Super Admin credentials not found in .env');
            process.exit(1);
        }

        const existingAdmin = await User.findOne({ where: { phone: adminPhone } });

        if (existingAdmin) {
            console.log('Super Admin already exists. Updating password...');
            existingAdmin.password = adminPassword;
            existingAdmin.role = 'admin';
            existingAdmin.fullName = adminName;
            existingAdmin.email = adminEmail;
            existingAdmin.isVerified = true;
            await existingAdmin.save();
            console.log('Super Admin updated successfully.');
        } else {
            console.log('Creating Super Admin...');
            await User.create({
                nationalId: '00000000', // Default for seed
                username: 'superadmin',
                fullName: adminName,
                email: adminEmail,
                phone: adminPhone,
                password: adminPassword,
                role: 'admin',
                isVerified: true,
                isActive: true
            });
            console.log('Super Admin created successfully.');
        }
    } catch (error) {
        console.error('Error seeding Super Admin:', error);
    }
};

module.exports = seedSuperAdmin;
