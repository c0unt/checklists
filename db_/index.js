'use strict';

const promise = require('bluebird');
const config = require('../config');

// грузим все "repo" по отдельности, потому что событие 'extend' вызывается многократно
let repos = {
    repDServ: require('./repos/repSystem') 
};

// pg-promise initialization options:
let options = {

    // Use a 'bluebird' promise library, instead of the default ES6 Promise:
    promiseLib: promise,

    // Extending the database protocol with our custom repositories:
    extend: obj => {
        obj.DServ = repos.repDServ(obj, pgp);
        obj.PAServ = repos.repPAServ(obj, pgp);
        obj.User = repos.repUser(obj, pgp);
        obj.Customer = repos.repCustomer(obj, pgp);
        obj.DTModule = repos.repDTModule(obj, pgp);
    }
};

// Database connection parameters:
let DBconfig = {
    host: config.get('pg:host'),
    port: config.get('pg:port'),
    database: config.get('pg:database'),
    user: config.get('pg:user'),
    password: config.get('pg:password')
};

// Load and initialize pg-promise:
let pgp = require('pg-promise')(options);

// Create the database instance:
let db = pgp(DBconfig);

/*
 todo - Load and initialize all the diagnostics:
 var diag = require('./diagnostics');
 diag.init(options);
 */

//change the default pool size:
pgp.pg.defaults.poolSize = config.get('pg:pool');

module.exports = {
    // description for all tables
    repos,

    // Library instance is often necessary to access all the useful
    // types and namespaces available within the library's root:
    pgp,

    // Database instance. Only one instance per database is needed
    // within any application.
    db
};