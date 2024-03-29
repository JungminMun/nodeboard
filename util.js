var util = {};

util.parseError = (errors) => {
    var parsed = {};
    
    if(errors.name == 'ValidationError'){
        for(var name in errors.errors){
            var validationError = errors.errors[name];
            parsed[name] = { message:validationError.message };
        }
    } else if(errors.code == '11000' && errors.errmsg.indexOf('username') > 0) {
        parsed.username = { message:'This username already exists!' };
    } else {
        parsed.unhandled = JSON.stringify(errors);
    }
    
    return parsed;
}

util.isLoggedin = (req, res, next) => {
    if(req.isAuthenticated()){
        next();
    } else {
        req.flash('errors', {
            login:'Please login first'
        });
        res.redirect('/login');
    }
}

util.noPermission = function(req, res){
    req.flash('errors', {login:"당신은 권한을 가지고 있지 않습니다."});
    req.logout();
    res.redirect('/login');
}

module.exports = util;