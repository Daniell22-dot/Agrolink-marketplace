const sequelize = require('../src/config/database');
require('dotenv').config();

const fixSchema = async () => {
  try {
    await sequelize.authenticate();
    console.log('Connected to database');

    await sequelize.query("SET innodb_lock_wait_timeout = 10");
    console.log('Set lock wait timeout to 10s');

    console.log('Adding missing columns to refresh_tokens...');
    try {
      await sequelize.query("ALTER TABLE refresh_tokens ADD COLUMN revoked TINYINT(1) DEFAULT 0");
    } catch (e) {
      console.log('refresh_tokens.revoked already exists or error:', e.message);
    }
    
    try {
      await sequelize.query("ALTER TABLE refresh_tokens ADD COLUMN updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP");
    } catch (e) {
      console.log('refresh_tokens.updated_at already exists or error:', e.message);
    }

    console.log('Adding missing columns to users...');
    try {
      await sequelize.query("ALTER TABLE users ADD COLUMN failed_login_attempts INT DEFAULT 0");
    } catch (e) {
      console.log('users.failed_login_attempts already exists or error:', e.message);
    }

    try {
        await sequelize.query("ALTER TABLE users ADD COLUMN account_locked_until DATETIME");
    } catch (e) {
        console.log('users.account_locked_until already exists or error:', e.message);
    }

    try {
        await sequelize.query("ALTER TABLE users ADD COLUMN two_fa_secret VARCHAR(100)");
    } catch (e) {
        console.log('users.two_fa_secret already exists or error:', e.message);
    }

    try {
        await sequelize.query("ALTER TABLE users ADD COLUMN two_fa_enabled TINYINT(1) DEFAULT 0");
    } catch (e) {
        console.log('users.two_fa_enabled already exists or error:', e.message);
    }

    try {
        await sequelize.query("ALTER TABLE users ADD COLUMN last_login DATETIME");
    } catch (e) {
        console.log('users.last_login already exists or error:', e.message);
    }

    try {
        await sequelize.query("ALTER TABLE users ADD COLUMN reset_password_token VARCHAR(255)");
    } catch (e) {
        console.log('users.reset_password_token already exists or error:', e.message);
    }

    try {
        await sequelize.query("ALTER TABLE users ADD COLUMN reset_password_expire DATETIME");
    } catch (e) {
        console.log('users.reset_password_expire already exists or error:', e.message);
    }

    console.log('Schema fix completed');
    process.exit(0);
  } catch (error) {
    console.error('Error fixing schema:', error);
    process.exit(1);
  }
};

fixSchema();
