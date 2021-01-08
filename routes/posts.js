const express  = require('express');
const router = express.Router();
const Post = require('../models/Post');

router.get('/', (req, res) => {
    Post.find({})                   
    .sort('-createdAt')             
    .exec((err, posts) => {     
        if(err) return res.json(err);
        res.render('main/index', {posts:posts});
    });
});

router.get('/create', (req, res) =>{
    res.render('main/create');
});

router.post('/', (req, res) => {
    Post.create(req.body, (err, post) =>{
        if(err) return res.json(err);
        res.redirect('/main');
    });
});

router.get('/:id', (req, res) => {
    Post.findOne({_id:req.params.id}, (err, post) =>{
        if(err) return res.json(err);
        res.render('main/show', {post:post});
    });
});

router.get('/:id/edit', (req, res) => {
    Post.findOne({_id:req.params.id}, (err, post) => {
        if(err) return res.json(err);
        res.render('main/edit', {post:post});
    });
});

router.put('/:id', (req, res) => {
    req.body.updatedAt = Date.now(); 
    Post.findOneAndUpdate({_id:req.params.id}, req.body, (err, post) => {
        if(err) return res.json(err);
        res.redirect("/main/"+req.params.id);
    });
});

router.delete('/:id', (req, res) => {
    Post.deleteOne({_id:req.params.id}, (err) =>{
        if(err) return res.json(err);
        res.redirect('/main');
    })
})

module.exports = router;