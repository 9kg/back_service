var express = require('express');
var router = express.Router();
var log = require('log4js').getLogger("商务");

var transReq = require('../util/transReq');

var url_add = 'http://es2.laizhuan.com/module/new/Convert.php?m=bd_m/userAddBd';

router.get('/query',(req,res,next) => {
    log.debug("商务列表");
    var queryObj = {
        m: 'bd_m/userListBd'
    };
    transReq.get(queryObj,function(data){
        res.json(data);
    });
});

router.post('/insert',(req,res,next) => {
    var queryObj = req.body;
    queryObj.m = 'bd_m/userAddBd';
    log.debug("商务添加");
    transReq.post(queryObj,function(data){
        res.json(data);
    });
});

module.exports = router;