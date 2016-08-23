var pg = require('pg');
var config = require('./config');

const Pool = db.Pool;
const pool = new Pool({
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

var db = pg;

/*
db.connect(CONN_STRING, function(err, connection, done) {
    if(err) throw err;
    
    done();
});

module.exports.sql = function(sqlQuery, params, func) {
    db.connect(CONN_STRING, function(err, connection, done) {
        if(err) {
            console.log('err:', err);
            throw err;
        }
        
        connection.query(sqlQuery, params, function(err, rows) {
            if(err) {
                err.sql = sqlQuery;
                console.log('err:', err);
                throw err;
            }
            
            if(func) {
                func(rows);
            }
        });
    
        done();
    });
};
*/

module.exports = db;
module.exports.run = (sql, cbDone) => {
    pool.query(sql, (err, rows) => {
        if (err) {
            console.log('err:', sql, err);
            throw err;
        }
        
        if(cbDone) cbDone();
    });
};