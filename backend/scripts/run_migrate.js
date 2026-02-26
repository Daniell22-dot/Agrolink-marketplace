const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.resolve(__dirname, '..', '.env') });

const sequelize = require('../src/config/database');

async function run() {
  try {
    console.log('Starting DB migration: authenticate...');
    await sequelize.authenticate();
    console.log('Authenticated with DB');

    // Enable logging for this sync
    console.log('Running sequelize.sync({ alter: true }) — altering tables...');
    await sequelize.sync({ alter: true, logging: (sql) => console.log('SQL:', sql) });
    console.log('✅ Migration completed successfully');
    
    // Test Product model
    const Product = require('../src/models/Product');
    const products = await Product.findAll({ limit: 1 });
    console.log('✅ Product query successful. Count:', products.length);
    
    process.exit(0);
  } catch (err) {
    console.error('❌ Migration failed:', err.message);
    if (err.original) console.error('Original error:', err.original.message);
    console.error('SQL:', err.sql);
    process.exit(1);
  }
}

run();
