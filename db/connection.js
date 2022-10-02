const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'PuppetAJDB!',
    database: 'employees'
});

module.exports = connection;