/*
 Description: Action Log module - logs to database
 //TODO Aware about security!
 */

const db = require('../../db_').db;
const log = require('../../log')(module);

exports.logAction = function (token, action, data) {

    db.any('INSERT INTO "data_log" ( "token","action", "data") VALUES ( $1, $2, $3)', [token, action, data]
    ).then((data) => {
        return log.info('logAction Ok');
    }).catch((err) => {
        log.info('SQL error');
        return log.error(err);
    });

};
