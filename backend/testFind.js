const User = require('./src/models/User');
const sequelize = require('./src/config/database');
const { Op } = require('sequelize');

async function test() {
    await sequelize.authenticate();
    const email = 'admin@agrolink.com';

    const user = await User.findOne({
      where: {
        [Op.or]: [
          { email: sequelize.where(sequelize.fn('LOWER', sequelize.col('email')), Op.eq, email.toLowerCase()) },
          { phone: email }
        ]
      }
    });

    console.log("User found by authController logic:", user ? "YES" : "NO");
    process.exit();
}
test();
