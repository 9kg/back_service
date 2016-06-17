var express = require('express');
var router = express.Router();

var user = require('../module/user');

router.get('/query',(req,res,next) => {
    var obj = {
        page_size: +req.query.page_size,
        cur_page: +req.query.cur_page,
        sort: req.query.sort,
        sort_dir: req.query.sort_dir,
        filter_key: req.query.filter_key,
        filter_val: req.query.filter_val
    };
    user.query(function(data){
        res.json(data);
    },obj);
});

module.exports = router;