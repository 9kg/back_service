var express = require('express');
var router = express.Router();
var transReq = require('../util/transReq');

var config = require('../config/app_config.json');
var urls = config.transUrl.adver;

router.get('/query',(req,res,next) => {
    transReq(req,res,urls.query,'广告主列表');
});

router.get('/recharge_records',(req,res,next) => {
    transReq(req,res,urls.recharge_records,'充值列表');
});

router.post('/insert',(req,res,next) => {
    transReq(req,res,urls.insert,'广告主添加');
});

router.post('/edit',(req,res,next) => {
    transReq(req,res,urls.edit,'广告主修改');
});

router.post('/recharge',(req,res,next) => {
    transReq(req,res,urls.recharge,'广告主充值');
});

module.exports = router;