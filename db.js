const mysql = require('mysql');
//mysql://bc62d9444a7632:6f42aab0@us - cdbr - iron - east - 01. cleardb.net/heroku_e2c313dd41a324d?reconnect=true
var con = mysql.createConnection({
    host: "us-cdbr-iron-east-01.cleardb.net",
    user: "bc62d9444a7632",
    database: "heroku_e2c313dd41a324d",
    password: "6f42aab0"
});

con.connect(function(err) {
    if (err) {
        console.error(err);
        return;
    }
    console.log('Connected ');
});

module.exports = con;