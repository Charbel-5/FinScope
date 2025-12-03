const mysql = require('mysql2');

const pool = mysql.createPool({
  host: "finscope-db.cdewcsgsgqz8.me-central-1.rds.amazonaws.com",
  user: "finscopeapp",
  password: "StrongAppPass123!",
  database: "finscope",
  waitForConnections: true,
  connectionLimit: 10,
});

module.exports = pool.promise();