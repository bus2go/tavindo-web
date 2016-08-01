var pg = require('pg');

const CONN_STRING = "postgres://tavindo_user:020591@localhost/tavindo";

var db = pg;

db.connect(CONN_STRING, function(err, connection, done) {
    if(err) throw err;
    
    done();
});

module.exports = db;
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