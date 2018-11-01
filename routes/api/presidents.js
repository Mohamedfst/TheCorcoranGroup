const express = require('express');
const bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false });
const router = express.Router();
const mysql = require('mysql');
var con = require('../../db');

const fs = require('fs');
const readline = require('readline');
const { google } = require('googleapis');
const credentials = require('../../credentials');

// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets.readonly'];
const TOKEN_PATH = '';
var count = 1;

// Get documents from google sheet to mysql
router.get('/activate', function(req, res) {
    function listMajors(auth) {
        const sheets = google.sheets({ version: 'v4', auth });
        sheets.spreadsheets.values.get({
            spreadsheetId: '1i2qbKeasPptIrY1PkFVjbHSrLtKEPIIwES6m2l2Mdd8',
            range: 'sheet1',
        }, (err, res) => {
            if (err) return console.log('The API returned an error: ' + err);
            const rows = res.data.values;
            if (rows.length) {

                // Print columns A and E, which correspond to indices 0 and 4.
                rows.map((row) => {
                    var President = row[0];
                    var Birthday = row[1];
                    var Birthplace = row[2];
                    var DeathDay = row[3];
                    var DeathPlace = row[4];
                    if (count === 1) {

                        var sql = "CREATE TABLE IF NOT EXISTS cgons (President VARCHAR(255),Birthday DATE,Birthplace VARCHAR(205),DeathDay DATE,DeathPlace VARCHAR(205))";
                        con.query(sql,
                            function(error, results) {
                                if (error) {
                                    throw error;
                                } else {
                                    console.log("1 record inserted");
                                    return results;
                                }
                            });
                        count++;
                    } else {
                        var sql = "INSERT INTO cgons (President,Birthday,Birthplace,DeathDay,DeathPlace) VALUES (?,?,?,?,?)";
                        con.query(sql, [President, Birthday, Birthplace, DeathDay, DeathPlace],
                            function(error, results) {
                                if (error) {
                                    throw error;
                                } else {
                                    console.log("1 record added");
                                    return results;
                                }

                            });
                    }
                });

            } else {
                console.log('No data found.');
            }
        });
    }


    function getNewToken(oAuth2Client, callback) {
        const authUrl = oAuth2Client.generateAuthUrl({
            access_type: 'offline',
            scope: SCOPES,
        });
        console.log('Authorize this app by visiting this url:', authUrl);
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
        });
        rl.question('Enter the code from that page here: ', (code) => {
            rl.close();
            oAuth2Client.getToken(code, (err, token) => {
                if (err) return console.error('Error while trying to retrieve access token', err);
                oAuth2Client.setCredentials(token);
                // Store the token to disk for later program executions
                fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
                    if (err) console.error(err);
                    console.log('Token stored to', TOKEN_PATH);
                });
                callback(oAuth2Client);
            });
        });
    }

    function authorize(credentials, callback) {
        const { client_secret, client_id, redirect_uris } = credentials.installed;
        const oAuth2Client = new google.auth.OAuth2(
            client_id, client_secret, redirect_uris[0]);

        // Check if we have previously stored a token.
        fs.readFile(TOKEN_PATH, (err, token) => {
            if (err) return getNewToken(oAuth2Client, callback);
            oAuth2Client.setCredentials(JSON.parse(token));
            callback(oAuth2Client);
        });
    }

    fs.readFile('credentials.json', (err, content) => {
        if (err) return console.log('Error loading client secret file:', err);
        // Authorize a client with credentials, then call the Google Sheets API.
        authorize(JSON.parse(content), listMajors);
    });

});


//Display all names
router.get('/all', function(req, res) {
    con.query('SELECT * FROM cgons', function(error, results, fields) {
        if (error) {
            throw error;
        } else {
            return res.json(results);
        }
    });
});

//Put  names in Ascending order
router.get('/asc', function(req, res) {
    con.query('SELECT * FROM cgons ORDER BY President ASC', function(error, results, fields) {
        if (error) {
            throw error;
        } else {
            return res.json(results);
        }
    });
});

//Put names in Descending order
router.get('/dsc', function(req, res) {
    con.query('SELECT * FROM cgons ORDER BY President DESC', function(error, results, fields) {
        if (error) {
            throw error;
        } else {
            return res.json(results);
        }
    });
});

module.exports = router;