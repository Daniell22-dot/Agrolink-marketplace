const fs = require('fs');
const path = require('path');
const sequelize = require('./src/config/database');

async function runMigration() {
    try {
        const sql = fs.readFileSync(path.join(__dirname, '../database/migrations/add_user_interactions.sql'), 'utf8');
        await sequelize.authenticate();
        console.log('Connected to the database. Running migration...');
        await sequelize.query(sql);
        console.log('Migration completed successfully');
        process.exit(0);
    } catch (err) {
        console.error('Migration failed:', err);
        process.exit(1);
    }
}

runMigration();
