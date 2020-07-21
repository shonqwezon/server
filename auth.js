var pos = require('./pos');
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
    return new Promise(function (resolve, reject) {

        var token = md5(data.email + data.login + data.pass);
        var strValue = "INSERT INTO authentication(token, login, pass, email) " + "VALUES('" + token + "', '" + data.login + "', '" + data.pass + "', '" + data.email + "');";

        pool.query(strValue, (err) => {
            if (err) {
                if (err.code == '23505') {
                    pool.query("select nextval('authentication_id_seq');", (err, result) => {
                        if (err) console.log(err);
                        pool.query(`ALTER SEQUENCE authentication_id_seq restart WITH ${result.rows[0].nextval - 1};`, (err) => { if (err) console.log(err); });
                    });

                    resolve({ "status": 400, "error": err.constraint });
                }
                else {
                    console.log("Pool " + err);
                    pool.end();
                    reject(err);
                }
            }
            resolve({ "status": 200 });
        });
    });
};


module.exports.check = function (info) {
    return new Promise(function (resolve, reject) {
        pool.query(`SELECT token FROM authentication WHERE id = ${info.id};`, (err, result) => {
            if (err) {
                console.log("Pool " + err)
                pool.end();
                reject(err);
            }
            if (result.rows[0].token == info.key) check = true;
            else check = false;
            resolve(check);
        });
    });
};



module.exports.sockSet = function (userId, socketId) {
    pool.query("UPDATE authentication SET socket = '" + socketId + `' WHERE id = ${userId};`, (err) => {
        if (err) {
            console.log("Pool " + err);
            pool.end();
        }
    });
};



module.exports.sockGet = function (userId) {
    return new Promise(function (resolve, reject) {
        pool.query(`SELECT socket FROM authentication WHERE login = '${userId}';`, (err, result) => {
            if (err) {
                console.log("Pool " + err);
                pool.end();
                reject(err);
            }
            resolve(result.rows[0]); 
        });
    });
};



module.exports.login = function (data) {
    return new Promise(function (resolve, reject) {
        pool.query("SELECT pass FROM authentication WHERE login = " + "'" + data.login + "';", (err, result) => {
            if (err) {
                console.log("Pool " + err);
                pool.end();
                reject(err);
            }
            var pass = { pass: `${data.pass}` };
            if (JSON.stringify(result.rows[0]) == JSON.stringify(pass)) {
                pool.query("SELECT * FROM authentication WHERE login = " + "'" + data.login + "';", (err, result) => {
                    if (err) {
                        console.log("Pool " + err);
                        pool.end();
                        resolve(err);
                    }
                    else {
                        var serial = { "id": `${result.rows[0].id}`, "token": `${result.rows[0].token}` };
                        resolve(serial);
                    }
                });
            }
            else {
                check = false;
                resolve(check);
            }
        });
    });
};

