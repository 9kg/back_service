var http = require('http');
var url = require('url');
var querystring = require('querystring');
var log = require('log4js').getLogger("中转请求");

// 处理请求回执
function _dealReply(resp,fn){
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
                log.error('JSON解析失败');
                fn({ 'error': 'JSON解析失败' });
                return;
            }
            fn(dataObj);
        })
    } else {
        fn({ 'error': resp.statusCode });
    }
}
// get方式请求
function get(queryObj, fn) {
    queryObj.cur_page !== undefined && queryObj.cur_page--;
    var opt = url.format({
        protocol: 'http',
        host: 'es2.laizhuan.com',
        pathname: '/module/new/Convert.php',
        query: queryObj
    });
    http.get(opt, function(resp) {
        _dealReply(resp,fn);
    }).on('error', function(e) {
        log.error(e);
        fn({ 'error': e })
    });
}
// post方式请求
function post(queryObj, fn) {
    queryObj.cur_page !== undefined && queryObj.cur_page--;
    var post_data = querystring.stringify(queryObj);
    var opt = {
        host: 'es2.laizhuan.com',
        path: '/module/new/Convert.php',
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': post_data.length
        }
    };
    var req = http.request(opt, function(resp) {
        _dealReply(resp,fn);
    });
    req.on('error', function(e) {
        log.error(e);
        fn({ 'error': e })
    });

    req.write(post_data + "\n");
    req.end();
}

module.exports = {
    get: get,
    post: post
}
