require('dotenv').config(); // Load environment variables
const mysql = require("mysql2");

// Create connections for each database
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

// ✅ New Connection for MedStock DB
const medstockDB = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
});

// Connect to each database
authDB.connect(err => {
    if (err) {
        console.error('❌ Error connecting to auth_db:', err.message);
        process.exit(1);
    }
    console.log('✅ Connected to auth_db');
});

adminDB.connect(err => {
    if (err) {
        console.error('❌ Error connecting to admin_db:', err.message);
        process.exit(1);
    }
    console.log('✅ Connected to admin_db');
});

userDB.connect(err => {
    if (err) {
        console.error('❌ Error connecting to user_db:', err.message);
        process.exit(1);
    }
    console.log('✅ Connected to user_db');
});

// ✅ Connect to medstockDB
medstockDB.connect(err => {
    if (err) {
        console.error('❌ Error connecting to medstock:', err.message);
        process.exit(1);
    }
    console.log('✅ Connected to medstock');
});

// Export all connections
module.exports = { authDB, adminDB, userDB, medstockDB };
