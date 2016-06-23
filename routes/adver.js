var express = require('express');
var router = express.Router();
var log = require('log4js').getLogger("广告主");
var transReq = require('../util/transReq');

var md5 = require('../util/md5');

router.get('/query',(req,res,next) => {
    log.debug("广告主列表");
    var queryObj = {
        m: 'bd_m/userListAd'
    };
    transReq.get(queryObj,function(data){
        res.json(data);
    });
});

router.post('/insert',(req,res,next) => {
    var queryObj = req.body;
    queryObj.m = 'bd_m/userAddAd';

    log.debug("广告主添加");
    transReq.post(queryObj,function(data){
        res.json(data);
    });
});

module.exports = router;