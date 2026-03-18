const User = require('./src/models/User');
const sequelize = require('./src/config/database');

async function unlockAdmin() {
    try {
        await sequelize.authenticate();
        const admin = await User.findOne({ where: { email: 'admin@agrolink.com' } });
        if (admin) {
            admin.failedLoginAttempts = 0;
            admin.accountLockedUntil = null;
            await admin.save();
            console.log('Admin account unlocked.');
        } else {
            console.log('Admin not found.');
        }
        process.exit(0);
    } catch (err) {
        console.error('Error unlocking admin:', err);
        process.exit(1);
    }
}

unlockAdmin();
