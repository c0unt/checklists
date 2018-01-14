/*
Description: Checlists core module
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
 * GET Checklists Index.
 */

exports.index = function(req, res) {
  //res.render('index', {title: 'AG'});
  const data = {
    cookie: req.cookies.session
  };


  pool.query('SELECT cl.id as checklist_id, cl.name as checklist_name, cl.version as checklist_version, cl.status as checklist_status FROM data_checklists cl where cl.state=0 order by cl.name', [], (err, r) => {
    if (err) {
      console.log('SQL error');
      return console.error('Error executing query', err.stack);
      // res.render('login');
      console.log('error geting data_checklists 1');
    } else {
      //  var menu = '<li class="active"><a href="#">Home</a></li>';
      //  for (var i = 0; i < result.rowCount; i++) {
      console.log(r.rows);
      //      console.log(result.rows[i].path);
      //      menu = menu + '<li><a href="' + result.rows[i].path + '">' + result.rows[i].name + '</a></li>';
      res.render('checklists/checklistslist', r.rows);
      // }

    }

  })

};


exports.addChecklist = function(req, res){
    //res.render('index', {title: 'AG'});
    const data = {
        cookie: req.cookies.session,
        id: req.body.id,
        name: req.body.name,
        version: req.body.version,
        status: req.body.status

    };
  console.log(req.method);

  console.log(req.body);
  console.log('===================');
  console.log(data);
    if (req.method == "GET"){
        console.log('Got GET');
        res.render('checklists/checklist');

    }
    else{
        console.log('Got ID');
        if (data.id===''){
           data.id=uuidv4();
        };


        pool.query('INSERT INTO data_checklists '+
            '(id, name, version, status, state)' +
            '        VALUES ($1,$2,$3,$4,$5) ' +
            '        ON CONFLICT (id) ' +
            '        DO UPDATE SET ' +
            '            name=$2, version=$3,status=$4, state=$5', [data.id, data.name,data.version, data.status, 0], (err, r) => {
            if (err) {
                console.log('SQL error');
                console.log([data.id, data.name,data.version, data.status, 0]);
                console.error('Error executing query', err.stack);
                console.log('error update data_checklists 1');
            }
            else {
                res.redirect('checklists/');


            }

        })

    }



};


exports.getChecklist = function(req, res){
    //res.render('index', {title: 'AG'});
    const data = {
        cookie: req.cookies.session,
        id: req.query.id
    };
    pool.query('SELECT cl.id as checklist_id, cl.name as checklist_name, cl.version as checklist_version, cl.status as checklist_status FROM data_checklists cl where cl.id=$1', [data.id], (err, r) => {
        if (err) {
            console.log('SQL error');
            return console.error('Error executing query', err.stack);
            console.log('error geting checklist 1');
        }
        else {
            console.log(r.rows[0]);
            res.render('checklists/checklist',r.rows[0]);

        }

    })

};


exports.getChecklistChecks = function(req, res){
    //res.render('index', {title: 'AG'});
    const data = {
        cookie: req.cookies.session,
        id: req.query.id,
        name: req.query.name,
        inrender: req.query.inrender ||false
    };
    let resp = {
      do_not_use_partial:data.inrender,
      inrender:data.inrender,
      checklist_id: data.id,
      checklist_name: data.name,
      checks:[]
    };
    pool.query('select dcc.id as dcc_id, dcc.check_order as dcc_check_order, dcc.name as dcc_name, dcc.content as dcc_content, dcc.comment as dcc_comment, dcc.pass as dcc_pass, dcc.pass_dts as dcc_pass_dts, u.name as user_name from data_checklist_content dcc left join ref_sys_users u on u.id=dcc.pass_user_id where dcc.checklist_id =$1 and dcc.state=0', [data.id], (err, r) => {
        if (err) {
            console.log('SQL error');
            console.error('Error executing query', err.stack);
            console.log('error geting getChecklistChecks 1');
        }
        else {
          console.log('getChecklistChecks');
            console.log(r.rows);
            resp.checks = r.rows
            console.log(resp);

            res.render('checklists/checklistchecks',resp);

        }

    })

};


exports.setOneCheck = function(req, res) {
    const data = {
        cookie: req.cookies.session,
        dcc_id: req.body.dcc_id,
        dcc_pass: req.body.dcc_pass,
        inrender: req.body.inrender ||false
    };
    let resp = {
        do_not_use_partial:data.inrender,
        inrender:data.inrender,
        user_id: data.user_id,
        
      };
      console.log(data);
      pool.query('UPDATE "data_checklist_content" SET pass_dts=now(), "pass" = $3, pass_user_id=(select user_id from tmp_sys_sessions where id=$1) WHERE "id" = $2 returning id,checklist_id, pass, pass_dts, pass_user_id', [data.cookie, data.dcc_id, data.dcc_pass], (err, r) => {
          if (err) {
              console.log('SQL error');
              console.error('Error executing query', err.stack);
              console.log('error geting setOneCheck 1');
          }
          else {
            console.log('setOneCheck');
              console.log(r.rows);
              resp.id=r.rows[0].id;
              resp.user_id=r.rows[0].pass_user_id;
              resp.pass=r.rows[0].pass;
              resp.pass_dts=r.rows[0].pass_dts;
              resp.do_not_use_partial=data.inrender;
              resp.inrender=data.inrender;

              console.log(resp);
              res.type('application/json');
              res.send(resp);
              //res.render('checklists/onecheck',resp);
  
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
