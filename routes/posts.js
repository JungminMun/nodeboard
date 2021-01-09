const express  = require('express');
const router = express.Router();
const Post = require('../models/Post');
const util = require('../util');

router.get('/', (req, res) => {
    Post.find({})    
    .populate('author')               
    .sort('-createdAt')             
    .exec((err, posts) => {     
        if(err) return res.json(err);
        res.render('main/index', {posts:posts});
    });
});

router.get('/create', (req, res) =>{
    var post = req.flash('post')[0] || {};
    var errors = req.flash('errors')[0] || {};
    res.render('main/create', { post:post, errors:errors });
});
  
router.post('/', (req, res) => {
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
  
router.get('/:id', function(req, res){
    Post.findOne({_id:req.params.id})
        .populate('author')             
        .exec(function(err, post){     
            if(err) return res.json(err);
            res.render('main/show', {post:post});
        });
});

router.get('/:id/edit', (req, res) => {
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
  
router.put('/:id', (req, res) => {
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
  
router.delete('/:id', (req, res) => {
    Post.deleteOne({_id:req.params.id}, (err) =>{
        if(err) return res.json(err);
        res.redirect('/main');
    })
})

module.exports = router;