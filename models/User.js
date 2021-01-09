const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// schema
// trim => 문자열 앞뒤에 빈칸이 있으면 빈칸을 제거해 주는 옵션
var userSchema = mongoose.Schema({
    username:{
        type:String, 
        required:[true,'Username is required!'], 
        match:[/^.{4,12}$/,'Should be 4-12 characters!'],
        trim:true,
        unique:true
    },
    password:{
        type:String, 
        required:[true,'Password is required!'], 
        select:false
    },
    name:{   
        type:String, 
        required:[true,'Name is required!'],
        match:[/^.{4,12}$/,'Should be 4-12 characters!'],
        trim:true
    },
    email:{
        type:String,
        match:[/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,'Should be a vaild email address!'],
        trim:true
    },
    isAdmin : {
        type:Boolean,
        default: 0
    }
},{
    toObject:{
        virtuals:true
    }
});

// virtuals
userSchema.virtual('passwordConfirmation')
    .get(function(){ return this._passwordConfirmation; })
    .set(function(value){ this._passwordConfirmation=value; });

userSchema.virtual('originalPassword')
    .get(function(){ return this._originalPassword; })
    .set(function(value){ this._originalPassword=value; });

userSchema.virtual('currentPassword')
    .get(function(){ return this._currentPassword; })
    .set(function(value){ this._currentPassword=value; });

userSchema.virtual('newPassword')
    .get(function(){ return this._newPassword; })
    .set(function(value){ this._newPassword=value; });

var passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[$@$!%*#?&])[A-Za-z\d$@$!%*#?&]{8,}$/;
var passwordRegexErrorMessage = '8자 이상의 문자와 특수문자를 포함하여 작성하여 주세요 !';

userSchema.path('password').validate(function(v) {
    var user = this;

    if(user.isNew){
        if(!user.passwordConfirmation){
            user.invalidate('passwordConfirmation', '비밀번호를 작성하여 주세요 !');
        }
        if(!passwordRegex.test(user.password)){
            user.invalidate('password', passwordRegexErrorMessage);
        } else if(user.password !== user.passwordConfirmation) {
            user.invalidate('passwordConfirmation', '비밀번호가 일치하지 않아요 !');
        }
    }
    if(!user.isNew){
        if(!user.currentPassword){
            user.invalidate('currentPassword', '기존 비밀번호를 작성하여 주세요!');
        } else if(!bcrypt.compareSync(user.currentPassword, user.originalPassword)){
            user.invalidate('currentPassword', '기존 비밀번호가 일치하지 않아요!');
        }

        if(user.newPassword && !passwordRegex.test(user.newPassword)){ 
            user.invalidate('newPassword', passwordRegexErrorMessage);
        } else if(user.newPassword !== user.passwordConfirmation) {
            user.invalidate('passwordConfirmation', '비밀번호가 일치하지 않아요!');
        }
    }
});

userSchema.pre('save', function (next){
    var user = this;
    if(!user.isModified('password')){
        return next();
    }
    else {
        user.password = bcrypt.hashSync(user.password);
        return next();
    }
});
  
userSchema.methods.authenticate = function (password) {
    var user = this;
    return bcrypt.compareSync(password,user.password);
};
  
var User = mongoose.model('user',userSchema);
module.exports = User;