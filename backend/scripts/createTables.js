const { Client } = require('pg');
require('dotenv').config();

const CREATE_TABLES = `
-- Users
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  full_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(50),
  password VARCHAR(255) NOT NULL,
  role VARCHAR(20) DEFAULT 'buyer',
  location VARCHAR(255),
  county VARCHAR(100),
  sub_county VARCHAR(100),
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  avatar VARCHAR(500),
  is_verified BOOLEAN DEFAULT false,
  status VARCHAR(20) DEFAULT 'active',
  two_factor_secret VARCHAR(255),
  two_factor_enabled BOOLEAN DEFAULT false,
  login_attempts INTEGER DEFAULT 0,
  locked_until TIMESTAMP,
  refresh_token TEXT,
  preferences JSONB DEFAULT '{"emailNotifications":true,"smsAlerts":true,"orderUpdates":true,"marketingEmails":false}',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Categories
CREATE TABLE IF NOT EXISTS categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  description TEXT,
  icon VARCHAR(50),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Products
CREATE TABLE IF NOT EXISTS products (
  id SERIAL PRIMARY KEY,
  farmer_id INTEGER REFERENCES users(id),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  category_id INTEGER REFERENCES categories(id),
  category VARCHAR(100),
  price DECIMAL(10,2) NOT NULL,
  original_price DECIMAL(10,2),
  quantity INTEGER DEFAULT 0,
  unit VARCHAR(20) DEFAULT 'kg',
  location VARCHAR(255),
  images JSONB DEFAULT '[]',
  is_available BOOLEAN DEFAULT true,
  views INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Orders
CREATE TABLE IF NOT EXISTS orders (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  total_amount DECIMAL(10,2) NOT NULL,
  status VARCHAR(20) DEFAULT 'pending',
  payment_method VARCHAR(20) NOT NULL,
  payment_status VARCHAR(20) DEFAULT 'pending',
  shipping_address VARCHAR(500) NOT NULL,
  contact_phone VARCHAR(50),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Order Items
CREATE TABLE IF NOT EXISTS order_items (
  id SERIAL PRIMARY KEY,
  order_id INTEGER REFERENCES orders(id),
  product_id INTEGER REFERENCES products(id),
  quantity INTEGER NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  subtotal DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Payments
CREATE TABLE IF NOT EXISTS payments (
  id SERIAL PRIMARY KEY,
  order_id INTEGER REFERENCES orders(id),
  user_id INTEGER REFERENCES users(id),
  amount DECIMAL(10,2) NOT NULL,
  method VARCHAR(20) NOT NULL,
  status VARCHAR(20) DEFAULT 'pending',
  checkout_request_id VARCHAR(255),
  merchant_request_id VARCHAR(255),
  mpesa_receipt_number VARCHAR(255),
  phone_number VARCHAR(50),
  metadata JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Transactions
CREATE TABLE IF NOT EXISTS transactions (
  id SERIAL PRIMARY KEY,
  order_id INTEGER REFERENCES orders(id),
  user_id INTEGER REFERENCES users(id),
  amount DECIMAL(10,2) NOT NULL,
  method VARCHAR(20) NOT NULL,
  type VARCHAR(20) DEFAULT 'payment',
  status VARCHAR(20) DEFAULT 'pending',
  reference VARCHAR(255),
  description TEXT,
  metadata JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Reviews
CREATE TABLE IF NOT EXISTS reviews (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  product_id INTEGER REFERENCES products(id),
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Notifications
CREATE TABLE IF NOT EXISTS notifications (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  type VARCHAR(20) DEFAULT 'system',
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Messages
CREATE TABLE IF NOT EXISTS messages (
  id SERIAL PRIMARY KEY,
  chat_id INTEGER,
  sender_id INTEGER REFERENCES users(id),
  content TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Chats
CREATE TABLE IF NOT EXISTS chats (
  id SERIAL PRIMARY KEY,
  buyer_id INTEGER REFERENCES users(id),
  farmer_id INTEGER REFERENCES users(id),
  product_id INTEGER REFERENCES products(id),
  last_message TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Reports
CREATE TABLE IF NOT EXISTS reports (
  id SERIAL PRIMARY KEY,
  reporter_id INTEGER REFERENCES users(id),
  reported_user_id INTEGER REFERENCES users(id),
  reported_product_id INTEGER REFERENCES products(id),
  type VARCHAR(20) NOT NULL,
  reason VARCHAR(100) NOT NULL,
  description TEXT NOT NULL,
  status VARCHAR(20) DEFAULT 'pending',
  admin_notes TEXT,
  resolved_by INTEGER REFERENCES users(id),
  resolved_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Refresh Tokens
CREATE TABLE IF NOT EXISTS refresh_tokens (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  token TEXT NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Security Invites
CREATE TABLE IF NOT EXISTS security_invites (
  id SERIAL PRIMARY KEY,
  inviter_id INTEGER REFERENCES users(id),
  email VARCHAR(255) NOT NULL,
  token VARCHAR(255) UNIQUE NOT NULL,
  role VARCHAR(20) DEFAULT 'security_auditor',
  status VARCHAR(20) DEFAULT 'pending',
  expires_at TIMESTAMP NOT NULL,
  accepted_by INTEGER REFERENCES users(id),
  accepted_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- User Interactions
CREATE TABLE IF NOT EXISTS user_interactions (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  product_id INTEGER REFERENCES products(id),
  interaction_type VARCHAR(20) NOT NULL,
  metadata JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_products_farmer ON products(farmer_id);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_orders_user ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_order_items_order ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_payments_order ON payments(order_id);
CREATE INDEX IF NOT EXISTS idx_payments_user ON payments(user_id);
CREATE INDEX IF NOT EXISTS idx_reviews_product ON reviews(product_id);
CREATE INDEX IF NOT EXISTS idx_reviews_user ON reviews(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_messages_chat ON messages(chat_id);
CREATE INDEX IF NOT EXISTS idx_chats_buyer ON chats(buyer_id);
CREATE INDEX IF NOT EXISTS idx_chats_farmer ON chats(farmer_id);
CREATE INDEX IF NOT EXISTS idx_user_interactions_user ON user_interactions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_interactions_product ON user_interactions(product_id);
CREATE INDEX IF NOT EXISTS idx_user_interactions_type ON user_interactions(interaction_type);
CREATE INDEX IF NOT EXISTS idx_user_interactions_created ON user_interactions(created_at);
`;

async function main() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  try {
    console.log('Connecting to Neon...');
    await client.connect();
    console.log('Connected. Creating tables...');

    await client.query(CREATE_TABLES);

    const res = await client.query(
      "SELECT tablename FROM pg_tables WHERE schemaname = 'public' ORDER BY tablename"
    );
    console.log('\nTables created:');
    res.rows.forEach(r => console.log('  -', r.tablename));

    await client.end();
    console.log('\nDone!');
    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    await client.end().catch(() => {});
    process.exit(1);
  }
}

main();
