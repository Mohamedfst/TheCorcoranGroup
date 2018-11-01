const mysql = require('mysql');
//mysql://bb78941cf50806:2af7b37b@us-cdbr-iron-east-01.cleardb.net/?reconnect=true
var con = mysql.createPool ({
  connectionLimit : 10,
  host: 'us-cdbr-iron-east-01.cleardb.net',
  user: 'bb78941cf50806',
  password: '2af7b37b',
  database: 'heroku_95b41686b9959a9'
});






module.exports = con;