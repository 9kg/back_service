var express = require('express');
var router = express.Router();
var log = require('log4js').getLogger("商务");
var role_dir = require('../util/role_dir');

var transReq = require('../util/transReq');

var url_add = 'http://es2.laizhuan.com/module/new/Convert.php?m=bd_m/userAddBd';

router.get('/query',(req,res,next) => {
    log.debug("商务列表");
    var queryObj = {
        m: role_dir.get(res.locals.role)+'/userListBd'
    };
    queryObj.token = req.cookies.token;
    transReq.get(queryObj,function(data){
        res.json(data);
    });
});

router.post('/insert',(req,res,next) => {
    log.debug("商务添加");
    var queryObj = req.body;
    queryObj.m = role_dir.get(res.locals.role)+'/userAddBd';
    queryObj.token = req.cookies.token;
    transReq.post(queryObj,function(data){
        res.json(data);
    });
});

router.post('/edit',(req,res,next) => {
    log.debug("商务修改");
    var queryObj = req.body;
    queryObj.m = role_dir.get(res.locals.role)+'/userEdit';
    queryObj.token = req.cookies.token;
    transReq.post(queryObj,function(data){
        res.json(data);
    });
});

module.exports = router;