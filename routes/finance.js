var express = require('express');
var router = express.Router();
var transReq = require('../util/transReq');

var finance = require('../module/finance');
var config = require('../config/app_config.json');
var urls = config.transUrl.report;

router.get('/report',(req,res,next) => {
    transReq(req,res,urls.url,'财务报表');
});

router.get('/cashout_query',(req,res,next) => {
    var obj = {
        page_size: +req.query.page_size,
        cur_page: +req.query.cur_page,
        sort: req.query.sort,
        sort_dir: req.query.sort_dir,
        filter_key: req.query.filter_key,
        filter_val: req.query.filter_val
    };
    finance.cashout_query(function(data){
        res.json(data);
    }, obj);
});

module.exports = router;