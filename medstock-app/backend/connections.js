var mysql = require("mysql2");

var con = mysql.createConnection({

    host: "localhost",
    user: "root",
    password: "dptnm@10MYSQL",
    database: "testdb"
});

module.exports = con;