var express = require('express');
var router = express.Router();
var log = require('log4js').getLogger("任务");
var transReq = require('../util/transReq');

router.get('/query',(req,res,next) => {
    log.debug("商务列表");
    var queryObj = req.query;
    queryObj.m = 'bd_m/taskList';
    queryObj.cur_page = +queryObj.cur_page - 1;
    
    transReq.get(queryObj,res);
});

router.post('/insert',(req,res,next) => {
    log.debug("商务添加");
    transReq.get(url_add,res);
});

module.exports = router;