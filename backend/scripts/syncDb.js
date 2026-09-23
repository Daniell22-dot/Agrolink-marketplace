require('dotenv').config();
const path = require('path');
const sequelize = require(path.join(__dirname, '..', 'src', 'config', 'database'));

// Import all models to ensure they are registered
require(path.join(__dirname, '..', 'src', 'models', 'User'));
require(path.join(__dirname, '..', 'src', 'models', 'Product'));
require(path.join(__dirname, '..', 'src', 'models', 'ProductVariant'));
require(path.join(__dirname, '..', 'src', 'models', 'Category'));
require(path.join(__dirname, '..', 'src', 'models', 'Order'));
require(path.join(__dirname, '..', 'src', 'models', 'OrderItem'));
require(path.join(__dirname, '..', 'src', 'models', 'Delivery'));
require(path.join(__dirname, '..', 'src', 'models', 'DeliveryAgent'));
require(path.join(__dirname, '..', 'src', 'models', 'Chat'));
require(path.join(__dirname, '..', 'src', 'models', 'Message'));
require(path.join(__dirname, '..', 'src', 'models', 'Review'));
require(path.join(__dirname, '..', 'src', 'models', 'Notification'));
require(path.join(__dirname, '..', 'src', 'models', 'Payment'));
require(path.join(__dirname, '..', 'src', 'models', 'Transaction'));
require(path.join(__dirname, '..', 'src', 'models', 'RefreshToken'));
require(path.join(__dirname, '..', 'src', 'models', 'SecurityInvite'));
require(path.join(__dirname, '..', 'src', 'models', 'Report'));
require(path.join(__dirname, '..', 'src', 'models', 'UserInteraction'));

async function syncDatabase() {
  try {
    console.log('🔄 Connecting to database...');
    await sequelize.authenticate();
    console.log('✅ Database connection established.');

    console.log('🔄 Dropping all tables and recreating...');
    await sequelize.drop({ cascade: true, force: true });
    console.log('✅ All tables dropped.');

    console.log('🔄 Creating tables...');
    await sequelize.sync({ force: true });
    console.log('✅ All tables created successfully.');

    console.log('\n📋 Tables created:');
    const tables = await sequelize.getQueryInterface().showTables();
    for (const t of tables) {
      const tableName = t.table_name || t;
      console.log(`  - ${tableName}`);
    }

    await sequelize.close();
    console.log('\n✅ Done!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

syncDatabase();
