const mysql = require('mysql2');

const pool = mysql.createPool({
  host: 'localhost',
  user: 'finscope',
  password: 'finscope',
  database: 'finscope', // match your .sql file
  waitForConnections: true,
  connectionLimit: 10,
});

module.exports = pool.promise();