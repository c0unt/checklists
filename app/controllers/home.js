/*
Description: Home controller - this is the main controller to provide core functions like: menu, logout and so on.

*/


exports.test = function(req, res){
    console.log(req);
    res.send('test');
};

exports.index = function(req, res){
    //res.render('index', {title: 'TEST'});

    res.render('dashboard');
};

exports.logout = function(req, res){

    res.redirect('../logout')
};

;
