var express = require('express');
var router = express.Router();

var promoter = require('../module/promoter');

router.get('/query',(req,res,next) => {
    promoter.query(function(data){
        res.json(data);
    });
});

router.get('/insert',(req,res,next) => {
    promoter.insert(function(data){
        res.json(data);
    },{
        name: 'testname',
        phone: '18501225532',
        username: 'hahahha',
        password: '123456'
    });
});

module.exports = router;