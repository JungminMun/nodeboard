const mongoose = require('mongoose');

var postSchema = mongoose.Schema({ 
    title : {
        type : String, 
        required:[true,'Title is required!']
    }, body : { 
        type : String, 
        required:[true,'Body is required!']
    }, createdAt : {
        type : Date, 
        default : Date.now
        
    }, author:{
        type:mongoose.Schema.Types.ObjectId, 
        ref:'user', 
        required:true
    }, updatedAt : {
        type : Date
    }, 
});

var Post = mongoose.model('post', postSchema);
module.exports = Post;