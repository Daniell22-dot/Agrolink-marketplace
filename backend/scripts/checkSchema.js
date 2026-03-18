const sequelize = require('../src/config/database');
require('dotenv').config();

const checkSchema = async () => {
  try {
    await sequelize.authenticate();
    const [results] = await sequelize.query("DESCRIBE products");
    console.log(JSON.stringify(results, null, 2));
    process.exit(0);
  } catch (error) {
    console.error('Error checking schema:', error);
    process.exit(1);
  }
};

checkSchema();
