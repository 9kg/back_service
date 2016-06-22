var http = require('http');
var url = require('url');
var querystring = require('querystring');
var log = require('log4js').getLogger("中转请求");

// 处理请求回执
function _dealReply(resp,res){
    resp.setEncoding('utf8');
    if (resp.statusCode === 200) {
        var _data = [];
        resp.on('data', (chunk) => {
            _data.push(chunk);
        });
        resp.on('end', () => {
            try {
                var dataObj = JSON.parse(_data.join(''));
            } catch (e) {
                console.log(_data.join(''));
                log.error('JSON解析失败');
                res.json({ 'error': 'JSON解析失败' });
                return;
            }
            res.json(dataObj);
        })
    } else {
        res.json({ 'error': resp.statusCode })
    }
}
// get方式请求
function get(queryObj, res) {
    var opt = url.format({
        protocol: 'http',
        host: 'es2.laizhuan.com',
        pathname: '/module/new/Convert.php',
        query: queryObj
    });
    http.get(opt, function(resp) {
        _dealReply(resp,res);
    }).on('error', function(e) {
        log.error(e);
        res.json({ 'error': e })
    });
}
// post方式请求
function post(queryObj, res) {
    console.log(queryObj)
    var post_data = querystring.stringify(queryObj);
    var opt = {
        host: 'es2.laizhuan.com',
        path: '/module/new/Convert.php',
        method: 'POST'
    };
    var req = http.request(opt, function(resp) {
        _dealReply(resp,res);
    });
    req.on('error', function(e) {
        log.error(e);
        res.json({ 'error': e })
    });

    req.write(post_data + "\n");
    req.end();
    console.dir(req);
}









module.exports = {
    get: get,
    post: post
}
