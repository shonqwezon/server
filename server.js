'use strict';
var express = require('express');
var app = express();

var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false });
var jsonParser = bodyParser.json();

var auth = require('./auth');


app.get('/auth', urlencodedParser, (req, res) => {
    res.sendFile(__dirname + '/auth.html');
});

app.post('/auth', urlencodedParser, (req, res) => {
    auth.reg(req.body).then((result) => {
        console.log(result);
        console.log("Prog ended");
        res.send(result);
    }).catch((error) => {
        console.log(error);
        console.log("Prog ended");
    });
});



app.get('/', (req, res) => {
    res.send("Main page");
});


app.post('/location.send', jsonParser, (req, res) => {
    if (auth.check(req.headers)) {
        location = req.body;
        return res.sendStatus(200);
    }
    else return res.sendStatus(401);

});

app.get('/location.get', (req, res) => {
    if (auth.check(req.headers)) res.send(location);
    else return res.sendStatus(401);
});


app.listen(8383);
console.log('Server created on port 8383');
