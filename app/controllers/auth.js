/*
 Description: Auth module. Allows to login/logout.
 */
"use strict";

const db = require('../../db').db;
const log = require('../../log')(module);
const validate = require('uuid-validate');
const config = require('../../config');

exports.logout = (req, res) => {
    /*
     Perform log out
     */
    //  '00000000-0000-0000-0000-000000000000'
    res.cookie('session', '00000000-0000-0000-0000-000000000000');
    // and more.. we shall kill session in database...

    res.redirect('../login');

    log.info('Perform log out');
};

exports.test = (req, res) => {
    log.info(JSON.stringify(req));
    res.send('test');
};


exports.checksession = (req, res, next) => {
    /*
     Perform session check as middleware: if session is not ok - quits app to login dialog
     */

    //  console.log(req);
    const data = {
        cookie: req.cookies.session,
        inrender: req.query.inrender || false
    };

    if (validate(data.cookie) !== true) {
        data.cookie = '00000000-0000-0000-0000-000000000000';
    }

    db.any('SELECT id,dts FROM tmp_sys_sessions WHERE id=$1 and dts>now()', [data.cookie]
    ).then((result) => {

        if (result.length === 1) {
            //console.log('checksession session Ok');
            next();
            return null;
        }

        //checksession session FAIL!!!
        if (data.inrender) {
            return res.status(403).send('');
        } else
            return res.redirect('../login');

    }).catch((err) => {
        log.error('checksession SQL error');
        return res.status(403).send('');
    });

};


exports.login = (req, res) => {
    /*
     Perform log in
     */

    const data = {
        name: req.body.userName,
        pass: req.body.userPassword
    };

    log.info('login data' + JSON.stringify(data));

    let resp = {
        message: ''
    };

    if (req.method === 'GET') {
        return res.render('login');
    }

    db.any('SELECT id FROM ref_sys_users WHERE state=0 and (email=$1 or name=$1)  and pass=$2', [data.name, data.pass]
    ).then(result => {
        if (result.length !== 1) throw new Error('ref_sys_users record count  error');

        return db.any('Insert into tmp_sys_sessions (user_id) values ($1) returning id as session, dts as untill', [result[0].id]);

    }).then((result) => {
        res.cookie('session', result[0].session);
        return  res.redirect('../../home')
    }).catch((err) => {
        resp.message = err.stack;
        return res.render('login', resp);
    });

};

exports.getUserMenu = (req, res) => {
    /*
     Perform session check and return menu items
     */
    const data = {
        cookie: req.cookies.session
    };

    let resp = {
        do_not_use_partial: true,
        items: []
    };

    if (validate(data.cookie) !== true) data.cookie = '00000000-0000-0000-0000-000000000000';


    db.any('delete from tmp_sys_sessions where dts < now()'
    ).then(() => {
        return db.any(' SELECT (select count(id) as q from ref_sys_menuitems where parent=m.id)as isparent, ' +
            ' m.id,  ' +
            ' m.icon, ' +
            ' m.name as name, m.path as path FROM ref_sys_menuitems m ' +
            ' inner join ref_sys_users_x_rights r  on r.right_id=m.right_id and r.state=0 ' +
            ' inner join tmp_sys_sessions ss on r.user_id=ss.user_id ' +
            ' where m.parent is null and ss.id=$1 and m.application_id=$2' +
            ' order by  m.sortorder ', [data.cookie, config.get('applicationID')]);
    }).then(result => {

        let sQueryParams = [];

        result.forEach((item, i) => {
            let rr = {};

            rr.id = item.id;
            rr.icon = item.icon;
            rr.name = item.name;
            rr.path = item.path;
            rr.isparent = item.isparent;
            rr.child = [];

            resp.items.push(rr);

            let queryParam = {'id': rr.id, 'indx': i};

            sQueryParams.push(queryParam);
        });

        let selectSQL = 'select $2 as i, icon, id, name, path from ref_sys_menuitems where parent=$1';

        // закину сразу все запросы
        db.tx(t => {
            const queries = sQueryParams.map(q => {
                return t.any(selectSQL, [q.id, q.indx]);
            });
            return t.batch(queries);

        }).then(data => {
            //когда все запросы отработали, обработаем ответы по очереди:
            data.forEach((r) => {
                if (r.length !== 0)
                    resp.items[r[0].i].child = r;
            });

            log.info('getUserMenu Done!');
            // и вернем ответ
            return   res.render('menu_data', resp);
        }).catch(error => {
            return log.error(error);
        });

        return null;
    }).catch((err) => {
        log.info('SQL error');
        log.error('Error executing query ' + err.stack);
        res.render('login');
        return log.info('login rendered 1');
    });


};
