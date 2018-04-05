// Set up routes for the app
const share = require('../share');
const log = require('../log')(module);

module.exports = (app) => {

    let index = require('../app/controllers/index');
    app.get('/', index.index);



    let auth = require('../app/controllers/auth');
    app.post('*login', auth.login);
    app.get('*login', auth.login);


    app.get('*getUserMenu', auth.checksession);

    app.get('*getUserMenu', auth.getUserMenu);

    app.get('/*', auth.checksession);

    app.post('/*', auth.checksession);

    app.get('/auth/test', auth.test);
    app.get('*logout', auth.logout);


    let home = require('../app/controllers/home');
    app.get('/home', home.index);


    let Users = require('../app/controllers/users/index');
    app.get('/users', Users.index);
    app.get('/users/addUser', Users.addUser);
    app.post('/users/addUser', Users.addUser);
    app.get('/users/getUser', Users.getUser);
    app.get('/users/getUserRights', Users.getUserRights);
    app.post('/users/setUserRight', Users.setUserRight);
    app.post('/users/setUserPass', Users.setUserPass);
    app.use((req, res, next) => {
        console.log(typeof req.next);
        next();
    });


    let Checklists = require('../app/controllers/checklists/index');
    app.get('/checklists', Checklists.index);
    app.get('/checklists/addChecklist', Checklists.addChecklist);
    app.post('/checklists/addChecklist', Checklists.addChecklist);
    app.get('/checklists/getChecklist', Checklists.getChecklist);
    app.get('/checklists/getChecklistsSelect', Checklists.getChecklistsSelect);
    app.get('/checklists/getChecklistChecks', Checklists.getChecklistChecks);
    app.post('/checklists/getChecklistChecks', Checklists.getChecklistChecks);
    app.post('/checklists/setOneCheck', Checklists.setOneCheck);
    app.post('/checklists/addCheck', Checklists.addCheck);
    app.post('/checklists/delCheck', Checklists.delCheck);
    app.use((req, res, next) => {
        console.log(typeof req.next);
        next();
    });



    let Reports = require('../app/controllers/reports/index');
    app.get('/reports', Reports.index);
    app.get('/reports/getFilter', Reports.getFilter);
    app.post('/reports/getView', Reports.getViewSingleDS);
    //app.post('/reports/getView',Reports.getView);
    app.get('/reports/report1', Reports.report1);
    app.use((req, res, next) => {
        console.log(typeof req.next);
        next();
    });


    // default 404  error  handler
    app.use((req, res, next) => {
        log.error('404 for request ' + req.originalUrl);
        let err = new Error('Not Found');
        err.status = 404;
        next(err);
    });
    app.use((req, res, next) => {
        console.log(typeof req.next);
        next();
    });


    // default error handler
    app.use((err, req, res, next) => {
        log.error('UNKNOWN ERROR IN ' + JSON.stringify(req.body));
        // set locals, only providing error in development
        res.locals.message = err.message;
        res.locals.error = req.app.get('env') === 'development' ? err : {};

        // render the error page
        res.status(err.status || 500);
        res.render('error');
    });
};
