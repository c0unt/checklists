/**
 * Created by BOB on 27.01.2018.
 */
'use strict';

const QueryFile = require('pg-promise').QueryFile;
const path = require('path');
const config = require('../../config');

// Helper for linking to external query files;
function sql(file) {

    let fullPath = path.join(__dirname, file); // generating full path;

    let options = {

        // minifying the SQL is always advised;
        // see also option 'compress' in the API;
        minify: true,

        // Showing how to use static pre-formatting parameters -
        // we have variable 'schema' in each SQL;
        params: {
            schema: config.get('pg:schema')  // replace ${schema~} with config(postgreSQL:schema)
        }
    };
    return new QueryFile(fullPath, options);
}

module.exports = {
    system: {
        init: sql('system/init.sql')
    }
};