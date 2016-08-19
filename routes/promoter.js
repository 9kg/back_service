var express = require('express');
var router = express.Router();
var log = require('log4js').getLogger("推广模块");

var md5 = require('../util/md5');
var promoter = require('../module/promoter');

router.get('/query',(req,res,next) => {
    promoter.query(function(data){
        res.json(data);
    });
});

router.get('/queryOne',(req,res,next) => {
    promoter.queryOne(function(data){
        res.json(data);
    },req.query.id);
});

router.post('/modify',(req,res,next) => {
    if(req.body.password){
       req.body.password = md5.get(req.body.password);
       req.body.token = null;
    }
    promoter.modify(function(data){
        res.json(data);
    },req.body);
});

router.post('/remove',(req,res,next) => {
    promoter.remove(function(data){
        res.json(data);
    },req.body.id);
});

router.post('/insert',(req,res,next) => {
    // 推广人员模型
    var data = {
        role: 6,
        pid: res.locals.user.id,
        prole: res.locals.user.role,
        pname: res.locals.user.name
    };
    req.body.password = md5.get(req.body.password);
    promoter.insert(function(data){
        res.json(data);
    },Object.assign(data, req.body));
});

module.exports = router;