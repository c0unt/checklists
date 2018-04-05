// Main app file that links everything together and runs the app

const express = require('express');
const path = require('path');
const hbs = require('hbs');
const session = require('express-session');
const favicon = require('serve-favicon');

const BodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const log = require('./log')(module);
const db = require('./db').db;
const config = require('./config');

log.info('Try to db init... ');

db.systemDB.init()
    .then(() => {

        log.info(' db init done ');

        let secretKey = config.get('server:secretKey');
        let startPort = config.get('server:port');

        log.info('Start: init express ...');
        const app = express();


        log.info('Set hbs view engine...');
        hbs.registerPartials(path.join(__dirname, 'app', 'views', 'partials'));

        hbs.registerHelper('cond', (expression, options) => {
            let fn = () => {
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

        app.set('views', path.join(__dirname, 'app', 'views'));
        app.set('view engine', 'hbs');

        log.info('Configure views path...');
        app.use('/public', express.static(__dirname +'/public'));
        app.use('/ico/favicon.png', express.static(path.join(__dirname, 'public', 'img', 'favicon.png')));
        app.use(cookieParser(secretKey));
        app.use(BodyParser.json({limit: '50mb'}));
        app.use(BodyParser.urlencoded({limit: '50mb', extended: false}));


        //app.use('/ico', favicon());

        require('./routes/index')(app);

        log.info('try to start app ...');
        return app.listen(startPort, function () {
            log.info("Live at Port " + startPort);
        });

    }).catch((error) => {
    return log.error('Error before start application :  ' + error);
});



