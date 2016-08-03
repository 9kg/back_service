var express = require('express');
var router = express.Router();
var log = require('log4js').getLogger("报表");
var role_dir = require('../util/role_dir');

var transReq = require('../util/transReq');

var url = '/module/report/interface.php';

router.get('/report',(req,res,next) => {
    log.debug("财务报表");
    var queryObj = {
        method: 'readReport',
        sdate: req.query.sdate,
        edate: req.query.edate
    };
    queryObj.token = req.cookies.token;
    transReq.get(queryObj,function(data){
        res.json(data);
    },url);
});

module.exports = router;