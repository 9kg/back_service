var express = require('express');
var router = express.Router();
var transReq = require('../util/transReq');

var finance = require('../module/finance');
var config = require('../config/app_config.json');
var urls = config.transUrl;

router.get('/report',(req,res,next) => {
    transReq(req,res,urls.report.url,'财务报表');
});

router.get('/cash_record_query',(req,res,next) => {
    var obj = {
        page_size: +req.query.page_size,
        cur_page: +req.query.cur_page,
        sort: req.query.sort,
        sort_dir: req.query.sort_dir,
        filter_key: req.query.filter_key,
        filter_val: req.query.filter_val
    };
    finance.cash_record_query(function(data){
        res.json(data);
    }, obj);
});

router.get('/settlement_query',(req,res,next) => {
    transReq(req,res,urls.withdraw.settlement_query,'推广费结算列表');
});
router.get('/settlement_confirm',(req,res,next) => {
    transReq(req,res,urls.withdraw.settlement_confirm,'推广费结算确认');
});

router.get('/cashout_query',(req,res,next) => {
    transReq(req,res,urls.withdraw.cashout_query,'提现申请列表');
});

router.post('/cashout_disagree',(req,res,next) => {
    transReq(req,res,urls.withdraw.cashout_disagree,'拒绝提现申请');
});


module.exports = router;