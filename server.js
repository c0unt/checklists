// Main app file that links everything together and runs the app

const express = require('express');
const app = express();
const path = require('path');
const hbs = require('hbs');
const session = require('express-session');

const BodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const log = require('./log')(module);
const db_ = require('./db_').db;
const config = require('./config_');

log.info('Try to db init... ');

db_.systemDB.init()
    .then(() => {
    
        log.info(' db init done ');
       
        let secretKey = config.get('server:secretKey');
        let startPort = config.get('server:port');

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

        log.info('Start: init express ...');

        log.info('Set the view engine...');
        app.set('view engine', 'hbs');

        log.info('Configure views path...');

        app.set('views', path.join(__dirname, '/app/views'));


        app.use(cookieParser(secretKey));
        app.use(BodyParser.json({limit: '50mb'}));
        app.use(BodyParser.urlencoded({limit: '50mb', extended: true}));
        app.use(express.static('public'));

        require('./routes/index')(app);

        log.info('try to start app ...');
        return app.listen(startPort, function () {
            log.info("Live at Port " + startPort);
        });

    }).catch((error) => {
        return log.error('init db error:  ' + error);
});



