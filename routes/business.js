var express = require('express');
var router = express.Router();
var log = require('log4js').getLogger("商务");

var http = require('http');

router.get('/query',(req,res,next) => {
    log.debug("查询");
    // var url = 'http://es2.laizhuan.com/module/new/Convert.php?m=bd_m/userListBd';
    var url = 'http://es1.laizhuan.com/bd_m/userListBd?token=2806fa4883323e9447d425b11bdda02f';
    http.get(url,(resp) => {
        if(resp.statusCode === 200){
            var _data = [];
            resp.on('data',(chunk) => {
                _data.push(chunk.toString('utf-8'));
            });
            resp.on('end',() => {
                var dataObj = JSON.parse(_data.join(''));
                res.json({'success': dataObj})
            })
        }else{
            res.json({'error': resp.statusCode})
        }
    }).on('error', function(e){
        log.error(e);
        res.json({'error':e})
    });
});

router.get('/insert',(req,res,next) => {
    
});

module.exports = router;