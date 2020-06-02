'use strict';
var express = require('express')
var app = express()

app.get('/', function (req, res) {
    res.send('It is work')
})

app.get('/news', function (req, res) {
    res.send('This is news')
})

app.get('/news/:id', function (req, res) {
    res.send('ID is - ' + req.params.id)
})

app.listen(8383)