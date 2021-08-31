const mysql = require('mysql2');
const config = require('./config');

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  database: 'julien_laforge_shopapp',
  password: config.dbPassword
});

module.exports = pool.promise();
