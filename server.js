const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const path = require('path');
const presidents = require('./routes/api/presidents');
var con = require('./db');

const app = express();



app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


var db_config = {
  host: 'us-cdbr-iron-east-01.cleardb.net',
  user: 'bc62d9444a7632',
  password: '6f42aab0',
  database: 'heroku_e2c313dd41a324d'
};

var connection;

function handleDisconnect() {
  connection = mysql.createConnection(db_config); // Recreate the connection, since
                                                  // the old one cannot be reused.

  connection.connect(function(err) {              // The server is either down
    if(err) {                                     // or restarting (takes a while sometimes).
      console.log('error when connecting to db:', err);
      setTimeout(handleDisconnect, 1000); // We introduce a delay before attempting to reconnect,
    }                                     // to avoid a hot loop, and to allow our node script to
  });                                     // process asynchronous requests in the meantime.
                                          // If you're also serving http, display a 503 error.
  connection.on('error', function(err) {
    console.log('db error', err);
    if(err.code === 'PROTOCOL_CONNECTION_LOST' || err) { // Connection to the MySQL server is usually
      handleDisconnect();                         // lost due to either server restart, or a
    } else {                                      // connnection idle timeout (the wait_timeout
      throw err;                                  // server variable configures this)
    }
  });
}

handleDisconnect();
app.use('/api/presidents', presidents);



const port = process.env.PORT || 5000;

app.use(express.static(path.join(__dirname, 'client/build')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname+'/client/build/index.html'));
});


app.listen(port, () => console.log(`Server running on port ${port}`));

module exports = connection;