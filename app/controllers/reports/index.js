/*
Description: Repors module
*/


const {
  Pool
} = require('pg');

var async = require("async");
//var pg = require('pg');
const named = require('node-postgres-named');

var config = require('../../../config/config');

const uuidv4 = require('uuid/v4');

const pool = new Pool({
  user: config.pguser,
  host: config.pghost,
  database: config.pgdb,
  password: config.pgpass,
  port: config.pgport
})

named.patch(pool);

/*
 * GET Report Index.
 */

exports.index = function(req, res) {
  //res.render('index', {title: 'AG'});
  const data = {
    cookie: req.cookies.session

  };

  pool.query('select r.id as r_id, r.name as r_name, v.id as v_id, v.name as v_name from ref_rpt_reports r inner join ref_rpt_views v on v.report_id=r.id inner join ref_sys_users_x_rights ur on ur.right_id=v.right_id inner join tmp_sys_sessions ss on ss.user_id=ur.user_id where  ss.id=$1 and r.state=0 and v.state=0 order by r_name', [data.cookie], (err, r) => {
    if (err) {
      console.log('SQL error');
      return console.error('Error executing query', err.stack);
      // res.render('login');
      console.log('error geting reports');
    } else {

      //  var menu = '<li class="active"><a href="#">Home</a></li>';
      //  for (var i = 0; i < result.rowCount; i++) {
      console.log(r.rows);
      //      console.log(result.rows[i].path);
      //      menu = menu + '<li><a href="' + result.rows[i].path + '">' + result.rows[i].name + '</a></li>';
      res.render('reports/reportslist', r.rows);
      // }

    }

  })

};

exports.getFilter = function(req, res) {
  //res.render('index', {title: 'AG'});
  const data = {
    cookie: req.cookies.session,
    v_id: req.query.v_id
  };
  var resp = {
    view_id: data.v_id,
    params: ""
  };

  pool.query('select dsp.sys_name as p_sys_name ,dsp.name as p_name, dsp.kind as p_kind, dsp.default as p_default, dsp.dataset_id as dataset_id, v.report_id as report_id, v.id as view_id, v.name as v_name from ref_rpt_dataset_params dsp inner join ref_rpt_report_datasets rds on rds.dataset_id=dsp.dataset_id inner join ref_rpt_views v on rds.report_id=v.report_id where v.id=$1 and dsp.state=0 and rds.state=0 and v.state=0', [data.v_id], (err, r) => {
    if (err) {
      console.log('SQL error');
      return console.error('Error executing query', err.stack);
      // res.render('login');
      console.log('error geting reports');
    } else {
      //TODO - no reason to show params dialog if param list is emty - need to forward to getViewSingleDS or getView method
      console.log(r.rows);
      resp.params = r.rows
      console.log(resp);
      res.render('reports/reportparams', resp);

    }

  })

};


//function runQuery(i,query){
//     console.log("Loading message %d".green, message);
//     htmlMessageboardString += MessageToHTMLString(message);
//}

/*
exports.getView = function(req, res) {
 var data = {
    cookie: req.cookies.session,
    v_id: req.body.view_id,
    params: req.body
  };
  var resp ={
    view_id: data.v_id,
    datasets:"",
    data:""
  };

//  console.log(data);
//  console.log(data.params.text1);


  pool.query('select vs.name as v_name, rds.id as rds_id, rds.name as rds_name, rds.query as rds_query from ref_rpt_datasets rds inner join ref_rpt_report_datasets rrds on rrds.dataset_id=rds.id inner join ref_rpt_views vs on vs.report_id=rrds.report_id where  vs.id=$1', [data.v_id], (err, r) => {
    if (err) {
      console.log('SQL error');
      return console.error('Error executing query', err.stack);
      console.log('error geting reports');
    } else {
      resp.datasets =r.rows;
      console.log(r.rows);
      for (var i = 0, len = r.rowCount; i < len; i++) {

          console.log(r.rows[i].rds_name);

          pool.query(r.rows[i].rds_query, data.params, (err, rr) => {
            if (err) {

              console.log('SQL error');
              return console.error('Error executing query', err.stack);
              console.log('error geting reports');
            } else {
                console.log(r.rows[i].rds_name);
                console.log('=BEGIN=DATA==================');
                console.log(rr.rows);
                var d=rr.rows;
                resp.data=resp.data+d;
                console.log('=END=DATA====================');


            }
            console.log(resp);
          })

        }

      //  var menu = '<li class="active"><a href="#">Home</a></li>';
      //  for (var i = 0; i < result.rowCount; i++) {
      //      console.log(result.rows[i].path);
      //      menu = menu + '<li><a href="' + result.rows[i].path + '">' + result.rows[i].name + '</a></li>';
  //    resp.params=r.rows
  //    console.log(resp);
    //  res.render('reports/reportparams', resp);
    //res.render(r.rows)
      // }

    }

  })

};


*/



