'use strict';
var fs = require('fs');
var multer = require('multer');
const morgan = require('morgan');

var express = require('express');
var app = express();
var io = require('socket.io')(app.listen(8383));

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

/*
//check
app.post('/check', (req, res) => {
    auth.check(req.headers).then((result) => {
        if (result) {
            res.sendStatus(200);
        }
        else res.sendStatus(401);
    }).catch((error) => { console.log("Server " + error); });
});
*/

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
        if (result == true) {
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
        if (result == true) {
            pos.getPos(req.headers.id).then((result) => {
                res.json(result);
            }).catch((error) => { console.log("Server " + error); });
        }
        else res.sendStatus(401);
    }).catch((error) => { console.log("Server " + error); });
});

//get info about user
app.post('/getInfo', (req, res) => {
    auth.check(req.headers).then((result) => {
        if (result == true) {
            profile.getInfo(req.headers.id).then((result) => { res.status(200).json(result); })
                .catch((error) => { console.log("getInfo " + error); });
        }
        else res.sendStatus(401);
    }).catch((error) => { console.log("Server " + error); });
});


app.post('/getPermiss', (req, res) => {
    profile.getPermiss(req.headers).then((result) => {
        res.json(result);
    }).catch((error) => { console.log("Server " + error); });
});


//upload image
app.post("/avatar", upload.single("avatar"), function (req, res) {
    auth.check(req.headers).then((result) => {
        if (result == true) {
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


io.on('connection', (socket) => {
    auth.sockSet(socket.handshake.query.IDofUser, socket.id);

    console.log(`New user ${socket.id} has connected`);

    socket.on('disconnect', () => {
        console.log(`User ${socket.id} has disconnected`);
    });
    socket.on("rootID", (data, callback) => {
        console.log("Messgae to " + data.IDsub);
        auth.sockGet(data.IDsub).then((result) => {
            if (result != null) {
                io.to(result.socket).emit('message', data.IDmain);
                callback('OK');
            } 
            else callback('error');
        }).catch((error) => { console.log("Server " + error) });        
    });
    socket.on('responseTo', (data) => {
        console.log(`User ${data.IDmain} is tracking ${data.IDsub}`);
        auth.permissToTrack(data);
    });
});


console.log('Server created on port 8383');
