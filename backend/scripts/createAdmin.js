const User = require('../src/models/User');
const sequelize = require('../src/config/database');
require('dotenv').config();

const createAdmin = async () => {
  try {
    await sequelize.authenticate();
    console.log('Connected to database');

    await sequelize.sync({ alter: true });
    console.log('Database synced');

    const adminEmail = 'admin@agrilink.com';
    const existingAdmin = await User.findOne({ where: { email: adminEmail } });

    if (!existingAdmin) {
      await User.create({
        nationalId: '00000000',
        username: 'admin',
        fullName: 'System Administrator',
        email: adminEmail,
        password: 'password123',
        phone: '0700000000',
        role: 'admin',
        location: 'Nairobi',
        isVerified: true
      });
      console.log('Admin user created successfully');
    } else {
      console.log('Admin user already exists');
    }

    process.exit(0);
  } catch (error) {
    console.error('Error creating admin user:', error);
    process.exit(1);
  }
};

createAdmin();