exports.getView = function(req, res) {
  var data = {
    cookie: req.cookies.session,
    v_id: req.body.view_id,
    params: req.body
  };
  var resp = {
    view_id: data.v_id,
    datasets: "",
    data: ""
  };

  //  console.log(data);
  //  console.log(data.params.text1);
  function execReport(item, index) {
    //  console.log(index);
    //    console.log(item.rds_name);
    pool.query(item.rds_query, data.params, (err, rr) => {
      if (err) {
        console.log('SQL error');
        return console.error('Error executing query', err.stack);
        console.log('error geting reports');
      } else {
        console.log(item.rds_name);
        console.log('=BEGIN=DATA==================');
        console.log(rr.rows);
        var d = rr.rows;
        resp.data[index] = d;
        console.log('=END=DATA====================');

        //callback(resp);

      }
    })
  }

  pool.query('select vs.name as v_name, rds.id as rds_id, rds.name as rds_name, rds.query as rds_query from ref_rpt_datasets rds inner join ref_rpt_report_datasets rrds on rrds.dataset_id=rds.id inner join ref_rpt_views vs on vs.report_id=rrds.report_id where  vs.id=$1', [data.v_id], (err, r) => {
    if (err) {
      console.log('SQL error');
      return console.error('Error executing query', err.stack);
      console.log('error geting reports');
    } else {
      resp.view_name = r.rows[0].v_name;
      resp.datasets[0].name = r.rows[0].rds_name;

      pool.query(r.rows[0].rds_query, data.params, (err, rr) => {
        if (err) {
          console.log('SQL error');
          return console.error('Error executing query', err.stack);
          console.log('error geting reports');
        } else {
          console.log(r.rows[0].rds_name);
          console.log('=BEGIN=DATA==================');
          console.log(rr.rows);
          var d = rr.rows;
          resp.data[0] = d;
          console.log('=END=DATA====================');


        }
      })
    }
    console.log('!!!');
  })
  console.log('!');
};

exports.getViewSingleDS = function(req, res) {
  var data = {
    cookie: req.cookies.session,
    v_id: req.body.view_id,
    params: req.body
  };
  var resp = {
    view_id: data.v_id,
    datasets: [],
    data: []
  };

  pool.query('select vs.name as v_name, rds.id as rds_id, rds.name as rds_name, rds.query as rds_query from ref_rpt_datasets rds inner join ref_rpt_report_datasets rrds on rrds.dataset_id=rds.id inner join ref_rpt_views vs on vs.report_id=rrds.report_id where  vs.id=$1', [data.v_id], (err, r) => {
    if (err) {
      console.log('SQL error');
      return console.error('Error executing query', err.stack);
      console.log('error geting reports');
    } else {
      resp.view_name = r.rows[0].v_name;
      //  resp.datasets['ds0']=r.rows[0].rds_name;
      resp.datasets.push(r.rows[0].v_name);
      //TODO  resp.datasets[0].name=r.rows[0].rds_name;
      pool.query(r.rows[0].rds_query, data.params, (err, rr) => {
        if (err) {
          console.log('SQL error');
          return console.error('Error executing query', err.stack);
          console.log('error geting reports');
        } else {
          console.log(r.rows[0].rds_name);
          console.log('=BEGIN=DATA==================');
          console.log(rr.rows);
          var d = [];
          d = rr.rows;
          resp.data = d;
          console.log('=END=DATA====================');
          console.log(resp);
          res.render('reports/genericreport', resp);


        }
      })
    }
    console.log('!!!');
  })
  console.log('!');
};


exports.report1 = function(req, res) {
  //res.render('index', {title: 'AG'});
  const data = {
    cookie: req.cookies.session

  };


  pool.query('select count(id) ,JSONB_ARRAY_ELEMENTS(tags->$1) as tag from tmp_sys_messages group by tag', ['tags'], (err, result) => {
    if (err) {
      console.log('SQL error');
      return console.error('Error executing query', err.stack);
      // res.render('login');
      console.log('error geting data');
    } else {
      var html = '<h2> Состояние очередей: </h2>';
      for (var i = 0; i < result.rowCount; i++) {

        // console.log(result.rows[i].path);
        html = html + '<li class="list-group-item">' + result.rows[i].tag + '<span class="badge">' + result.rows[i].count + '</span>';

      }


    }
    res.send(html);


  })

};

exports.test = function(req, res) {
  //res.send('Ok!');
  async.waterfall([
    function(callback) {
      console.log('First Step --> ');
      callback(null, '1', '2');
    },
    function(arg1, arg2, callback) {
      console.log('Second Step --> ' + arg1 + ' ' + arg2);
      callback(null, '3');
    },
    function(arg1, callback) {
      console.log('Third Step --> ' + arg1);
      callback(null, 'final result');
    }
  ], function(err, result) {
    console.log('Main Callback --> ' + result);
  });


};
