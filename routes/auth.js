var express = require('express');
var pool = require('../util/pool').pool;
var router = express.Router();
var log = require('log4js').getLogger("权限");


// 无需登录页面及接口
var page_all = ['login', '404', 'error', 'deny'];
var interface_all = ['login', 'logout'];

router.use(function(req, res, next) {
    var is_page = ~req.path.indexOf('/page/');
    var token = req.cookies.token;
    var dir = req.app.locals.pro_dir;
    if(req.path === dir+'/'){
        res.redirect(dir+'/page/welcome');
    }else if(token){
        var sql_auth = 'select role from `bg_user` where `token` = ?';
        pool.query(sql_auth, [token], function(err, rows, fields) {
            if (err) {
                log.error(err);
                res.clearCookie('token',{ path: '/' });
                res.clearCookie('token',{ path: '/page' });
                res.redirect(dir+'/page/error');
            }else{
                if(rows.length){
                    res.locals.role = rows[0].role;
                    next();
                }else{
                    res.clearCookie('token',{ path: '/' });
                    res.clearCookie('token',{ path: '/page' });
                    res.redirect(dir+'/page/login');
                }
            }
        });
    }else{
        if(is_page){
            var path_exact = req.path.slice(dir.length+6);
            if(~page_all.indexOf(path_exact)){
                next();
            }else{
                res.redirect(dir+'/page/login');
            }
        }else{
            var path_exact = req.path.slice(dir.length+1);
            if(~interface_all.indexOf(path_exact) || !path_exact){
                next();
            }else{
                res.json({
                    status: -1,
                    msg: "请登录"
                });
            }
        }
    }
});


module.exports = router;