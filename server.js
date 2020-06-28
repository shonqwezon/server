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
var profile = require('./profile');

var upload = multer({ dest: "media" });
app.use(express.static(__dirname));
app.use(morgan('dev'));

var fileExt = ".png";

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


app.post('/getInfo', (req, res) => {
    auth.check(req.headers).then((result) => {
        if (result) {
            profile.getInfo(req.headers.id).then((result) => { res.json(result); })
                .catch((error) => { console.log("getInfo " + error); });
        }
        else res.sendStatus(401);
    }).catch((error) => { console.log("Server " + error); });
});


//upload image
app.post("/avatar", upload.single("avatar"), function (req, res) {
    auth.check(req.headers).then((result) => {
        if (result) {
            let filedata = req.file;
            if (!filedata) res.status(400).end('Failed to upload image');
            else {
                fs.renameSync(filedata.path, filedata.path + fileExt, (err) => { if (err) console.log(err) });
                profile.avatarLinkUp(req.headers.id, filedata.path + fileExt);
                res.sendStatus(200);
            }
        }
        else res.sendStatus(401);
    }).catch((error) => { console.log("Server " + error); });
});


app.listen(8383);
console.log('Server created on port 8383');
