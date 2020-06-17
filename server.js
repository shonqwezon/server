'use strict';
var express = require('express');
var app = express();

var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false });
var jsonParser = bodyParser.json();

var auth = require('./auth');

var location = null;


app.get('/auth', urlencodedParser, (req, res) => {
    res.sendFile(__dirname + '/auth.html');
});

app.post('/auth', urlencodedParser, (req, res) => {
    auth.reg(req.body).then((result) => {
        console.log(result);
        res.send(result);
    }).catch((error) => {
        console.log(error);
    });
});



app.get('/', (req, res) => {
    res.send("Main page");
});


app.post('/location.send', jsonParser, (req, res) => {
    console.log("'/location.send'");
    auth.check(req.headers).then((result) => {
        console.log(result);
        if (result) {
            location = req.body;
            res.sendStatus(200);
        }
        else return res.sendStatus(401);
    }).catch((error) => {
        console.log(error);
    });
});


app.get('/location.get', (req, res) => {
    console.log("'/location.get'");
    auth.check(req.headers).then((result) => {
        console.log(result);
        if (result) res.send(location);
        else res.sendStatus(401);        
    }).catch((error) => {
        console.log(error);
    });   
});


app.listen(8383);
console.log('Server created on port 8383');
