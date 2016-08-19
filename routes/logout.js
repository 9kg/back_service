var express = require('express');
var router = express.Router();
var log = require('log4js').getLogger("登出");

router.use('/', (req, res, next) => {
    log.debug("登出");
    res.clearCookie('token');
    res.redirect('page/login');
});

module.exports = router;
