var express = require('express');
var router = express.Router();
var transReq = require('../util/transReq');

var config = require('../config/app_config.json');
var urls = config.transUrl.task;

router.get('/query',(req,res,next) => {
    transReq(req,res,urls.query,'任务列表');
});

router.post('/insert',(req,res,next) => {
    //广告主id   商务及商务管理员使用  13
    req.body.ad_id = req.body.ad_id || 13;
    // 此处hack旧接口   不传时赋值为0;
    var task_control = ['steptime_acc','isiPhone','isreg','isWifi','isSim','isJailbreak','isIp','isIpcn','isSided','isIdfa'];
    task_control.forEach(function(item){
        req.body[item] = req.body[item] || '0';
    });
    transReq(req,res,urls.insert,'添加任务');
});

router.post('/modify',(req,res,next) => {
    transReq(req,res,urls.modify,'修改任务');
});

router.post('/remove',(req,res,next) => {
    transReq(req,res,urls.remove,'修改任务');
});

router.get('/idfa_query',(req,res,next) => {
    // 那边只支持post
    req.method = "POST";
    req.body = req.query;
    transReq(req,res,urls.idfa_query,'IDFA列表');
});

router.post('/change_num',(req,res,next) => {
    transReq(req,res,urls.change_num,'任务改量');
});

module.exports = router;