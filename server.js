
// Main app file that links everything together and runs the app

var express = require('express'),

      http = require('http');


var app = express();



// Configure config
var fs = require('fs');
var cnfg = fs.readFileSync('./config/config.json');
var config = JSON.parse(cnfg);
//var config = require('./config/config'); //old


    app.set('port', config.port);
    app.set('views', __dirname + '/app/views');
    app.set('view engine', 'hbs');
    var hbs = require('hbs');
    hbs.registerPartials(__dirname + '/app/views/partials');
    hbs.registerHelper('cond', function (expression, options) {
    var fn = function() {}, result;
    try {
        fn = Function.apply(this, ['return ' + expression + ' ;']);
    } catch(e) {}
    try {
        result = fn.bind(this)();
    } catch(e) {}

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
    app.use('/public', express.static('public'))

require('./config/routes')(app);

app.listen(config.port,function(){
    console.log("Live at Port "+config.port);
});
