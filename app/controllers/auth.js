  /*
  Description: Auth module. Allows to login/logout.

  */

  const {
    Pool
  } = require('pg');
  const config = require('../../config/config');

  const pool = new Pool({
    user: config.pguser,
    host: config.pghost,
    database: config.pgdb,
    password: config.pgpass,
    port: config.pgport
  })
  const validate = require('uuid-validate');

  exports.logout = function(req, res) {
    /*
    Perform log out
    */


    //  '00000000-0000-0000-0000-000000000000'
    res.cookie('session', '00000000-0000-0000-0000-000000000000');
    // and more.. we shall kill session in database...

    res.redirect('../login');

    console.log('Perform log out');
  };


  exports.test = function(req, res) {
    console.log(req);
    res.send('test');
  };


  exports.checksession = function(req, res, next) {
    /*
    Perform session check as middleware: if session is not ok - quits app to login dialog
    */

    //  console.log(req);
    const data = {
      cookie: req.cookies.session,
      inrender: req.query.inrender ||false
    };

    if (validate(data.cookie) !== true) {
      data.cookie = '00000000-0000-0000-0000-000000000000';
    };

    /*


    pool.query('delete  from tmp_sys_sessions where dts < now()', [], (err, result) => {
      console.log(err);
      console.log('obsolet sessions cleared: '+result.rowCount)
    });
*/

    pool.query('SELECT id,dts FROM tmp_sys_sessions WHERE id=$1 and dts>now()', [data.cookie], (err, result) => {
      if (err) {
        console.log('SQL error');
        //return 
        console.error('Error executing query', err.stack);
        //res.render('login');
        res.redirect('../login');
        console.log('login rendered 1');
      } else {
        if (result.rowCount === 1) {
          console.log('checksession session Ok');
          next();
        } else {
          console.log('checksession session FAIL!!!');
          //res.render('login');
          if (data.inrender){
          //res.render('',data);
          res.status(403).send('');
          } else {
          res.redirect('../login');
          }
          console.log('login rendered 2');

        }

      };
    })

  };


  exports.login = function(req, res) {
    /*
    Perform log in
     */

    const data = {
      name: req.body.userName,
      pass: req.body.userPassword
    };
    console.log(data);

    if (req.method === 'GET') {
      res.render('login');
      console.log('login rendered 1');

    } else {

      pool.query('SELECT id FROM ref_sys_users WHERE state=0 and (email=$1 or name=$1)  and pass=$2', [data.name, data.pass], (err, result) => {
        if (err) {
          console.log('SQL error');
          return console.error('Error executing query', err.stack);
          res.render('login');
          console.log('login rendered 2');
        } else {
          console.log(result.rowCount);
          if (result.rowCount === 1) {
            pool.query('Insert into tmp_sys_sessions (user_id) values ($1) returning id as session, dts as untill', [result.rows[0].id], (err, result) => {
              if (err) {
                console.log('SQL session error');
                return console.error('Error executing query', err.stack);
                //error creating session
                res.render('login');
                console.log('login rendered 3');
              } else {
                res.cookie('session', result.rows[0].session);
                console.log(req.originalUrl); // '/admin/new'
                console.log(req.baseUrl); // '/admin'
                console.log(req.path); // '/new'
                //   res.render('dashboard'); //по идее надо сделать редирект, и он уже будет с кукой
                res.redirect('../../home')
              }
            });
          } else {
            //user not found
            res.render('login');
            console.log('login rendered 4');
          }
        };
      });
    }
  };

  exports.getUserMenu = function(req, res) {
    /*
    Perform session check and return menu items
    */
    const data = {
      cookie: req.cookies.session
    };

    let resp = {
      do_not_use_partial:true,
      items:[]
    };

    if (validate(data.cookie) !== true) {
      data.cookie = '00000000-0000-0000-0000-000000000000';
    };

    pool.query('delete  from tmp_sys_sessions where dts < now()', [], (err, result) => {
   
    });

    pool.query(' SELECT m.name as name, m.path as path FROM ref_sys_menuitems m ' +
      ' inner join ref_sys_users_x_rights r  on r.right_id=m.right_id and r.state=0 ' +
      ' inner join tmp_sys_sessions ss on r.user_id=ss.user_id where ss.id=$1 and m.application_id=$2', [data.cookie, config.applicationID], (err, result) => {
        if (err) {
          console.log('SQL error');
          console.error('Error executing query', err.stack);
          res.render('login');
          console.log('login rendered 1');
          
        } else {
          resp.items = result.rows
          console.log(resp);
          res.render('menu_data',resp);

        }

      })

  };
