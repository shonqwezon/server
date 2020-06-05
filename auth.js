var md5 = require('md5');
var { Client } = require('pg');

var client = new Client({
    user: 'qishon',
    host: 'localhost',
    database: 'gpsdata',
    password: 'infiniti130191',
    port: 5432
});

var query = `INSERT INTO Authtentication (token, login, pass, email)VALUES ('04941350aefd81ffd355021e9411af50', 'john', 'doe', 'home@lol')`;

module.exports.reg = function (data) {
    var token = md5(data.email + data.login + data.pass);
    console.log(`Connection to gpsdata...`);
    client.query(query, (err, res) => {
        if (err) {
            console.error(err);
            return;
        }
        console.log('Data insert successful');
        client.end();
    });
    return token;
};

/*
module.exports.check = function (token) {
    if ( == token) return true;
    else return false;
};
*/
