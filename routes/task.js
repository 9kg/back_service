var express = require('express');
var router = express.Router();
var log = require('log4js').getLogger("任务");
var transReq = require('../util/transReq');
var role_dir = require('../util/role_dir');

router.get('/query',(req,res,next) => {
    log.debug("任务列表");
    var queryObj = req.query;
    queryObj.m = role_dir.get(res.locals.role)+'/taskList';
    queryObj.token = req.cookies.token;
    
    transReq.get(queryObj,function(data){
        res.json(data);
    });
});

router.post('/insert',(req,res,next) => {
    log.debug("任务添加");
    var queryObj = req.body;
    queryObj.m = role_dir.get(res.locals.role)+'/taskAdd';
    queryObj.ad_id = queryObj.ad_id || 13;        //广告主id   商务及商务管理员使用  13
    // 此处hack旧接口   不传时赋值为0;
    var task_control = ['steptime_acc','isiPhone','isreg','isWifi','isSim','isJailbreak','isIp','isIpcn','isSided','isIdfa'];
    task_control.forEach(function(item){
        queryObj[item] = queryObj[item] || '0';
    });
    queryObj.token = req.cookies.token;

    transReq.post(queryObj,function(data){
        res.json(data);
    });
});

router.post('/modify',(req,res,next) => {
    log.debug("任务修改");
    var queryObj = req.body;
    queryObj.m = role_dir.get(res.locals.role)+'/taskEdit';
    queryObj.token = req.cookies.token;

    transReq.post(queryObj,function(data){
        res.json(data);
    });
});

router.post('/remove',(req,res,next) => {
    log.debug("任务删除");
    var queryObj = req.body;
    queryObj.m = role_dir.get(res.locals.role)+'/taskDel';
    queryObj.token = req.cookies.token;

    transReq.post(queryObj,function(data){
        res.json(data);
    });
});

router.get('/idfa_query',(req,res,next) => {
    log.debug("idfa查询");
    var queryObj = req.query;
    queryObj.m = role_dir.get(res.locals.role)+'/idfaList';
    queryObj.token = req.cookies.token;

    transReq.post(queryObj,function(data){
        res.json(data);
    });
});

module.exports = router;