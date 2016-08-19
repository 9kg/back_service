var express = require('express');
var router = express.Router();
var transReq = require('../util/transReq');

var config = require('../config/app_config.json');
var urls = config.transUrl.report;

router.get('/report',(req,res,next) => {
    transReq(req,res,urls.url,'财务报表');
});

module.exports = router;