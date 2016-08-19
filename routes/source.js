var express = require('express');
var router = express.Router();
var transReq = require('../util/transReq');

var config = require('../config/app_config.json');
var urls = config.transUrl.source;


router.get('/query',(req,res,next) => {
    transReq(req,res,urls.query,'来源列表');
});

router.post('/insert',(req,res,next) => {
    transReq(req,res,urls.insert,'来源添加');
});

router.post('/modify',(req,res,next) => {
    transReq(req,res,urls.modify,'来源修改');
});

router.post('/remove',(req,res,next) => {
    transReq(req,res,urls.remove,'来源删除');
});

module.exports = router;