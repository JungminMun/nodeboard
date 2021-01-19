const express  = require('express');
const router = express.Router();
const Post = require('../models/Post');
const util = require('../util');

router.get('/', async function(req, res){
    var page = Math.max(1, parseInt(req.query.page));
    var limit = Math.max(1, parseInt(req.query.limit));
    page = !isNaN(page)?page:1;
    limit = !isNaN(limit)?limit:10;
  
    var skip = (page-1)*limit;
    var count = await Post.countDocuments({});
    var maxPage = Math.ceil(count/limit);
    var posts = await Post.find({})
      .populate('author')
      .sort('-createdAt')
      .skip(skip)
      .limit(limit)
      .exec();
  
    res.render('main/index', {
      posts:posts,
      currentPage:page,
      maxPage:maxPage,
      limit:limit
    });
  });
  
  

router.get('/create', util.isLoggedin, (req, res) =>{
    var post = req.flash('post')[0] || {};
    var errors = req.flash('errors')[0] || {};
    res.render('main/create', { post:post, errors:errors });
});
  
router.post('/', util.isLoggedin, (req, res) => {
    req.body.author = req.user._id;
    Post.create(req.body, (err, post) => {
        if(err){
            req.flash('post', req.body);
            req.flash('errors', util.parseError(err));
            return res.redirect('/main/create');
        }
      res.redirect('/main');
    });
  });
  
router.get('/:id', (req, res) => {
    Post.findOne({_id:req.params.id})
        .populate('author')             
        .exec((err, post) => {     
            if(err) return res.json(err);
            res.render('main/show', {post:post});
        });
});

router.get('/:id/edit', util.isLoggedin, checkPermission, (req, res) => {
    var post = req.flash('post')[0];
    var errors = req.flash('errors')[0] || {};

    if(!post){
        Post.findOne({_id:req.params.id}, (err, post) => {
            if(err){
                return res.json(err);
            }
            res.render('main/edit', { post:post, errors:errors });
        });
    } else {
        post._id = req.params.id;
        res.render('main/edit', { post:post, errors:errors });
    }
});
  
router.put('/:id', util.isLoggedin, checkPermission, (req, res) => {
    req.body.updatedAt = Date.now();
    Post.findOneAndUpdate({_id:req.params.id}, req.body, {runValidators:true}, (err, post) => {
        if(err){
            req.flash('post', req.body);
            req.flash('errors', util.parseError(err));
            return res.redirect('/main/'+req.params.id+'/edit');
        }
        res.redirect('/main/'+req.params.id);
    });
});
  
router.delete('/:id', util.isLoggedin, checkPermission, function(req, res){
    Post.deleteOne({_id:req.params.id}, function(err){
      if(err) return res.json(err);
      res.redirect('/main');
    });
  });
    


module.exports = router;

function checkPermission (req, res, next){
    Post.findOne({_id:req.params.id}, function(err, post){
        if(err) return res.json(err);
        if(post.author != req.user.id) return util.noPermission(req, res);
  
        next();
    });
}
  