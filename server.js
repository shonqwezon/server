'use strict';
var express = require('express');
var app = express();

var { Client } = require('pg');

var client = new Client({
    user: 'qishon',
    host: 'localhost',
    database: 'gpsdata',
    password: 'infiniti130191',
    port: 5432
});


app.post('/', function (req, res) {
    console.log('req is comming');
    client.connect();
    console.log('Conecting to gpsdata...');
    return res.sendStatus(200);
    console.log('Connected...');
});

app.listen(8383);
console.log('Server created on port 8383');