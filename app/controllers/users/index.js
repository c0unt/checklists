/*
Description: User management module
*/


const {
  Pool
} = require('pg');
const config = require('../../../config/config');

const uuidv4 = require('uuid/v4');

const pool = new Pool({
  user: config.pguser,
  host: config.pghost,
  database: config.pgdb,
  password: config.pgpass,
  port: config.pgport
})

/*
 * GET Users Index.
 */

exports.index = function(req, res) {
  //res.render('index', {title: 'AG'});
  const data = {
    cookie: req.cookies.session
  };


  pool.query('SELECT u.id as id, u.name as name, u.email as email,u.telegram as telegram, u.state as state FROM ref_sys_users u where u.state=0 order by u.name', [], (err, r) => {
    if (err) {
      console.log('SQL error');
      return console.error('Error executing query', err.stack);
      console.log('error geting userlist 1');
    } else {
      console.log(r.rows);
      res.render('users/userslist', r.rows);
    
    }

  })

};


exports.addUser = function(req, res){
    //res.render('index', {title: 'AG'});
    const data = {
        cookie: req.cookies.session,
        id: req.body.id,
        name: req.body.name,
        email: req.body.email,
        telegram: req.body.telegram,
        pass: req.body.pass

    };
  console.log(req.method);

  console.log(req.body);
  console.log('===================');
  console.log(data);
    if (req.method == "GET"){
        console.log('Got GET');
        res.render('users/user');

    }
    else{
        console.log('Got ID');
        if (data.id===''){
           data.id=uuidv4();

           pool.query('INSERT INTO ref_sys_users '+
           '(id, name, email, telegram, state, pass)' +
           '        VALUES ($1,$2,$3,$4,$5,$6) ' +
           '        ON CONFLICT (id) ' +
           '        DO UPDATE SET ' +
           '            name=$2, email=$3,telegram=$4, state=$5', [data.id, data.name,data.email, data.telegram, 0, data.pass], (err, r) => {
           if (err) {
               console.log('SQL error');
               console.log([data.id, data.name,data.version, data.status, 0]);
               console.error('Error executing query', err.stack);
               console.log('error update user 1');
           }
           else {
               res.redirect('users/');


               }

           })
        }
        else{
        pool.query('INSERT INTO ref_sys_users '+
            '(id, name, email, telegram, state)' +
            '        VALUES ($1,$2,$3,$4,$5) ' +
            '        ON CONFLICT (id) ' +
            '        DO UPDATE SET ' +
            '            name=$2, email=$3,telegram=$4, state=$5', [data.id, data.name,data.email, data.telegram, 0], (err, r) => {
            if (err) {
                console.log('SQL error');
                console.log([data.id, data.name,data.version, data.status, 0]);
                console.error('Error executing query', err.stack);
                console.log('error update user 1');
            }
            else {
                res.redirect('users/');


                }

            })
        }

    }



};


exports.getUser = function(req, res){
    //res.render('index', {title: 'AG'});
    const data = {
        cookie: req.cookies.session,
        id: req.query.id
    };
    pool.query('SELECT u.id as id, u.name as name, u.email as email,u.telegram as telegram, u.state as state FROM ref_sys_users u where u.id=$1', [data.id], (err, r) => {
        if (err) {
            console.log('SQL error');
            return console.error('Error executing query', err.stack);
            console.log('error geting user 1');
        }
        else {
            console.log(r.rows[0]);
            res.render('users/user',r.rows[0]);

        }

    })

};


exports.getUserRights = function(req, res){
    //res.render('index', {title: 'AG'});
    const data = {
        cookie: req.cookies.session,
        id: req.query.id,
        inrender: req.query.inrender ||false
    };
    let resp = {
      do_not_use_partial:data.inrender,
      inrender:data.inrender,
      user_id: data.id,
      rights:[]
    };
    
    pool.query('    select ur.id as id, r.id as right_id, r.name as right_name,  coalesce(ur.state, 1) as state from ref_sys_rights r left join  ref_sys_users_x_rights ur on r.id=ur.right_id and ur.user_id=$1 order by r.name', [data.id], (err, r) => {
        if (err) {
            console.log('SQL error');
            console.error('Error executing query', err.stack);
            console.log('error geting getChecklistChecks 1');
        }
        else {
          console.log('getUserRights');
            console.log(r.rows);
            resp.rights = r.rows
            console.log(resp);
            res.render('users/userrights',resp);

        }

    })

};


exports.setUserRight = function(req, res) {
    const data = {
        cookie: req.cookies.session,
        user_id: req.body.user,
        right_id: req.body.right,
        action:  req.body.action,
        inrender: req.body.inrender ||false
    };
    let resp = {
        do_not_use_partial:data.inrender,
        inrender:data.inrender,
        user_id: data.user_id,
        
      };
      console.log(data);
      pool.query('insert into ref_sys_users_x_rights (user_id, right_id,state) values( $1, $2, $3 ) On Conflict on CONSTRAINT user_right_constraint DO UPDATE SET state=$3 returning id, user_id, right_id, state', [data.user_id, data.right_id,data.action], (err, r) => {
          if (err) {
              console.log('SQL error');
              console.error('Error executing query', err.stack);
              console.log('error geting setUserRight 1');
          }
          else {
            console.log('setUserRight');
              console.log(r.rows);
              resp.id=r.rows[0].id;
              resp.user_id=r.rows[0].user_id;
              resp.right_id=r.rows[0].right_id;
              resp.state=r.rows[0].state;
              resp.do_not_use_partial=data.inrender;
              resp.inrender=data.inrender;

              console.log(resp);
              res.render('users/useroneright',resp);
  
          }
  
      })

};


exports.getChecklistsSelect = function(req, res) {
  //res.render('index', {title: 'AG'});
  const data = {
    cookie: req.cookies.session,
    id_selected: req.query.id_selected
  };

//TODO - getChecklistsSelect feature is not implemented

  pool.query('', [data.cookie], (err, result) => {
    if (err) {
        console.log('SQL error');
        console.error('Error executing query', err.stack);
        console.log('error geting getChecklistsSelect 1');
    } else  {
        let select = '<option value="">No checklist</option>';
        for (let i = 0; i < result.rowCount; i++) {
          if (data.id_selected == result.rows[i].id){
             select = select + '<option value="'+result.rows[i].id+'" selected>' + result.rows[i].name +' ('+result.rows[i].code+')'+'</option>';

          }
          else{
             select = select + '<option value="'+result.rows[i].id+'">' + result.rows[i].name +' ('+result.rows[i].code+')'+'</option>';

          }

        }
        res.send(select);
    }

  })

};

exports.test = function(req, res){
    res.send('Ok!');
};
