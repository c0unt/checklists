/*
Description: Action Log module - logs to database
//TODO Aware about security!
*/
const {Pool} = require('pg');
var config = require('../../config/config');

const pool = new Pool({
    user: config.pguser,
    host: config.pghost,
    database: config.pgdb,
    password: config.pgpass,
    port: config.pgport
})


exports.logAction = function (token, action, data) {

      pool.query('INSERT INTO "data_log" ( "token","action", "data") VALUES ( $1, $2, $3)', [token, action, data], (err, result) => {
        if (err) {
            console.log('SQL error');
            return console.error('Error executing query', err.stack);

        }
        else {
                console.log('logAction Ok');
             }
        });

};
