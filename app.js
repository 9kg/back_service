var log4js = require('log4js');
var express = require('express');
var favicon = require('serve-favicon');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser')
var log = log4js.getLogger("app");


var app = express();
var router = express.Router();

var promoter = require('./routes/promoter');        //推广
var business = require('./routes/business');        //商务
var adver = require('./routes/adver');              //广告主
var user = require('./routes/user');                //用户
var guest_user = require('./routes/guest_user');    //特邀用户
var login = require('./routes/login');              //登录
var auth = require('./routes/auth');                //权限

var staticDir = 'public/dev';

app.listen(9211);
log4js.configure('./config/log4js.json');

log.debug("应用启动");

app.use(express.static(staticDir));

app.set('views', __dirname+'/'+staticDir+'/html');
app.set('view engine', 'jade');



// app.use(favicon());

// replace this with the log4js connect-logger
app.use(log4js.connectLogger(log4js.getLogger("http"), { level: 'auto' }));


app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(favicon(__dirname + '/'+staticDir+'/favicon.ico'));


app.use((req, res, next) => {
    res.set('Access-Control-Allow-Origin','*');
    // res.set('Access-Control-Allow-Origin','http://192.168.1.107:5211');
    // res.set("Access-Control-Allow-Credentials", true);
    next();
});


// app.use(auth);
app.use('/promoter',promoter);
app.use('/business',business);
app.use('/adver',adver);
app.use('/user',user);
app.use('/guest_user',guest_user);

app.use('/login',login);
app.use('/logout',(req,res,next) => {
    res.clearCookie('token');
    res.redirect('http://192.168.1.107:5211/html/common/login.html');
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    res.render('common/404', {
        message: err.message,
        error: {}
    });
});

// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    log.error("服务器错误:", err);
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;