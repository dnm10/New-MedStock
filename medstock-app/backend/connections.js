require('dotenv').config(); // Load environment variables
const mysql = require("mysql2");

// Create connections for each database (single connections)
const authDB = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.AUTH_DB
});

const adminDB = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.ADMIN_DB
});

const userDB = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.USER_DB
});

// ✅ Medstock connection using a pool (required for transactions and async/await)
const medstockDB = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Test auth DB connection
authDB.connect(err => {
    if (err) {
        console.error('❌ Error connecting to auth_db:', err.message);
        process.exit(1);
    }
    console.log('✅ Connected to auth_db');
});

// Test admin DB connection
adminDB.connect(err => {
    if (err) {
        console.error('❌ Error connecting to admin_db:', err.message);
        process.exit(1);
    }
    console.log('✅ Connected to admin_db');
});

// Test user DB connection
userDB.connect(err => {
    if (err) {
        console.error('❌ Error connecting to user_db:', err.message);
        process.exit(1);
    }
    console.log('✅ Connected to user_db');
});

// ✅ Test medstock pool connection
medstockDB.getConnection((err, connection) => {
    if (err) {
        console.error('❌ Error connecting to medstock pool:', err.message);
    } else {
        console.log('✅ Connected to medstock pool');
        connection.release();
    }
});

// Export all connections
module.exports = { authDB, adminDB, userDB, medstockDB };
