var express = require('express');
var router = express.Router();
var log = require('log4js').getLogger("商务");

var transReq = require('../util/transReq');
var role_dir = require('../util/role_dir');


router.get('/query',(req,res,next) => {
    log.debug("来源列表");
    var queryObj = {
        m: role_dir.get(res.locals.role)+'/sourceList'
    };
    queryObj.token = req.cookies.token;
    transReq.get(queryObj,function(data){
        res.json(data);
    });
});

router.post('/insert',(req,res,next) => {
    log.debug("来源添加");
    var queryObj = req.body;
    queryObj.m = role_dir.get(res.locals.role)+'/sourceAdd';
    queryObj.token = req.cookies.token;
    transReq.post(queryObj,function(data){
        res.json(data);
    });
});

router.post('/modify',(req,res,next) => {
    log.debug("来源修改");
    var queryObj = req.body;
    queryObj.m = role_dir.get(res.locals.role)+'/sourceEdit';
    queryObj.token = req.cookies.token;
    transReq.post(queryObj,function(data){
        res.json(data);
    });
});

router.post('/remove',(req,res,next) => {
    log.debug("来源删除");
    var queryObj = req.body;
    queryObj.m = role_dir.get(res.locals.role)+'/sourceDel';
    queryObj.token = req.cookies.token;
    transReq.post(queryObj,function(data){
        res.json(data);
    });
});

module.exports = router;