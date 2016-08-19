var express = require('express');
var router = express.Router();
var transReq = require('../util/transReq');

var config = require('../config/app_config.json');
var urls = config.transUrl.business;

router.get('/query',(req,res,next) => {
    transReq(req,res,urls.query,'商务列表');
});

router.post('/insert',(req,res,next) => {
    transReq(req,res,urls.insert,'商务添加');
});

router.post('/edit',(req,res,next) => {
    transReq(req,res,urls.edit,'商务修改');
});

module.exports = router;