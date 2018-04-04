/*
 Description: User management module
 */
const db = require('../../../db').db;
const log = require('../../../log/')(module);
const uuidv4 = require('uuid/v4');

/*
 * GET Users Index.
 */

exports.index = (req, res) => {
    //res.render('index', {title: 'AG'});
    const data = {
        cookie: req.cookies.session
    };

    db.any('SELECT u.id as id, u.name as name, u.email as email,u.telegram as telegram, ' +
        ' u.state as state FROM ref_sys_users u where u.state=0 order by u.name'
    ).then((r) => {
        log.info(JSON.stringify(r.rows));
        return res.render('users/userslist', r.rows);

    }).catch((err) => {
        log.info('SQL error');
        log.error('Error executing query' + err.stack);
        return log.info('error geting userlist 1');
    });
};


exports.addUser = (req, res) => {
    //res.render('index', {title: 'AG'});
    const data = {
        cookie: req.cookies.session,
        id: req.body.id,
        name: req.body.name,
        email: req.body.email,
        telegram: req.body.telegram,
        pass: req.body.pass
    };

    log.info(req.method);

    log.info(req.body);
    log.info('===================');
    log.info(data);

    if (req.method == "GET") {
        log.info('Got GET');
        return res.render('users/user');
    }


    log.info('Got ID');

    if (data.id === '') {
        data.id = uuidv4();

        db.any('INSERT INTO ref_sys_users ' +
            '(id, name, email, telegram, state, pass)' +
            '        VALUES ($1,$2,$3,$4,$5,$6) ' +
            '        ON CONFLICT (id) ' +
            '        DO UPDATE SET ' +
            '            name=$2, email=$3,telegram=$4, state=$5',
            [data.id, data.name, data.email, data.telegram, 0, data.pass]
        ).then((data) => {
            return res.redirect('users/');
        }).catch((err) => {
            log.info('SQL error');
            log.error('Error executing query' + err.stack);
            return log.info('error update user 1');
        })

    } else {
        db.any('INSERT INTO ref_sys_users ' +
            '(id, name, email, telegram, state)' +
            '        VALUES ($1,$2,$3,$4,$5) ' +
            '        ON CONFLICT (id) ' +
            '        DO UPDATE SET ' +
            '            name=$2, email=$3,telegram=$4, state=$5', [data.id, data.name, data.email, data.telegram, 0]
        ).then((r) => {
            return res.redirect('users/');
        }).catch((err) => {
            log.info('SQL error');
            // console.log([data.id, data.name, data.version, data.status, 0]);
            log.error('Error executing query', err.stack);
            return log.info('error update user 1');
        });

    }

};


exports.getUser = (req, res) => {
    //res.render('index', {title: 'AG'});
    const data = {
        cookie: req.cookies.session,
        id: req.query.id
    };

    db.any('SELECT u.id as id, u.name as name, u.email as email,u.telegram as telegram, u.state as state FROM ref_sys_users u where u.id=$1', [data.id]
    ).then((r) => {
        log.info(JSON.stringify(r.rows[0]));
        return res.render('users/user', r.rows[0]);
    }).catch((err) => {
        log.info('SQL error');
        log.error('Error executing query' + err.stack);
        return log.info('error geting user 1');
    });
};


exports.getUserRights = (req, res) => {
    //res.render('index', {title: 'AG'});
    const data = {
        cookie: req.cookies.session,
        id: req.query.id,
        inrender: req.query.inrender || false
    };
    
    let resp = {
        do_not_use_partial: data.inrender,
        inrender: data.inrender,
        user_id: data.id,
        rights: []
    };

    db.any('    select ur.id as id, r.id as right_id, r.name as right_name,  coalesce(ur.state, 1) as state ' +
        ' from ref_sys_rights r left join  ref_sys_users_x_rights ur on r.id=ur.right_id and ur.user_id=$1 ' +
        ' order by r.name', [data.id]
    ).then((r) => {
        log.info('getUserRights');
        log.info(JSON.stringify(r.rows));
        resp.rights = r.rows

        log.info(JSON.stringify(resp));
        return res.render('users/userrights', resp);
    }).catch((err) => {
        log.info('SQL error');
        log.info('Error executing query' + err.stack);
        return log.info('error geting getChecklistChecks 1');
    });

};


exports.setUserRight =  (req, res) => {
    const data = {
        cookie: req.cookies.session,
        user_id: req.body.user,
        right_id: req.body.right,
        action: req.body.action,
        inrender: req.body.inrender || false
    };
    let resp = {
        do_not_use_partial: data.inrender,
        inrender: data.inrender,
        user_id: data.user_id,

    };
    log.info(JSON.stringify(data));

    db.any('insert into ref_sys_users_x_rights (user_id, right_id,state) '+
        ' values( $1, $2, $3 ) On Conflict on CONSTRAINT user_right_constraint '+
        ' DO UPDATE SET state=$3 returning id, user_id, right_id, state', [data.user_id, data.right_id, data.action]
    ).then((r) => {
        log.info('setUserRight');
        log.info(JSON.stringify(r.rows));

        resp.id = r.rows[0].id;
        resp.user_id = r.rows[0].user_id;
        resp.right_id = r.rows[0].right_id;
        resp.state = r.rows[0].state;
        resp.do_not_use_partial = data.inrender;
        resp.inrender = data.inrender;

        log.info(JSON.stringify(resp));
        return res.render('users/useroneright', resp);
    }).catch((err) => {
        log.info('SQL error');
        log.error('Error executing query'+ err.stack);
        return   log.info('error geting setUserRight 1');
 
    });
};

exports.setUserPass = (req, res) => {
    const data = {
        cookie: req.cookies.session,
        user_id: req.body.user,
        pass: req.body.pass,
        inrender: req.body.inrender || false
    };
    let resp = {
        do_not_use_partial: data.inrender,
        inrender: data.inrender
    };

    log.info(JSON.stringify(data));

    //TODO: need to check rights here...

    db.any('update ref_sys_users set pass=$2 where id=$1', [data.user_id, data.pass]
    ).then((r) => {
        log.info('setUserPass');
        log.info(JSON.stringify(r.rows));
        resp.user_id = data.user_id;
        resp.message = 'Ok';
        resp.do_not_use_partial = data.inrender;
        resp.inrender = data.inrender;

        log.info(JSON.stringify(resp));
        return res.render('users/usersetpass', resp);

    }).catch((err) => {
        log.info('SQL error');
        log.error('Error executing query'+ err.stack);
        log.info('error geting setUserPass 1');
       
        resp.user_id = data.user_id;
        resp.message = 'Fail';
        resp.do_not_use_partial = data.inrender;
        resp.inrender = data.inrender;

        log.info(JSON.stringify(resp));
        return res.render('users/usersetpass', resp);
       
    });
};


exports.test = function (req, res) {
    res.send('Ok!');
};
