var express = require('express');
var pool = require('../util/pool').pool;
var router = express.Router();

router.all('*',(req,res,next) => {
    var token = req.cookies.token;
    console.log('Cookies: ', token);
    if(token){
        next();
    }else{
        console.log('没cookie');
        // res.redirect('http://192.168.1.107:5211/html/common/login.html');
    }
});

module.exports = router;