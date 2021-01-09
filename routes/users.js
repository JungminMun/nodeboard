const express = require('express');
const router = express.Router();
const User = require('../models/User');

router.get('/', (req, res) => {
    User.find({})
        .sort({
            username:1 // 오름차순 정렬
        })
        .exec((err, users) =>{
            if(err){
                return res.json(err);
            }
            res.render('users/index', {users:users});
        });
});

router.get('/create', (req, res) => {
    var user = req.flash('user')[0] || {};
    var errors = req.flash('errors')[0] || {};
    res.render('users/create', { user:user, errors:errors });  
});

router.post('/', (req, res) => {
    User.create(req.body, (err, user) => {
        if(err){
            req.flash('user', req.body);
            req.flash('errors', parseError(err));
            return res.redirect('/users/create');
        }
        res.redirect('/users');
    });
});

router.get('/:username', (req, res) => {
    var user = req.flash('user')[0];
    var errors = req.flash('errors')[0] || {};

    if(!user){
        User.findOne({username:req.params.username}, (err, user) =>{
            if(err){
                return res.json(err);
            }
            res.render('users/edit', { username:req.params.username, user:user, errors:errors });
        });
    }
    else {
        res.render('users/edit', { username:req.params.username, user:user, errors:errors });
    }
 
});

router.get('/:username/edit', (req, res) => {
    User.findOne({username:req.params.username}, (err, user) => {
        if(err){
            return res.json(err);
        }
        res.render('users/edit', {user:user});
    });
});

router.put('/:username', (req, res, next) => {
    User.findOne({username:req.params.username}) 
        .select('password')
        .exec((err, user) => {
            if(err){
                return res.json(err);
            }

            user.originalPassword = user.password;
            user.password = req.body.newPassword? req.body.newPassword : user.password;

            for(var p in req.body){
                user[p] = req.body[p];
            }

            user.save((err, user) => {
                if(err){
                    req.flash('user', req.body);
                    req.flash('errors', parseError(err));
                    return res.redirect('/users/'+req.params.username+'/edit');
                }         
                res.redirect('/users/'+user.username);
            });
        });
});

router.delete('/:username', (req, res) =>{
    User.deleteOne({username:req.params.username}, (err) => {
        if(err){
            return res.json(err);
        }
        res.redirect('/users');
    });
});

module.exports = router;

parseError = (errors) => {
    var parsed = {};
    if(errors.name == 'ValidationError'){
        for(var name in errors.errors){
            var validationError = errors.errors[name];
            parsed[name] = { message:validationError.message };
        }
    }
    else if(errors.code == '11000' && errors.errmsg.indexOf('username') > 0) {
        parsed.username = { message:'This username already exists!' };
    }
    else {
        parsed.unhandled = JSON.stringify(errors);
    }
    return parsed;
}
  