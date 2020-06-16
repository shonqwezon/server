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
    console.log("func started");
    return new Promise(function (resolve, reject) {
        var token = md5(data.email + data.login + data.pass);
        pool.query("INSERT INTO authentication(token, login, pass, email) VALUES('ooooooo749124nfr', 'ipo', '7777777', 'pop@bk.ru') RETURNING id;", (err, result) => {
            console.log('data is started');
            if (err) {
                console.log(err);
                reject(err);
            }
            console.log(result.rows[0].id);
            var serial = { "id": `${result.rows[0].id}`, "token": `${token}` };
            pool.end();
            console.log('data is end');
            resolve(serial);
        });
    });
    console.log("func ended");
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

