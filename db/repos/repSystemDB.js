/**
 * Created by BOB on 27.01.2018.
 */

'use strict';

const sql = require('../sql').system;

module.exports = (rep, pgp) => {
    return {
        // table name for internal operation (not in db);
        internalTabName: 'system SQL requests',
        init: () => rep.any(sql.init)
    };
};