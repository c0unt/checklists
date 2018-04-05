/*
Description: Home controller - this is the main controller to provide core functions like: menu, logout and so on.
*/
const log = require('../../log')(module);

exports.test = function(req, res){
    log.info (JSON.stringify(req));
    res.send('test');
};

exports.index = function(req, res){
    //res.render('index', {title: 'TEST'});

    res.render('dashboard');
};

exports.logout = function(req, res){
    res.redirect('../logout')
};


