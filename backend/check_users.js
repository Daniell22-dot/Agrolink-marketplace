const User = require('./src/models/User');
const sequelize = require('./src/config/database');

async function checkUsers() {
    try {
        await sequelize.authenticate();
        const users = await User.findAll();
        console.log('--- USER DATA ---');
        console.log('Total Users:', users.length);
        users.forEach(u => {
            console.log(`ID: ${u.id}, Name: ${u.fullName}, Email: ${u.email}, Phone: ${u.phone}, Role: ${u.role}`);
        });
        process.exit(0);
    } catch (err) {
        console.error('Error checking users:', err);
        process.exit(1);
    }
}

checkUsers();
