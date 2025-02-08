const mysql = require('mysql2');

const pool = mysql.createPool({
  host: 'localhost',
  user: 'YOUR_MYSQL_USERNAME',     // Add your MySQL username
  password: 'YOUR_MYSQL_PASSWORD', // Add your MySQL password
  database: 'finscope',
  waitForConnections: true,
  connectionLimit: 10,
});

module.exports = pool.promise();