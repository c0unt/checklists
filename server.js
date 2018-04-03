// Main app file that links everything together and runs the app

const express = require('express');
const http = require('http');
const app = express();
const hbs = require('hbs');

// Configure config
const config = require('./config/');
const log = require('./log')(module);

const db_ = require('./db_').db;

app.set('port', config.get('server:port'));
app.set('views', __dirname + '/app/views');
app.set('view engine', 'hbs');

hbs.registerPartials(__dirname + '/app/views/partials');

hbs.registerHelper('cond', function (expression, options) {
    let fn = function () {
    }, result;
    try {
        fn = Function.apply(this, ['return ' + expression + ' ;']);
    } catch (e) {
        log.error(e);
    }
    try {
        result = fn.bind(this)();
    } catch (e) {
        log.error(e);
    }

    return result ? options.fn(this) : options.inverse(this);
});

const favicon = require('express-favicon');
app.use(favicon(__dirname + '/public/favicon.png'));

app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser('your secret here'));
app.use(express.session());
app.use(app.router);
app.use(require('less-middleware')('/public'));

//app.use(express.static('/public'));
app.use('/public', express.static('public'));

require('./config/routes')(app);

app.listen(config.get('server:port'), function () {
    log.info("Live at Port " + config.get('server:port'));
});