const User = require('./src/models/User');
const sequelize = require('./src/config/database');

async function fixAdmin() {
    try {
        await sequelize.authenticate();
        
        // Find by phone (which is unique)
        const user = await User.findOne({ where: { phone: '+254112219135' } });
        
        if (user) {
            console.log('Found user with phone +254112219135. Updating to Admin...');
            user.role = 'admin';
            user.fullName = 'Daniell Oromi';
            user.email = 'admin@agrolink.com';
            user.password = 'oromi@254'; // bcrypt hook will hash it
            user.isVerified = true;
            user.status = 'active';
            await user.save();
            console.log('User promoted to Admin successfully.');
        } else {
            console.log('User not found. Check if the seeder can create it.');
        }
        process.exit(0);
    } catch (err) {
        console.error('Error fixing admin:', err);
        process.exit(1);
    }
}

fixAdmin();
