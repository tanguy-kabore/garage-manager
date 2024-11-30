const mysql = require('mysql');

// Create a connection to the database
const connection = mysql.createConnection({
    host: 'localhost',  // or '127.0.0.1'
    user: 'root',       // your MySQL username, root is default
    password: '',       // your MySQL password, empty by default in Laragon
    database: 'garage_manager'  // your database name
});

// Open the MySQL connection
connection.connect(error => {
    if (error) throw error;
    console.log("Successfully connected to the database.");
});

module.exports = connection;
