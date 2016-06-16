var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser')
var app = express();
var router = express.Router();

var promoter = require('./routes/promoter');
var user = require('./routes/user');
var login = require('./routes/login');
var auth = require('./routes/auth');

app.listen(9211);

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(cookieParser());
app.use((req, res, next) => {
    res.set('Access-Control-Allow-Origin','*');
    // res.set('Access-Control-Allow-Origin','http://192.168.1.107:5211');
    // res.set("Access-Control-Allow-Credentials", true);
    next();
});


// app.use(auth);
app.use('/promoter',promoter);
app.use('/user',user);

app.use('/login',login);
app.use('/logout',(req,res,next) => {
    res.clearCookie('token');
    res.redirect('http://192.168.1.107:5211/html/common/login.html');
});

module.exports = app;