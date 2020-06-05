'use strict';
var express = require('express');
var app = express();

var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false });
var jsonParser = bodyParser.json()

var auth = require('./auth');

var location = null;

app.get('/auth', urlencodedParser, function (req, res) {
    res.sendFile(__dirname + '/auth.html');
});

app.post('/auth', urlencodedParser, function (req, res) {
    console.log(req.body);
    return res.send(auth.reg(req.body));;
});



app.get('/', function (req, res) {
    res.send("Main page");
});



app.post('/location.send', jsonParser, function (req, res) {
    if (auth.check(req.headers.general)) {
        location = req.body;
        return res.sendStatus(200);
    }
    else return res.sendStatus(401);

});

app.get('/location.get', function (req, res) {
    if (auth.check(req.headers.general)) res.send(location);
    else return res.sendStatus(401);
});


app.listen(8383);
    