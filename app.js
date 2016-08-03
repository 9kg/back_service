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
var task = require('./routes/task');                //任务
var adver = require('./routes/adver');              //广告主
var user = require('./routes/user');                //用户
var guest_user = require('./routes/guest_user');    //特邀用户
var finance = require('./routes/finance');            //报表
var login = require('./routes/login');              //登录
var personal = require('./routes/personal');        //个人信息
var auth = require('./routes/auth');                //权限
var page = require('./routes/page');                //页面展示
var source = require('./routes/source');            //来源列表

// host后指向项目的路径
app.locals.pro_dir = "/back";

// var staticDir = 'public/dev';
var staticDir = 'public/build';
var dir = app.locals.pro_dir;

app.listen(5211);
log4js.configure('./config/log4js.json');

log.debug("应用启动");

app.use(dir,express.static(staticDir));

app.set('views', __dirname+'/'+staticDir+'/html');
app.set('view engine', 'jade');


// replace this with the log4js connect-logger
app.use(log4js.connectLogger(log4js.getLogger("http"), { level: 'auto' }));


app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(dir,favicon(__dirname + '/'+staticDir+'/favicon.ico'));


app.use((req, res, next) => {
    res.set('Access-Control-Allow-Origin','*');
    // res.set('Access-Control-Allow-Origin','http://192.168.1.107:5211');
    // res.set("Access-Control-Allow-Credentials", true);
    next();
});


app.use(auth);
app.use(dir+'/page',page);

app.use(dir+'/promoter',promoter);
app.use(dir+'/business',business);
app.use(dir+'/task',task);
app.use(dir+'/source',source);
app.use(dir+'/adver',adver);
app.use(dir+'/user',user);
app.use(dir+'/finance',finance);
app.use(dir+'/guest_user',guest_user);

app.use(dir+'/login',login);
app.use(dir+'/logout',(req,res,next) => {
    res.clearCookie('token');
    res.redirect('page/login');
});

app.use(dir+'/personal',personal);

// 首页转至欢迎页
app.use(dir+'/page', function(req, res, next) {
    res.redirect(dir+'/page/welcome');
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    res.status(err.status);
    res.render('common/404', {
        message: err.message,
        error: {}
    });
});

// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    log.error("服务器错误:", err);
    res.status(err.status || 500);
    res.json({
        status: -1,
        msg: err.message
    });
});


module.exports = app;