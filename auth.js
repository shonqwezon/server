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
        var strValue = "INSERT INTO authentication(token, login, pass, email) " + "VALUES('" + token + "', '" + data.login + "', '" + data.pass + "', '" + data.email + "') " + "RETURNING id;";

        pool.query(strValue, (err, result) => {
            console.log('data is started');
            if (err) {
                console.log(err);
                pool.end();
                reject(err);
            }
            console.log(result.rows[0].id);
            var serial = { "id": `${result.rows[0].id}`, "token": `${token}` };
            pool.end();
            console.log('data is end');
            resolve(serial);
        });
    });
};


module.exports.check = function (info) {
    return new Promise(function (resolve, reject) {
        pool.query(`SELECT token FROM authentication WHERE id = ${info.id};`, (err, result) => {
            console.log('check started');
            if (err) {
                console.log(err)
                pool.end();
                reject(err);
            }
            if (result.rows[0].token == info.key) check = true;                
            else check = false;
            pool.end();
            console.log('check ended');
            resolve(check);
        });
    });
};

