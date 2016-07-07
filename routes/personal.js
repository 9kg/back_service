var express = require('express');
var pool = require('../util/pool').pool;
var md5 = require('../util/md5');
var router = express.Router();
var log = require('log4js').getLogger("个人信息");
var role_dir = require('../util/role_dir');
var transReq = require('../util/transReq');

var menus = require('../config/menu.json');
// DATE_FORMAT(FROM_UNIXTIME(max(UNIX_TIMESTAMP(d.createdAt))),"%Y-%m-%d %H:%i:%s")
var sql_personal = 'select id,name,phone,username,role,money,DATE_FORMAT(createdAt,"%Y-%m-%d %H:%i:%s") as createdAt,DATE_FORMAT(updatedAt,"%Y-%m-%d %H:%i:%s") as updatedAt,pname,pid from `bg_user` where `token` = ?';
router.get('/', (req, res, next) => {
    var token = req.cookies.token;
    pool.query(sql_personal, [token], function(err, rows, fields) {
        if (err) {
            log.error(err);
        };
        res.render('common/personal', {renderData: rows[0],menus:menus});
    });
});

router.post('/modify',(req,res,next) => {
    log.debug("个人信息修改");
    var queryObj = req.body;
    queryObj.m = role_dir.get(res.locals.role)+'/userEdit';
    queryObj.token = req.cookies.token;
    transReq.post(queryObj,function(data){
        res.json(data);
    });
});

module.exports = router;
