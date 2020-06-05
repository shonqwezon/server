var md5 = require('md5');
var pg = require('pg');
var conString = 'postgres://qishon:infiniti130191@ localhost/gpsdata'

module.exports.reg = function (data) {
    var token = md5(data.email + data.login + data.pass);
    console.log(`Connection to gpsdata...`);
    pg.connect(conString, function (err, client, done) {
        if (err) {
            console.error(err);
        }
        client.query('INSERT INTO Authentication (token, login, pass, email) VALUES ($1, $2, $3, $4);', [token, data.login, data.pass, data.email], function (err, result) {
            done();
            if (err) {
                console.error(err);
            }
        });
    });
    return token;
};

/*
module.exports.check = function (token) {
    if ( == token) return true;
    else return false;
};
*/
