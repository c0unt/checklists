// Config file

var config = {};

config.applicationID = '6eb63ba3-5c35-494d-af56-aa1526aa0964';

config.port = process.env.PORT || 3003;

config.pgport = 54010;
config.pghost = '127.0.0.1';
config.pguser = 'postgres';
config.pgpass = 'postgres';
config.pgdb = 'checklists';

config.dateformat = '\'DD.MM.YYYY \''



module.exports = config;
