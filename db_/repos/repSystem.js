/**
 * Created by BOB on 27.01.2018.
 */
'use strict';

const sql = require('../sql').S;

module.exports = (rep, pgp) => {
    return {
        init: () => rep.any(sql.init)
    };
};