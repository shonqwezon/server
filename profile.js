var pg = require('pg');
var fs = require('fs');


var pool = new pg.Pool({
    user: 'qishon',
    host: '127.0.0.1',
    database: 'gpsdata',
    password: 'infiniti130191',
    port: '5432'
});


module.exports.avatarLinkUp = function (id, link) {
    pool.query(`SELECT avatar FROM authentication WHERE id = ${id};`, (err, result) => {
        if (err) {
            console.log("Pool " + err);
            pool.end();
        }
        if (result.rows[0].avatar != null) {
            console.log('Not null link');
            fs.unlink(result.rows[0].avatar, (err) => { if (err) console.log(err) });
        }
        pool.query("UPDATE authentication SET avatar = '" + link + `' WHERE id = ${id};`, (err) => {
            if (err) {
                console.log("Pool " + err);
                pool.end();
            }
        });
    });
};

module.exports.getInfo = function (id) {
    return new Promise(function (resolve, reject) {

        var promise = new Promise(function (res, rej) {
            pool.query(`SELECT * FROM authentication WHERE id = ${id};`, (err, result) => {
                if (err) {
                    console.log("Pool " + err)
                    pool.end();
                    reject(err);
                }
                res(result.rows[0]);
            });
        });

        var promise1 = function (login) {
            return new Promise(function (res1, rej1) {
                //users_sub
                pool.query(`SELECT user_sub FROM permisstrack WHERE user_main = '${login}';`, (err, result) => {
                    if (err) {
                        console.log("Pool " + err)
                        pool.end();
                        reject(err);
                    }
                    res1(result.rows);
                });
            });
        };

        var promise2 = function (login) {
            return new Promise(function (res2, rej2) {
                //users_main
                pool.query(`SELECT user_main FROM permisstrack WHERE user_sub = '${login}';`, (err, result) => {
                    if (err) {
                        console.log("Pool " + err)
                        pool.end();
                        reject(err);
                    }
                    res2(result.rows);
                });
            });
        }

        promise.then((res) => {
            promise1.then((res1) => {
                promise2.then((res2) => {
                    var infoUser = {
                        login: res.login,
                        avatar: res.avatar,
                        users_sub: res1,
                        users_main: res2
                    };
                    resolve(infoUser);
                });
            });
        });
    });
}



