// imports
const mysql = require('mysql2');

// sets up mysql connection (change to your credentials)
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'PuppetAJDB!',
    database: 'employees'
});

// exports connection
module.exports = connection;