const express = require('express');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const bodyParser = require('body-parser');
const flash = require('connect-flash');
const session = require('express-session');
const mongooseConnect = require('./models/mongoose');
const passport = require('./config/passport');
const app = express();

app.set('view engine', 'ejs');
app.use(express.static(__dirname+'/public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(methodOverride('_method'));
app.use(flash()); 
app.use(session({
    secret:'MySecret', 
    resave:true, 
    saveUninitialized:true
})); 
app.use(passport.initialize());
app.use(passport.session());

app.use((req,res,next) => {
    res.locals.isAuthenticated = req.isAuthenticated();
    res.locals.currentUser = req.user;
    next();
});

app.use('/', require('./routes/home'));
app.use('/main', require('./routes/posts'));
app.use('/users', require('./routes/users'));

app.listen(3000, () => {
    console.log('Connected ! http://localhost:3000');
})