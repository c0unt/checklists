/*
 Description: Repors module
 */
const async = require("async");
const db = require('../../../db_').db;
const log = require('../../../log')(module);

/*
 * GET Report Index.
 */

exports.index = (req, res) => {
    //res.render('index', {title: 'AG'});
    const data = {
        cookie: req.cookies.session
    };

    db.any('select r.id as r_id, r.name as r_name, v.id as v_id, v.name as v_name ' +
        ' from ref_rpt_reports r inner join ref_rpt_views v on v.report_id=r.id ' +
        ' inner join ref_sys_users_x_rights ur on ur.right_id=v.right_id ' +
        ' inner join tmp_sys_sessions ss on ss.user_id=ur.user_id ' +
        ' where  ss.id=$1 and r.state=0 and v.state=0 order by r_name', [data.cookie]
    ).then((r) => {
        return res.render('reports/reportslist', r.rows);
    }).catch((err) => {
        log.info('SQL error');
        log.error('Error executing query', err.stack);
        return log.info('error geting reports');
    });

};

exports.getFilter = (req, res) => {
    //res.render('index', {title: 'AG'});
    const data = {
        cookie: req.cookies.session,
        v_id: req.query.v_id
    };

    let resp = {
        view_id: data.v_id,
        params: ""
    };

    db.any('select r.id as r_id, r.name as r_name, v.id as v_id, v.name as v_name ' +
        ' from ref_rpt_reports r inner join ref_rpt_views v on v.report_id=r.id ' +
        ' inner join ref_sys_users_x_rights ur on ur.right_id=v.right_id ' +
        ' inner join tmp_sys_sessions ss on ss.user_id=ur.user_id ' +
        ' where  ss.id=$1 and r.state=0 and v.state=0 order by r_name', [data.cookie]
    ).then((r) => {
        //TODO - no reason to show params dialog if param list is empty - need to forward to getViewSingleDS or getView method
        resp.params = r.rows;
        return res.render('reports/reportparams', resp);
    }).catch((err) => {
        log.info('SQL error');
        log.error('Error executing query' + err.stack);
        return log.info('error geting reports');
    });
};

// exports.getView =  (req, res) => {
//     let data = {
//         cookie: req.cookies.session,
//         v_id: req.body.view_id,
//         params: req.body
//     };
//
//     let resp = {
//         view_id: data.v_id,
//         datasets: "",
//         data: ""
//     };
//
//
//     function execReport(item, index) {
//         //  console.log(index);
//         //    console.log(item.rds_name);
//         pool.query(item.rds_query, data.params, (err, rr) => {
//             if (err) {
//                 console.log('SQL error');
//                 console.error('Error executing query', err.stack);
//                 console.log('error geting reports');
//             } else {
//                 console.log(item.rds_name);
//                 console.log('=BEGIN=DATA==================');
//                 console.log(rr.rows);
//                 let d = rr.rows;
//                 resp.data[index] = d;
//                 console.log('=END=DATA====================');
//
//                 //callback(resp);
//
//             }
//         })
//     }
//
//     pool.query('select vs.name as v_name, rds.id as rds_id, rds.name as rds_name, rds.query as rds_query from ref_rpt_datasets rds inner join ref_rpt_report_datasets rrds on rrds.dataset_id=rds.id inner join ref_rpt_views vs on vs.report_id=rrds.report_id where  vs.id=$1', [data.v_id], (err, r) => {
//         if (err) {
//             console.log('SQL error');
//             console.error('Error executing query', err.stack);
//             console.log('error geting reports');
//         } else {
//             resp.view_name = r.rows[0].v_name;
//             resp.datasets[0].name = r.rows[0].rds_name;
//
//             pool.query(r.rows[0].rds_query, data.params, (err, rr) => {
//                 if (err) {
//                     console.log('SQL error');
//                     console.error('Error executing query', err.stack);
//                     console.log('error geting reports');
//                 } else {
//                     console.log(r.rows[0].rds_name);
//                     console.log('=BEGIN=DATA==================');
//                     console.log(rr.rows);
//                     let d = rr.rows;
//                     resp.data[0] = d;
//                     console.log('=END=DATA====================');
//
//
//                 }
//             })
//         }
//         console.log('!!!');
//     })
//     console.log('!');
// };

exports.getViewSingleDS = (req, res) => {
    let data = {
        cookie: req.cookies.session,
        v_id: req.body.view_id,
        params: req.body
    };

    let resp = {
        view_id: data.v_id,
        datasets: [],
        data: []
    };

    db.any('select vs.name as v_name, rds.id as rds_id, rds.name as rds_name, rds.query as rds_query ' +
        ' from ref_rpt_datasets rds inner join ref_rpt_report_datasets rrds on rrds.dataset_id=rds.id ' +
        ' inner join ref_rpt_views vs on vs.report_id=rrds.report_id where  vs.id=$1', [data.v_id]
    ).then((r) => {
        resp.view_name = r.rows[0].v_name;
        //  resp.datasets['ds0']=r.rows[0].rds_name;
        resp.datasets.push(r.rows[0].v_name);

        //TODO  resp.datasets[0].name=r.rows[0].rds_name;
        db.any(r.rows[0].rds_query, data.params
        ).then((rr) => {
            log.info(r.rows[0].rds_name);
            log.info('=BEGIN=DATA==================');
            log.info(JSON.stringify(rr.rows));

            let d = [];
            d = rr.rows;
            resp.data = d;
            log.info('=END=DATA====================');
            log.info(JSON.stringify(resp));

            return res.render('reports/genericreport', resp);
        }).catch((err) => {
            log.info('SQL error');
            log.error('Error executing query', err.stack);
            return log.info('error geting reports');
        });


    }).catch((err) => {
        log.info('SQL error');
        log.error('Error executing query' + err.stack);
        return log.info('error geting reports');
    });

};


exports.report1 =  (req, res) => {
    //res.render('index', {title: 'AG'});
    const data = {
        cookie: req.cookies.session
    };

    db.any('select count(id) ,JSONB_ARRAY_ELEMENTS(tags->$1) as tag from tmp_sys_messages group by tag', ['tags']
    ).then((result) => {

        let html = '<h2> Состояние очередей: </h2>';
        for (let i = 0; i < result.rowCount; i++) {
            html = html + '<li class="list-group-item">' + result.rows[i].tag + '<span class="badge">'
                + result.rows[i].count + '</span>';
        }
        return res.send(html);
    }).catch((err) => {
        log.info('SQL error');
        log.error('Error executing query' + err.stack);
        return log.info('error geting data');
    });
};

