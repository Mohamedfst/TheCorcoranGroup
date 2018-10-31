const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const path = require('path');
const presidents = require('./routes/api/presidents');
var con = require('./db');

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/api/presidents', presidents);

// Port 8080 for Google App Engine
app.set('port', process.env.PORT || 5000);
app.listen(5000);

module.exports = app;