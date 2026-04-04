const sequelize = require('./src/config/database');

async function runAlter() {
    try {
        await sequelize.authenticate();
        await sequelize.query('ALTER TABLE users MODIFY COLUMN national_id VARCHAR(20) NULL;');
        console.log('ALTER TABLE SUCCESSFUL: national_id is now nullable');
        process.exit();
    } catch (e) {
        console.error('ALTER TABLE FAILED:', e);
        process.exit(1);
    }
}
runAlter();
