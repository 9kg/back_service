var express = require('express');
var config = require('./config/app_config.json');                   //应用配置
var app = express();

app.listen(config.port);                                            //端口监听

var staticDir = config.staticDir;                                   //静态文件地址
var dir = app.locals.pro_dir = config.pro_dir;                      //host后路径名   改动时需要改动niginx的配置

// 静态文件相关
app.use(dir,express.static(staticDir));                             //静态文件托管
app.set('views', __dirname+'/'+staticDir+'/html');                  //设置模板文件目录
app.set('view engine', 'jade');                                     //设置模板引擎

// 日志记录
var log4js = require('log4js');
log4js.configure('./config/log4js.json');
app.use(log4js.connectLogger(log4js.getLogger("http"), { level: 'auto' }));

// post请求的参数解析
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use(require('cookie-parser')());                                // cookie解析

var favicon = require('serve-favicon');
app.use(dir,favicon(__dirname + '/'+staticDir+'/favicon.ico'));     // 应用favicon图标设置

app.use(require('./util/auth'));                                    // 权限

// 读取routes下文件并以对应文件名设置路由
require("fs").readdirSync('./routes').forEach(function(route){
    app.use(dir+'/'+route.slice(0,-3),require('./routes/'+route));
});

app.use(function(req, res, next) {
    res.status(404);
    res.render('common/404');
});

app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    console.log(err);
    res.json({
        status: -5,
        msg: err.message
    });
});


module.exports = app;