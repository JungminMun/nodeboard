const express = require('express');
const router = express.Router();
const User = require('../models/User');
const util = require('../util');

// User Create get router
router.get('/create', (req, res) => {
    var user = req.flash('user')[0] || {};
    var errors = req.flash('errors')[0] || {};
    res.render('users/create', { 
        user:user, 
        errors:errors 
    });
});

// User create action
router.post('/', (req, res) => {
    User.create(req.body, (err, user) => {
        if(err){
            req.flash('user', req.body);
            req.flash('errors', util.parseError(err));
            return res.redirect('/users/create');
        }

        res.redirect('/');
    });
});

// User Name get router
router.get('/:username', util.isLoggedin, checkPermission, function(req, res){
    User.findOne({username:req.params.username}, function(err, user){
        if(err) return res.json(err);
        
        res.render('users/show', {
            user:user
        });
    });
});

// User edit action
router.get('/:username/edit', util.isLoggedin, checkPermission, function(req, res){
    var user = req.flash('user')[0];
    var errors = req.flash('errors')[0] || {};
    
    if(!user){
        User.findOne({username:req.params.username}, function(err, user){
        if(err) return res.json(err);
            res.render('users/edit', { 
                username:req.params.username, 
                user:user, errors:errors 
            });
        });

    } else {
        res.render('users/edit', { 
            username:req.params.username, 
            user:user, errors:errors 
        });
    }
});

// User name password change
router.put('/:username', util.isLoggedin, checkPermission, function(req, res, next){
    User.findOne({username:req.params.username})
        .select('password')
        .exec(function(err, user){
            if(err) return res.json(err);

            // User original password
            user.originalPassword = user.password;
            // User password
            user.password = req.body.newPassword ? req.body.newPassword : user.password;
            
            // User save for loop
            for(var p in req.body){
                user[p] = req.body[p];
            }

            // User edition save
            user.save(function(err, user){
                if(err){
                    req.flash('user', req.body);
                    req.flash('errors', util.parseError(err));
                    return res.redirect('/users/'+req.params.username+'/edit');
                }
                res.redirect('/users/'+user.username);
            });
    });
});

module.exports = router;

// Permission check function
function checkPermission(req, res, next){
    User.findOne({username:req.params.username}, function(err, user){
        if(err) return res.json(err);
        
        if(user.id != req.user.id) return util.noPermission(req, res);

        next();
    });
}