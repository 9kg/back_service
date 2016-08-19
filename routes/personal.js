var express = require('express');
var pool = require('../util/pool').pool;
var md5 = require('../util/md5');
var router = express.Router();

var transReq = require('../util/transReq');

var config = require('../config/app_config.json');
var roles = config.roles;
var menus = config.menus;
var urls = config.transUrl.personal;
// DATE_FORMAT(FROM_UNIXTIME(max(UNIX_TIMESTAMP(d.createdAt))),"%Y-%m-%d %H:%i:%s")
var sql_personal = 'select id,name,phone,username,role,money,DATE_FORMAT(createdAt,"%Y-%m-%d %H:%i:%s") as createdAt,DATE_FORMAT(updatedAt,"%Y-%m-%d %H:%i:%s") as updatedAt,pname,pid from `bg_user` where `token` = ?';
router.get('/', (req, res, next) => {
    var token = req.cookies.token;
    var role = res.locals.user.role;
    pool.query(sql_personal, [token], function(err, rows, fields) {
        if (err) {
            log.error(err);
        };
        res.render('common/personal', {renderData: rows[0],menus:menus,role: role});
    });
});

router.post('/modify',(req,res,next) => {
    // var queryObj = req.body;
    // queryObj.m = roles[res.locals.user.role]+'/userEdit';
    // queryObj.token = req.cookies.token;
    // transReq.post(queryObj,function(data){
    //     res.json(data);
    // });
    transReq(req,res,urls.modify,'个人信息修改');
});

module.exports = router;
