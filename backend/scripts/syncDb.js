const sequelize = require('../src/config/database');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const syncDatabase = async () => {
  try {
    if (!process.env.DATABASE_URL) {
      console.error('ERROR: DATABASE_URL is not set.');
      process.exit(1);
    }

    console.log('Connecting to Neon database...');
    await sequelize.authenticate();
    console.log('Connected successfully.');

    // Import all models
    const modelsPath = path.join(__dirname, '../src/models');
    fs.readdirSync(modelsPath).forEach(file => {
      if (file.endsWith('.js')) {
        require(path.join(modelsPath, file));
      }
    });

    // Use force:true for fresh database (drops + recreates)
    // Switch to alter:true once the database has data
    const force = process.argv.includes('--force');
    console.log(`Syncing database (force=${force})...`);
    await sequelize.sync({ force });
    console.log('All tables created successfully!');

    const [results] = await sequelize.query(
      "SELECT tablename FROM pg_tables WHERE schemaname = 'public' ORDER BY tablename"
    );
    console.log('\nTables in database:');
    results.forEach(r => console.log('  -', r.tablename));

    await sequelize.close();
    process.exit(0);
  } catch (error) {
    console.error('Sync failed:', error.message);
    process.exit(1);
  }
};

syncDatabase();
