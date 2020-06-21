'use strict';
var express = require('express');
var app = express();

var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false });
var jsonParser = bodyParser.json();

var auth = require('./auth');
var pos = require('./pos');

var location = null;


app.get('/auth', urlencodedParser, (req, res) => {
    res.sendFile(__dirname + '/auth.html');
});

//регистрация, возращает id + token
app.post('/reg', urlencodedParser, (req, res) => {
    console.log("'/reg' POST");
    auth.reg(req.body).then((result) => {
        res.send(result);
    }).catch((error) => { console.log(error); });
});


//авторизация, возращает код результата
app.post('/auth', urlencodedParser, (req, res) => {
    console.log("'/auth' POST");
    auth.login(req.body).then((result) => {
        if (result) {
            res.sendStatus(200);
        }
        else res.sendStatus(401);
    }).catch((error) => { console.log(error); });
});


app.get('/', (req, res) => {
    res.send("Main page");
});

//принимает запросы с местоположением
app.post('/location.send', jsonParser, (req, res) => {
    console.log("'/location.send' POST");
    auth.check(req.headers).then((result) => {
        if (result) {
            var position = `${req.body.lat}, ${req.body.long}`
            pos.addPos(position, req.headers.id);
            console.log("Position is " + position + " of user " + req.headers.id);
            res.sendStatus(200);
        }
        else res.sendStatus(401);
    }).catch((error) => { console.log(error); });
});

//отсылает ответы с местоположением
app.get('/location.get', (req, res) => {
    console.log("'/location.get' GET");
    auth.check(req.headers).then((result) => {
        if (result) {
            pos.getPos(req.headers.id).then((result) => {
                res.json(result);
            }).catch((error) => { console.log(error); });
        }
        else res.sendStatus(401);        
    }).catch((error) => { console.log(error); });   
});


app.listen(8383);
console.log('Server created on port 8383');
