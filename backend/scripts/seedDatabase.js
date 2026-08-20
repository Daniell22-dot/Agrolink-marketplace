const { Client } = require('pg');
const bcrypt = require('bcryptjs');
require('dotenv').config();

async function seed() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    console.log('Connected. Seeding...');

    // Create super admin
    const hash = await bcrypt.hash('oromi@254', 10);
    await client.query(
      `INSERT INTO users (full_name, email, phone, password, role, is_verified, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       ON CONFLICT (email) DO NOTHING`,
      ['Daniell Oromi', 'admin@agrolink.com', '+254112219135', hash, 'super_admin', true, 'active']
    );

    // Create default categories
    const categories = [
      ['Vegetables', 'vegetables', 'Fresh vegetables'],
      ['Fruits', 'fruits', 'Fresh fruits'],
      ['Grains', 'grains', 'Grains and cereals'],
      ['Livestock', 'livestock', 'Livestock and poultry'],
      ['Dairy', 'dairy', 'Dairy and eggs'],
      ['Herbs', 'herbs', 'Herbs and spices']
    ];

    for (const [name, slug, desc] of categories) {
      await client.query(
        'INSERT INTO categories (name, slug, description) VALUES ($1, $2, $3) ON CONFLICT (slug) DO NOTHING',
        [name, slug, desc]
      );
    }

    const admin = await client.query(
      'SELECT id, full_name, email, role FROM users WHERE email = $1',
      ['admin@agrolink.com']
    );
    console.log('Admin user:', admin.rows[0]);

    const cats = await client.query('SELECT id, name FROM categories ORDER BY id');
    console.log('Categories:', cats.rows);

    await client.end();
    console.log('Seeding complete!');
    process.exit(0);
  } catch (error) {
    console.error('Seed failed:', error.message);
    await client.end().catch(() => {});
    process.exit(1);
  }
}

seed();
