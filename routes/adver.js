var express = require('express');
var router = express.Router();
var log = require('log4js').getLogger("广告主");
var transReq = require('../util/transReq');

var md5 = require('../util/md5');
var role_dir = require('../util/role_dir');

// 查询广告主列表
router.get('/query',(req,res,next) => {
    log.debug("广告主列表");
    var queryObj = {
        m: role_dir.get(res.locals.role)+'/userListAd'
    };
    queryObj.token = req.cookies.token;
    transReq.get(queryObj,function(data){
        res.json(data);
    });
});

// 查询充值记录
router.get('/recharge_records',(req,res,next) => {
    log.debug("充值列表");
    var queryObj = {
        m: role_dir.get(res.locals.role)+'/adChargeRecord',
        id: req.query.id
    };
    queryObj.token = req.cookies.token;
    transReq.get(queryObj,function(data){
        res.json(data);
    });
});

// 广告主添加
router.post('/insert',(req,res,next) => {
    log.debug("广告主添加");
    var queryObj = req.body;
    queryObj.m = role_dir.get(res.locals.role)+'/userAddAd';

    queryObj.token = req.cookies.token;
    transReq.post(queryObj,function(data){
        res.json(data);
    });
});

// 广告主修改
router.post('/edit',(req,res,next) => {
    log.debug("广告主修改");
    var queryObj = req.body;
    queryObj.m = role_dir.get(res.locals.role)+'/userEdit';
    queryObj.token = req.cookies.token;
    transReq.post(queryObj,function(data){
        res.json(data);
    });
});

// 广告主充值
router.post('/recharge',(req,res,next) => {
    log.debug("广告主充值");
    var queryObj = req.body;
    queryObj.m = role_dir.get(res.locals.role)+'/adCharge';
    queryObj.token = req.cookies.token;
    transReq.post(queryObj,function(data){
        res.json(data);
    });
});

module.exports = router;