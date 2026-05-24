const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD ?? ''
};

const databaseName = process.env.DB_NAME || 'midwest_shipment';

const pool = mysql.createPool({
  ...dbConfig,
  database: databaseName,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0
});

const initializeDatabase = async () => {
  const connection = await mysql.createConnection(dbConfig);

  try {
    await connection.query(`CREATE DATABASE IF NOT EXISTS ${databaseName} CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`);
    await connection.query(`USE ${databaseName}`);
    await connection.query(`
      CREATE TABLE IF NOT EXISTS admins (
        id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(150) NOT NULL UNIQUE,
        password_hash VARCHAR(255) NOT NULL,
        role ENUM('super_admin','admin') DEFAULT 'admin',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB
    `);

    const adminEmail = process.env.ADMIN_EMAIL || 'admin@midwestshipment.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'Admin@123456';
    const adminPasswordHash = await bcrypt.hash(adminPassword, 12);

    await connection.query(`
      INSERT INTO admins (name, email, password_hash, role)
      VALUES (
        'Super Admin',
        ?,
        ?,
        'super_admin'
      )
      ON DUPLICATE KEY UPDATE
        name = VALUES(name),
        password_hash = VALUES(password_hash),
        role = VALUES(role)
    `, [adminEmail, adminPasswordHash]);
    console.log('✅ Admin authentication schema initialized');
  } finally {
    await connection.end();
  }
};

const testConnection = async () => {
  try {
    const connection = await pool.getConnection();
    console.log('✅ MySQL Database connected successfully');
    connection.release();
  } catch (error) {
    const details = error?.message || error || 'Unknown database error';
    console.error('❌ Database connection failed:', details);
    if (error?.code) {
      console.error(`   Error code: ${error.code}`);
    }

    if (error?.code === 'ECONNREFUSED') {
      console.error('   MySQL is not running on localhost:3306.');
      console.error('   Start your MySQL server, then rerun npm run backend.');
    }

    if (error?.code === 'ER_ACCESS_DENIED_ERROR') {
      console.error('   Check your MySQL credentials in backend/.env.');
    }

    process.exit(1);
  }
};

module.exports = { pool, testConnection, initializeDatabase };