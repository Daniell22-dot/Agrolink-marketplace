const sequelize = require('../src/config/database');
const User = require('../src/models/User');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const resetPassword = async () => {
  try {
    const email = 'manyasadaniel630@gmail.com';
    const newPassword = 'password123';
    const user = await User.findOne({ where: { email } });
    
    if (!user) {
      console.log('User not found');
      process.exit(0);
    }

    user.password = newPassword;
    user.failedLoginAttempts = 0;
    user.accountLockedUntil = null;
    await user.save();
    
    console.log(`Password reset for ${email} to ${newPassword}`);
    process.exit(0);
  } catch (error) {
    console.error('Error resetting password:', error);
    process.exit(1);
  }
};

resetPassword();
