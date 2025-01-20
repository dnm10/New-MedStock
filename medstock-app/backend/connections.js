var mysql = require("mysql2");

var con = mysql.createConnection({

    host: "localhost",
    user: "root",
    password: "dptnm@10MYSQL",  
    // password: "Sql29@my#",
    database: "medstock"
});

module.exports = con;