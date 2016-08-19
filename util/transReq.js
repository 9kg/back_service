const http = require('http');
const url = require('url');
const querystring = require('querystring');
const log = require('log4js').getLogger("中转请求");

const config = require('../config/app_config.json');
const roles = config.roles;

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
function get(opt, fn) {
    http.get(opt, function(resp) {
        _dealReply(resp,fn);
    }).on('error', function(e) {
        log.error(e);
        fn({ 'error': e })
    });
}
// post方式请求
function post(opt, queryStr, fn) {
    var req = http.request(opt, function(resp) {
        _dealReply(resp,fn);
    });
    req.on('error', function(e) {
        log.error(e);
        fn({ 'error': e })
    });

    req.write(queryStr + "\n");
    req.end();
}

/**
 * 请求转发
 * @param  obj   req  [转发前请求对象]
 * @param  obj   res  [转发前响应对象]
 * @param  str   _url [转发地址(可带参数)]
 * @param  str   desc [当前操作描述]
 * @param  func  fn   [转发后响应回调，如没有 默认 res.json(data)]
 */
module.exports = (req,res,_url,desc,fn) => {
    log.debug(desc);

    const method = req.method;
    const parseUrl = url.parse(_url);

    var queryObj = querystring.parse(parseUrl.query);

    queryObj.m && (queryObj.m = queryObj.m.replace('{role}',roles[res.locals.user.role]));

    queryObj.token = req.cookies.token;

    var opt = {
        host: parseUrl.host
    };
    var renderFn = fn || (data => {res.json(data);});
    if(method === 'POST'){
        queryObj = Object.assign(req.body,queryObj);
        queryObj.cur_page !== undefined && queryObj.cur_page--;
        var queryStr = querystring.stringify(queryObj);

        opt.method = 'POST';
        opt.path = parseUrl.pathname;
        opt.headers = {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': queryStr.length
        };

        post(opt, queryStr, renderFn);
    }else{
        queryObj = Object.assign(req.query,queryObj);
        queryObj.cur_page !== undefined && queryObj.cur_page--;

        opt.pathname = parseUrl.pathname;
        opt.protocol = "http";
        opt.query = queryObj;
        get(url.format(opt),renderFn);
    }
}
