var express = require('express');
var router = express.Router();

var user = require('../module/user');

router.get('/query',(req,res,next) => {
    user.query(function(data){
        res.json(data);
    });
});

module.exports = router;