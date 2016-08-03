var express = require('express');
var router = express.Router();
// var log = require('log4js').getLogger("guest_user");

var md5 = require('../util/md5');
var guest_user = require('../module/guest_user');

router.get('/query',(req,res,next) => {
    // log.debug("This is in the guest_user module");
    guest_user.query(function(data){
        res.json(data);
    });
});

router.get('/insert',(req,res,next) => {
    guest_user.insert(function(data){
        res.json(data);
    },{
        name: 'testname',
        phone: '18501225532',
        username: 'hahahha',
        password: md5.get('123456')
    });
});

module.exports = router;