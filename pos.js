var pg = require('pg');

var pool = new pg.Pool({
    user: 'qishon',
    host: '127.0.0.1',
    database: 'gpsdata',
    password: 'infiniti130191',
    port: '5432'
});

var date = new Date();
var options = { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' };

module.exports.addPos = function (coord, id) {
    var strValue = `INSERT INTO locations(user_id, pos, datetime) ` + "VALUES('" + id + "', '" + coord + "', '" + date.toLocaleDateString('ukl', options) + "');";
    pool.query(strValue, (err, result) => {
        if (err) {
            console.log(err);
            pool.end();
        }
    });
};

module.exports.getPos = function (id) {
    return new Promise(function (resolve, reject) {
        var strValue = `SELECT * FROM locations WHERE user_id = ${id} ORDER BY id DESC LIMIT 1;`;
        pool.query(strValue, (err, result) => {
            if (err) {
                console.log(err)
                pool.end();
                reject(err);
            }
            var position = {
                lat: result.rows[0].pos.x,
                long: result.rows[0].pos.y,
                datetime: result.rows[0].datetime
            };
            resolve(position);
        });
    });
};