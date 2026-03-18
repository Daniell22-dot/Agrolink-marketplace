const sequelize = require('../src/config/database');
const User = require('../src/models/User');
require('dotenv').config();

const countUsers = async () => {
  try {
    await sequelize.authenticate();
    const count = await User.count();
    const users = await User.findAll({ attributes: ['id', 'email', 'role', 'failedLoginAttempts', 'accountLockedUntil'] });
    console.log(`Total users in DB: ${count}`);
    console.log('Users info:');
    console.log(JSON.stringify(users, null, 2));
    process.exit(0);
  } catch (error) {
    console.error('Error counting users:', error);
    process.exit(1);
  }
};

countUsers();
