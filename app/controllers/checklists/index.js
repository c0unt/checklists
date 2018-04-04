/*
 Description: Checlists core module
 */

const db = require('../../../db').db;
const log = require('../../../log')(module);
const uuidv4 = require('uuid/v4');

/*
 * GET Checklists Index.
 */
exports.index = (req, res) => {
    db.any('SELECT cl.id as checklist_id, cl.name as checklist_name, cl.version as checklist_version, ' +
        ' cl.status as checklist_status FROM data_checklists cl where cl.state=0 order by cl.name '
    ).then((data) => {
        log.info(data.rows);
        return res.render('checklists/checklistslist', data.rows);
    }).catch((err) => {
        log.info('SQL error - error geting data_checklists 1');
        return log.error('Error executing query' + err.stack);
    });

};

exports.addChecklist = (req, res) => {
    //res.render('index', {title: 'AG'});
    const data = {
        cookie: req.cookies.session,
        id: req.body.id,
        name: req.body.name,
        version: req.body.version,
        status: req.body.status
    };

    log.info(req.method);
    log.info(req.body);
    log.info('===================');
    log.info(JSON.stringify(data));

    if (req.method === "GET") {
        log.info('Got GET');
        return res.render('checklists/checklist');
    }

    log.info('Got ID');
    if (data.id === '') {
        data.id = uuidv4();
    }

    db.any(
        ' INSERT INTO data_checklists ' +
        '(id, name, version, status, state)' +
        '        VALUES ($1,$2,$3,$4,$5) ' +
        '        ON CONFLICT (id) ' +
        '        DO UPDATE SET ' +
        '            name=$2, version=$3,status=$4, state=$5',
        [data.id, data.name, data.version, data.status, 0]
    ).then((r) => {
        return res.redirect('checklists/');
    }).catch((err) => {
        log.info('SQL error');
        //   log.info([data.id, data.name, data.version, data.status, 0]);
        log.error('Error executing query ' + err.stack);
        return log.info('error update data_checklists 1');
    });
};

exports.getChecklist = (req, res) => {
    //res.render('index', {title: 'AG'});
    const data = {
        cookie: req.cookies.session,
        id: req.query.id
    };

    db.any('SELECT cl.id as checklist_id, cl.name as checklist_name, cl.version as checklist_version, cl.status as checklist_status FROM data_checklists cl where cl.id=$1', [data.id]
    ).then((r) => {

        log.info(r.rows[0]);
        return res.render('checklists/checklist', r.rows[0]);
    }).catch((err) => {
        log.info('SQL error');
        log.error('Error executing query' + err.stack);
        return log.info('error geting checklist 1');
    });
};

exports.getChecklistChecks = (req, res) => {

    const data = {
        cookie: req.cookies.session,
        id: req.query.id,
        name: req.query.name,
        inrender: req.query.inrender || false
    };

    let resp = {
        do_not_use_partial: data.inrender,
        inrender: data.inrender,
        checklist_id: data.id,
        checklist_name: data.name,
        checks: []
    };

    db.any('select dcc.id as dcc_id, dcc.check_order as dcc_check_order, dcc.name as dcc_name, ' +
        ' dcc.content as dcc_content, dcc.comment as dcc_comment, dcc.pass as dcc_pass,  ' +
        ' dcc.pass_dts as dcc_pass_dts, u.name as user_name from data_checklist_content dcc ' +
        'left join ref_sys_users u on u.id=dcc.pass_user_id where dcc.checklist_id =$1 and dcc.state=0', [data.id]
    ).then((r) => {
        log.info('getChecklistChecks');
        log.info(r.rows);
        resp.checks = r.rows;
        log.info(JSON.stringify(resp));
//
        return res.render('checklists/checklistchecks', resp);
    }).catch((err) => {
        log.info('SQL error');
        log.error('Error executing query' + err.stack);
        return log.info('error geting getChecklistChecks 1');
    });
};

