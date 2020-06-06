var md5 = require('md5');
var pg = require('pg');
var check = null;

var pool = new pg.Pool({
    user: 'qishon',
    host: '127.0.0.1',
    database: 'gpsdata',
    password: 'infiniti130191',
    port: '5432'
});

module.exports.reg = function (data) {
    var token = md5(data.email + data.login + data.pass);
    pool.query("INSERT INTO authentication(token, login, pass, email) VALUES('6fbhf1749124nfr', 'art', '123467123', 'home@bk.ru')", (err, result) => {
        if(err) console.log(err);
        pool.end();
    });
    return token;
};


module.exports.check = function (info) {
    pool.query(`SELECT token FROM authentication WHERE id = ${info.id};`, (err, result) => {
        if (err) console.log(err);
        if (result.rows[0].token == info.key) check = true;
        else check = false;
        pool.end();
    });
    return check;
};

