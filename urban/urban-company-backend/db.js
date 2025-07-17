// db.js (urban-company-backend/db.js)

const mysql = require('mysql2');

// ✅ MySQL connection configuration
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',       // Replace with your MySQL username
    password: '#23Kukli_tales',   // Replace with your MySQL password
    database: 'urbandb'                // Your provided database name
});

// ✅ Connecting to the MySQL database
db.connect((err) => {
    if (err) {
        console.error('Database connection failed:', err);
        return;
    }
    console.log('Connected to MySQL Database.');
});

module.exports = db;
