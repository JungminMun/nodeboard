const express = require('express');
const passport = require('../config/passport');
const util = require('../util');
const router = express.Router();

router.get('/', (req, res) => {
    res.render('main/welcome');
});

router.get('/login', (req,res) => {
    var username = req.flash('username')[0];
    var errors = req.flash('errors')[0] || {};
    res.render('home/login', {
        username:username,
        errors:errors
    });
});

router.post('/login',  (req, res, next) => {
    var errors = {};
    var isValid = true;

    if(!req.body.username){
        isValid = false;
        errors.username = 'Username이 필요합니다 !';
    }
    
    if(!req.body.password){
        isValid = false;
        errors.password = 'Password가 필요합니다 !';
    }

    if(isValid){
        next();
    } else {
        req.flash('errors',errors);
        res.redirect('/login');
    }
}, passport.authenticate('local-login', {
    successRedirect : '/main',
    failureRedirect : '/login'
}));

router.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
});

module.exports = router;