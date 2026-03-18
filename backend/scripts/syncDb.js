const sequelize = require('../src/config/database');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const syncDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log('Connected to database');

    // Import all models to ensure they are registered with Sequelize
    const modelsPath = path.join(__dirname, '../src/models');
    fs.readdirSync(modelsPath).forEach(file => {
      if (file.endsWith('.js')) {
        console.log(`Loading model: ${file}`);
        require(path.join(modelsPath, file));
      }
    });

    console.log('Syncing database with alter: true...');
    await sequelize.sync({ alter: true });
    console.log('Database synced successfully');

    process.exit(0);
  } catch (error) {
    console.error('Error syncing database:', error);
    process.exit(1);
  }
};

syncDatabase();
