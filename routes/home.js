var express = require('express');
var router = express.Router();

router.get('/', function(req, res){
  res.render('main/welcome');
});
router.get('/about', function(req, res){
  res.render('main/about');
});

module.exports = router;