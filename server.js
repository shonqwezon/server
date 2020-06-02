'use strict';
var express = require('express')
var app = express()

var bodyParser = require('body-parser')
var jsonParser = bodyParser.json()
var data = null


app.post('/location.send', jsonParser, function (req, res) {
    console.log(req.body)
    data = req.body
    return res.sendStatus(200)
})

app.get('/location.get', function (req, res) {
    res.send(data)
})

app.listen(8383)
console.log('Server is running on port 8383')