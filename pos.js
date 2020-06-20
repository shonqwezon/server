var pg = require('pg');

var pool = new pg.Pool({
    user: 'qishon',
    host: '127.0.0.1',
    database: 'gpsdata',
    password: 'infiniti130191',
    port: '5432'
});

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