exports.addCheck = (req, res) => {
    const data = {
        cookie: req.cookies.session,
        id: req.body.id,
        newcheck_name: req.body.newcheck_name,
        newcheck_descr: req.body.newcheck_descr,
        inrender: req.body.inrender || false
    };

    let resp = {
        do_not_use_partial: data.inrender,
        inrender: data.inrender
    };

    log.info(JSON.stringify(data));

    db.any('Insert into "data_checklist_content" (checklist_id, name, content) values ($1,$2,$3)returning id, name, content, checklist_id, pass, pass_dts, pass_user_id', [data.id, data.newcheck_name, data.newcheck_descr]
    ).then((r) => {
        log.info('addCheck');
        log.info(JSON.stringify(r.rows));

        resp.id = r.rows[0].id;
        resp.name = r.rows[0].name;
        resp.content = r.rows[0].content;
        resp.pass = r.rows[0].pass;
        resp.pass_user_id = r.rows[0].pass_user_id;
        resp.pass_dts = r.rows[0].pass_dts;
        resp.do_not_use_partial = data.inrender;
        resp.inrender = data.inrender;

        log.info(JSON.stringify(resp));
        res.type('application/json');

        return res.send(resp);
    }).catch((err) => {
        log.info('SQL error');
        log.error('Error executing query' + err.stack);
        return log.info('error geting addCheck 1');
    });

};

exports.delCheck = (req, res) => {

    const data = {
        cookie: req.cookies.session,
        dcc_id: req.body.dcc_id,
        inrender: req.body.inrender || false
    };

    let resp = {
        do_not_use_partial: data.inrender,
        inrender: data.inrender,
        dcc_id: data.dcc_id,

    };

    log.info(JSON.stringify(data));


    db.any('UPDATE "data_checklist_content" SET state=1 WHERE "id" = $1 returning id', [data.dcc_id]
    ).then((r) => {
        log.info('delCheck');
        log.info(JOSN.stringify(r.rows));

        resp.dcc_id = r.rows[0].id;
        resp.do_not_use_partial = data.inrender;
        resp.inrender = data.inrender;

        log.info(JOSN.stringify(resp));
        res.type('application/json');
        return res.send(resp);
    }).catch((err) => {
        log.info('SQL error');
        log.error('Error executing query' + err.stack);
        return log.info('error geting delCheck 1');
    });

};


exports.setOneCheck = (req, res) => {
    const data = {
        cookie: req.cookies.session,
        dcc_id: req.body.dcc_id,
        dcc_pass: req.body.dcc_pass,
        inrender: req.body.inrender || false
    };

    let resp = {
        do_not_use_partial: data.inrender,
        inrender: data.inrender,
        user_id: data.user_id
    };

    log.info(data);

    db.any('UPDATE "data_checklist_content" SET pass_dts=now(), "pass" = $3, ' +
        ' pass_user_id=(select user_id from tmp_sys_sessions where id=$1)  ' +
        ' WHERE "id" = $2 returning id,checklist_id, pass, pass_dts, pass_user_id ',
        [data.cookie, data.dcc_id, data.dcc_pass]
    ).then((r) => {
        log.info('setOneCheck');
        log.info(JOSN.stringify(r.rows));

        resp.id = r.rows[0].id;
        resp.user_id = r.rows[0].pass_user_id;
        resp.pass = r.rows[0].pass;
        resp.pass_dts = r.rows[0].pass_dts;
        resp.do_not_use_partial = data.inrender;
        resp.inrender = data.inrender;

        log.info(resp);
        res.type('application/json');
        return res.send(resp);

    }).catch((err) => {
        log.info('SQL error');
        log.error('Error executing query' + err.stack);
        return log.info('error geting setOneCheck 1');
    });
};

exports.getChecklistsSelect = (req, res) => {
    //res.render('index', {title: 'AG'});
    const data = {
        cookie: req.cookies.session,
        id_selected: req.query.id_selected
    };

//TODO - getChecklistsSelect feature is not implemented
    res.sendEr(select);
    res.status(404).send('getChecklistsSelect feature is not implemented');
    //
    //
    // pool.query('', [data.cookie], (err, result) => {
    //     if (err) {
    //         console.log('SQL error');
    //         console.error('Error executing query', err.stack);
    //         console.log('error geting getChecklistsSelect 1');
    //     } else {
    //         let select = '<option value="">No checklist</option>';
    //         for (let i = 0; i < result.rowCount; i++) {
    //             if (data.id_selected === result.rows[i].id) {
    //                 select = select + '<option value="' + result.rows[i].id + '" selected>' + result.rows[i].name + ' (' + result.rows[i].code + ')' + '</option>';
    //
    //             }
    //             else {
    //                 select = select + '<option value="' + result.rows[i].id + '">' + result.rows[i].name + ' (' + result.rows[i].code + ')' + '</option>';
    //
    //             }
    //
    //         }
    //         res.send(select);
    //     }
    //
    // })

};

exports.test = (req, res) => {
    res.send('Ok!');
};
