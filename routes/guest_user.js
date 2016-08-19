var express = require('express');
var router = express.Router();
// var log = require('log4js').getLogger("guest_user");

var guest_user = require('../module/guest_user');

router.get('/query',(req,res,next) => {
    var pid;
    if(res.locals.user.role === 6){
        pid = res.locals.user.id;
    }
    guest_user.query(function(data){
        res.json(data);
    }, pid);
});

router.get('/queryOne',(req,res,next) => {
    guest_user.query(function(data){
        res.json(data);
    });
});

router.post('/insert',(req,res,next) => {
    // 特邀用户模型
    var data = {
        uid: null,
        pid: res.locals.user.id,
        pname: res.locals.user.name,
        type: null,
        name: null,
        fans_num: null,
        fee_date: null,
        fee_per: null,
        fee_other: null
    };
    guest_user.insert(function(data){
        res.json(data);
    },Object.assign(data, req.body));
});

router.post('/modify',(req,res,next) => {
    guest_user.modify(function(data){
        res.json(data);
    }, req.body);
});

router.post('/remove',(req,res,next) => {
    guest_user.remove(function(data){
        res.json(data);
    }, req.body.id);
});

module.exports = router;