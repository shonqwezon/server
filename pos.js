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

module.exports.addUser = function (id) {
    pool.query(`ALTER TABLE locations ADD COLUMN id_${id} point`, (err, result) => {
        if (err) {
            console.log(err);
            pool.end();
        }
    });
    pool.query(`ALTER TABLE locations ADD COLUMN date_${id} timestamp`, (err, result) => {
        if (err) {
            console.log(err);
            pool.end();
        }
    });
};

module.exports.addPos = function (coord, id) {
    var strPos = `INSERT INTO locations(id_${id}, date_${id}) ` + "VALUES('" + coord + "', '" + date.toLocaleDateString('ukl', options) + "');";
    pool.query(strPos, (err, result) => {
        if (err) {
            console.log(err);
            pool.end();
        }
    });
};