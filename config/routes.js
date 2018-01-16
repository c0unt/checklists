// Set up routes for the app

module.exports = function(app) {

  var index = require('../app/controllers/index');
  app.get('/', index.index);

  var auth = require('../app/controllers/auth');
  app.post('*login', auth.login);
  app.get('*login', auth.login);

  app.get('*getUserMenu', auth.checksession);
  app.get('*getUserMenu', auth.getUserMenu);

  app.get('/*', auth.checksession);
  app.post('/*', auth.checksession);
  
  app.get('/auth/test', auth.test);
  app.get('*logout', auth.logout);



  var home = require('../app/controllers/home');
  app.get('/home', home.index);


  var Users = require('../app/controllers/users/index');
  app.get('/users', Users.index);
  app.get('/users/addUser', Users.addUser);
  app.post('/users/addUser', Users.addUser);
  app.get('/users/getUser', Users.getUser);
  app.get('/users/getUserRights',Users.getUserRights);
  app.post('/users/setUserRight',Users.setUserRight);
  app.post('/users/setUserPass',Users.setUserPass);


  var Checklists = require('../app/controllers/checklists/index');
  app.get('/checklists', Checklists.index);
  app.get('/checklists/addChecklist', Checklists.addChecklist);
  app.post('/checklists/addChecklist', Checklists.addChecklist);
  app.get('/checklists/getChecklist', Checklists.getChecklist);
  app.get('/checklists/getChecklistsSelect', Checklists.getChecklistsSelect);
  app.get('/checklists/getChecklistChecks',Checklists.getChecklistChecks);
  app.post('/checklists/getChecklistChecks',Checklists.getChecklistChecks);
  app.post('/checklists/setOneCheck',Checklists.setOneCheck);




  var Reports = require('../app/controllers/reports/index');
  app.get('/reports', Reports.index);
  app.get('/reports/getFilter', Reports.getFilter);
  app.post('/reports/getView', Reports.getViewSingleDS);
  //app.post('/reports/getView',Reports.getView);
  app.get('/reports/report1', Reports.report1);
 



}
