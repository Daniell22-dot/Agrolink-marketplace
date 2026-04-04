const seedSuperAdmin = require('./src/seeds/superAdmin');
const sequelize = require('./src/config/database');

const run = async () => {
    try {
        await sequelize.authenticate();
        console.log('Database connected.');
        await seedSuperAdmin();
        console.log('Seeder ran.');
        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
};

run();
