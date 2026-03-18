const sequelize = require('../src/config/database');
require('dotenv').config();

const showProcesslist = async () => {
  try {
    await sequelize.authenticate();
    const [results] = await sequelize.query("SHOW PROCESSLIST");
    console.log(JSON.stringify(results, null, 2));
    process.exit(0);
  } catch (error) {
    console.error('Error showing processlist:', error);
    process.exit(1);
  }
};

showProcesslist();
