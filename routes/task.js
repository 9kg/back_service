var express = require('express');
var router = express.Router();
var log = require('log4js').getLogger("任务");
var transReq = require('../util/transReq');

router.get('/query',(req,res,next) => {
    log.debug("任务列表");
    var queryObj = req.query;
    queryObj.m = 'bd_m/taskList';
    queryObj.cur_page--;
    
    transReq.get(queryObj,function(data){
        res.json(data);
    });
});

router.post('/insert',(req,res,next) => {
    var queryObj = req.body;
    queryObj.m = 'bd_m/taskAdd';
    queryObj.ad_id = 13;        //广告主id   商务及商务管理员使用  13
    // 此处hack旧接口   不传时赋值为0;
    var task_control = ['steptime_acc','isiPhone','isreg','isWifi','isSim','isJailbreak','isIp','isIpcn','isSided','isIdfa'];
    task_control.forEach(function(item){
        queryObj[item] = queryObj[item] || '0';
    });

    log.debug("任务添加");
    transReq.post(queryObj,function(data){
        res.json(data);
    });
});

module.exports = router;