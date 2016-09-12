var pool = require('../util/pool').pool_lz;

var forbiden_uid_str = "'27e79825ea','76859ae636','3af25ef3d6','a865a76328','98bgaf5896','3533fac679','6997e29a97','33cad3f8b6','839fd58296','7773725732','be9dcc8dd3','79eac2996b','d7e8g59667','82a9b76cb2','ee9698g696','d3927838b6','fdd6fae26e','abbg2ae266','bfeb868a66','288f6e9cc9','bgbd3263g2','82229d2863','d3927838b6','fdd6fae26e','abbg2ae266','bfeb868a66','288f6e9cc9','bgbd3263g2','82229d2863','8eadd6c8f9','7936c86cge','f9ae369f8b','886ff792ge','9abdg6dg32','697efd9976','a976g6g799','c766f6be38','29d6f3e9a3','328b987396','c8a2e2be76','666978e8be','8b78628e8e','666978e8be','6abbc9cdd7','d62ec6b962','6gf3b7e9a3','f78d68gf98','baf286de62','6992af226d','fb7683b7a3','2g3bc38776','6dbbg83bg3','6d883d22e7','e87ge9g926','a78b688deg','3989886276','6e637b872f','389g8e2ccf','a99266e3be','7eda82c6c6','7eda82c6c6','7fcd8d3ec6','38273fdgfg','2289682326','f73dga3d67','796e93287f','7797fdd68f','82f8989f26','g3b9b77789','2ada88fc9f','9g8a7d98e3','8962b88b68','77d982323g','cc777fd82a','bbcd3df3a9','c2826626e2','d8bb28b388','e3d8ae6b2g','68a9g2939e','efe6g28722','cae9787f69','7c863bc8g2','f9g2963g93','8783287932','8783287932','2626e39869','g2f7b86f77','cfcaee8389','96dgb2a8ee','6876g933b2','a72g282872','f9b27a7622','bd015d0abd','bd9b06ddb','fd699b692g','f7c2f22cbf','fe3dc29822','bd89e8c79d','2829c692d2','8ec989d822','a37c68cdfb','f39f662e26','a9e39a2fbe','g9cc6f6782','3cd2266682','2993f27d6f','38gb236ef6','d29b388692','c93760fb73','f39f662e26','2a326c627g'";

// '82e378ea3c', 9月9日  李确认恢复
var fields = {
    'uid': 'a.uid',
    'nickname': 'b.wx_name',
    'price': 'a.price',
    'createdAt': "a.createdAt",
    'alipay': 'b.alipay',
    'alipay_name': 'b.alipay_name'
};
// 查全部申请
function cashout_query(fn, data){
    var _len = data.page_size;              //每页记录数
    var _start = (data.cur_page-1)*_len;    //每页起始记录位置
    var _sort = fields[data.sort];          //排序字段
    var _sort_dir = data.sort_dir || '';    //排序方向
    var f_k = data.filter_key;
    var _filter_key = fields[f_k];          //搜索字段
    var _filter_val = data.filter_val;      //搜索值

    var sql_cashout_query = "select DATE_FORMAT(a.createdAt,'%Y-%m-%d %H:%i:%s') as createdAt,a.uid,a.did,a.price,a.errmsg,a.etime,a.objectId,b.alipay,b.alipay_name,b.wx_name as nickname from pnow a left join uid b on a.uid=b.objectId where a.uid not in ("+forbiden_uid_str+") and (a.etime is null or a.etime='' or a.etime=0) and (a.errmsg is null or a.errmsg='') and (a.errtime is null or a.errtime=0 or a.errtime='') and (a.duiba_stime is null or a.duiba_stime='' or a.duiba_stime=0) and (a.duiba_order is null or a.duiba_order='') and ?? like ? group by a.id order by ?? "+_sort_dir+" limit ?,?;select count(*) as count from pnow a left join uid b on a.uid=b.objectId where a.uid not in ("+forbiden_uid_str+") and (a.etime is null or a.etime='' or a.etime=0) and (a.errmsg is null or a.errmsg='') and (a.errtime is null or a.errtime=0 or a.errtime='') and (a.duiba_stime is null or a.duiba_stime='' or a.duiba_stime=0) and (a.duiba_order is null or a.duiba_order='') and ?? like ?";

    pool.query(sql_cashout_query, [_filter_key, '%'+_filter_val+'%', _sort, _start, _len, _filter_key, '%'+_filter_val+'%'], function(err, rows, fields) {
        if(err){
            console.log(err);
        };
        fn && fn(err || {status: 1, data: rows[0], total: rows[1][0].count});
    });
}

var fields2 = {
    'uid': 'a.uid',
    'nickname': 'b.wx_name',
    'price': 'a.price',
    'createdAt': "a.createdAt",
    'updatedAt': "a.updatedAt",
    'alipay': 'b.alipay',
    'alipay_name': 'b.alipay_name'
};
// 查全部已处理记录
function cash_record_query(fn, data){
    var _len = data.page_size;              //每页记录数
    var _start = (data.cur_page-1)*_len;    //每页起始记录位置
    var _sort = fields2[data.sort];          //排序字段
    var _sort_dir = data.sort_dir || '';    //排序方向
    var f_k = data.filter_key;
    var _filter_key = fields2[f_k];          //搜索字段
    var _filter_val = data.filter_val;      //搜索值

    var sql_cash_record_query = "select DATE_FORMAT(a.createdAt,'%Y-%m-%d %H:%i:%s') as createdAt, DATE_FORMAT(a.updatedAt,'%Y-%m-%d %H:%i:%s') as updatedAt,a.uid,a.did,a.price,a.errmsg,a.etime,a.objectId,b.alipay,b.alipay_name,a.errmsg,a.duiba_order,a.alipay_id,b.wx_name as nickname from pnow a left join uid b on a.uid=b.objectId where a.uid not in ("+forbiden_uid_str+") and ((a.etime is not null and a.etime!='' and a.etime!=0) or (a.errmsg is not null and a.errmsg!='' and a.errtime is not null and a.errtime!=0 and a.errtime!='')) and ?? like ? group by a.id order by ?? "+_sort_dir+" limit ?,?;select count(*) as count from pnow a left join uid b on a.uid=b.objectId where a.uid not in ("+forbiden_uid_str+") and ((a.etime is not null and a.etime!='' and a.etime!=0) or (a.errmsg is not null and a.errmsg!='' and a.errtime is not null and a.errtime!=0 and a.errtime!='')) and ?? like ?";

    pool.query(sql_cash_record_query, [_filter_key, '%'+_filter_val+'%', _sort, _start, _len, _filter_key, '%'+_filter_val+'%'], function(err, rows, fields) {
        if(err){
            console.log(err);
        };
        fn && fn(err || {status: 1, data: rows[0], total: rows[1][0].count});
    });
}
module.exports = {
    cashout_query: cashout_query,
    cash_record_query: cash_record_query
};