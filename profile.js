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
        pool.query(`SELECT * FROM authentication WHERE id = ${info.id};`, (err, result) => {
            if (err) {
                console.log("Pool " + err)
                pool.end();
                reject(err);
            }
            var infoUser = {
                login: result.rows[0].login,
                avatar: result.rows[0].avatar,
            };
            resolve(infoUser);
        });
    });
}

