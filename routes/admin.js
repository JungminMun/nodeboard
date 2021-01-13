const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { isLoggedin } = require('../util');

router.get('/', isLoggedin, checkAdmin, function(req, res){
    User.find({}, (err, users) => {
        if(err) return res.json(err);
        res.render('admintools/show', {users:users});
    });
});


      
module.exports = router;

function checkAdmin(req, res, next){
    User.findOne({}, function(err, user){
      if(err) return res.json(err);
      if(! user.isAdmin){
        return util.noPermission(req, res);
      }
      next();
    });
  }