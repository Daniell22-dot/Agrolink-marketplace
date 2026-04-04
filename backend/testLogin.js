const User = require('./src/models/User');
const sequelize = require('./src/config/database');

async function test() {
    await sequelize.authenticate();
    const user = await User.findOne({ where: { email: 'admin@agrolink.com' }});
    console.log("User:", user ? "Found" : "Not Found");
    if (user) {
        const isMatch = await user.comparePassword('oromi@254');
        console.log("Password match:", isMatch);
    }
    process.exit();
}
test();
