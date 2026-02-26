const mysql = require('mysql2/promise');
require('dotenv').config();

async function test() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME
    });

    // Get table columns
    const [columns] = await connection.query(`
      SELECT COLUMN_NAME, DATA_TYPE, IS_NULLABLE, COLUMN_DEFAULT
      FROM INFORMATION_SCHEMA.COLUMNS
      WHERE TABLE_NAME = 'Products' AND TABLE_SCHEMA = ?
    `, [process.env.DB_NAME]);

    console.log('Columns in Products table:');
    columns.forEach(col => {
      console.log(`  ${col.COLUMN_NAME} - ${col.DATA_TYPE} (nullable: ${col.IS_NULLABLE})`);
    });

    await connection.end();
  } catch (err) {
    console.error('Error:', err.message);
  }
  process.exit(0);
}

test();
