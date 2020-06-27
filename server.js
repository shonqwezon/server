'use strict';
var fs = require('fs');
var multer = require('multer');
const morgan = require('morgan');

var express = require('express');
var app = express();

var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false });
var jsonParser = bodyParser.json();

var auth = require('./auth');
var pos = require('./pos');
var avatar = require('./avatar');

var upload = multer({ dest: "media" });
app.use(express.static(__dirname));
app.use(morgan('dev'));

//registry, returns token + id
app.post('/reg', urlencodedParser, (req, res) => {
    auth.reg(req.body).then((result) => {
        if (result.status == 200) res.sendStatus(result.status);
        else res.status(result.status).end(result.error);
    }).catch((error) => { console.log("Server " + error); });
});


//check
app.post('/check', (req, res) => {
    auth.check(req.headers).then((result) => {
        if (result) {
            res.sendStatus(200);
        }
        else res.sendStatus(401);
    }).catch((error) => { console.log("Server " + error); });
});


//authentication, returns code
app.post('/auth', urlencodedParser, (req, res) => {
    auth.login(req.body).then((result) => {
        if (result) {
            res.send(result);
        }
        else res.sendStatus(401);
    }).catch((error) => { console.log("Server " + error); });
});


app.get('/', (req, res) => {
    res.send("Main page");
});

//get locations
app.post('/location.send', jsonParser, (req, res) => {
    auth.check(req.headers).then((result) => {
        if (result) {
            var position = `${req.body.lat}, ${req.body.long}`
            pos.addPos(position, req.headers.id);
            console.log("Position is " + position + " of user " + req.headers.id);
            res.sendStatus(200);
        }
        else res.sendStatus(401);
    }).catch((error) => { console.log("Server " + error); });
});

//send locations
app.get('/location.get', (req, res) => {
    auth.check(req.headers).then((result) => {
        if (result) {
            pos.getPos(req.headers.id).then((result) => {
                res.json(result);
            }).catch((error) => { console.log("Server " + error); });
        }
        else res.sendStatus(401);        
    }).catch((error) => { console.log("Server " + error); });
});


//upload image
app.post("/avatarSet", upload.single("avatar"), function (req, res) {
    auth.check(req.headers).then((result) => {
        if (result) {
            let filedata = req.file;
            if (!filedata) res.status(400).end('Failed to upload image');                
            else {
                avatar.linkUp(req.headers.id, process.cwd() + '/' + filedata.path);
                res.sendStatus(200);
                console.log(process.cwd() + '/' + filedata.path);
            }
        }
        else res.sendStatus(401);
    }).catch((error) => { console.log("Server " + error); });
});


//get avatar
app.post("/avatarGet", upload.single("avatar"), function (req, res) {
    auth.check(req.headers).then((result) => {
        if (result) {
            let filedata = req.file;
            if (!filedata) res.status(400).end('Failed to upload image');
            else {
                avatar.linkUp(req.headers.id, __dirname + '/' + filedata.path);
                res.sendStatus(200);
                console.log(__dirname + '/' + filedata.path);
            }
        }
        else res.sendStatus(401);
    }).catch((error) => { console.log("Server " + error); });
});

app.listen(8383);
console.log('Server created on port 8383');
fs.stat(__dirname + '/media', (err) => {
    if (!err) console.log('File exists');
    else if (err.code === 'ENOENT') {
        console.log('File not exists');
        fs.mkdir(__dirname + '/media', (err) => {
            if (err) console.log(err);
            console.log('File is created');
        });
    }
});