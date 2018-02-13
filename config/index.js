/**
 * Created by BOB on 27.01.2018.
 */
const nconf = require('nconf');
const path = require('path');

nconf.argv()
    .env()
    .file({ file: path.join( __dirname, 'config_.json') });

module.exports = nconf;