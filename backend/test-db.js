const sequelize = require('./src/config/database');
const Product = require('./src/models/Product');

async function test() {
  try {
    await sequelize.authenticate();
    console.log(' DB connected');

    // Try to fetch products
    const products = await Product.findAll({ limit: 5 });
    console.log(' Products found:', products.length);
    console.log(JSON.stringify(products, null, 2));
  } catch (err) {
    console.error(' Error:', err.message);
    if (err.original) console.error('Original:', err.original.message);
    console.error('SQL:', err.sql);
  }
  process.exit(0);
}

test();
