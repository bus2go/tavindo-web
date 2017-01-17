// TODO - use github.com/vitaly-t/pg-promise to allow async/await on db queries

var pg = require('pg');
var config = require('./config');

const pool = new pg.Pool({
    user: config.user,
    password: config.password,
    host: config.host,
    database: config.database,
    max: 10, // max number of clients in pool
    idleTimeoutMillis: 1000, // close & remove clients which have been idle > 1 second
})
.on('error', function(err, client) {
    console.log('err:', err);
    throw err;
});

module.exports = pg;
module.exports.run = (sql, params, cbDone) => {
    pool.query(sql, params, (err, rows) => {
        if (err) {
            console.log('err:', sql, err);
            throw err;
        }
        
        if(cbDone) cbDone(rows);
    });
};

module.exports.runWait = function(sql, params) {
    return new Promise((resolve, reject) => {
        pool.query(sql, params, function(err, rows) {
            if (err) {
                reject(err);
            } else {
                resolve(rows);
            }
        });
    });
};