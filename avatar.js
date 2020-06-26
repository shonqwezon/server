var pg = require('pg');


var pool = new pg.Pool({
    user: 'qishon',
    host: '127.0.0.1',
    database: 'gpsdata',
    password: 'infiniti130191',
    port: '5432'
});


module.exports.linkUp = function (id, link) {
    pool.query("UPDATE authentication SET avatar = '" + link + `' WHERE id = ${id};`, (err) => {
        if (err) {
            console.log("Pool " + err)
            pool.end();
        }
    });
};